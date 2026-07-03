import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const AUTH_CHECK_URL = 'https://horizons.hackclub.com/api/user/auth/me';

interface CookieCandidate {
	name: string;
	value: string;
}

function parseCookieCandidates(raw: string): CookieCandidate[] {
	return raw
		.split(';')
		.map((pair) => pair.trim())
		.filter(Boolean)
		.map((pair) => {
			const separatorIndex = pair.indexOf('=');
			return {
				name: pair.slice(0, separatorIndex).trim(),
				value: pair.slice(separatorIndex + 1).trim()
			};
		})
		.filter((cookie) => cookie.name && cookie.value);
}

async function isAuthenticated(cookieHeader: string): Promise<boolean> {
	try {
		const response = await fetch(AUTH_CHECK_URL, {
			headers: { Cookie: cookieHeader }
		});
		return response.ok;
	} catch {
		return false;
	}
}

export const load: PageServerLoad = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');

	// The stored session cookie can be under any name (whatever the pasted
	// blob called it), so re-check auth by forwarding whatever the browser
	// sent rather than looking for a fixed cookie name.
	if (cookieHeader && (await isAuthenticated(cookieHeader))) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const rawCookie = formData.get('cookie');

		if (typeof rawCookie !== 'string' || !rawCookie.trim()) {
			return fail(400, { error: 'Paste a cookie value first.' });
		}

		// Cookies copied from devtools are the whole jar, not just the session
		// token, so test each candidate individually to find the one
		// horizons.hackclub.com actually accepts.
		const candidates = parseCookieCandidates(rawCookie);

		for (const candidate of candidates) {
			if (await isAuthenticated(`${candidate.name}=${candidate.value}`)) {
				cookies.set(candidate.name, candidate.value, {
					path: '/',
					httpOnly: false,
					sameSite: 'lax'
				});
				redirect(303, '/');
			}
		}

		return fail(400, { error: 'None of the pasted cookies authenticated successfully.' });
	}
};
