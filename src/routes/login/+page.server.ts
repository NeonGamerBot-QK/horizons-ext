import { fail, redirect } from '@sveltejs/kit';
import { getUserInfo } from '$lib/util/rest';
import type { Actions, PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ request }) => {
	// The stored session cookie can be under any name (whatever the pasted
	// blob called it), so re-check auth by forwarding whatever the browser
	// sent rather than looking for a fixed cookie name.
	const cookieHeader = request.headers.get('cookie');
	if (cookieHeader) {
		// redirect() throws internally, so it must stay outside the try/catch
		// or the catch below would swallow it as a failed auth check.
		let authenticated = false;
		try {
			await getUserInfo(cookieHeader);
			authenticated = true;
		} catch {
			// Not authenticated, stay on the login page.
		}
		if (authenticated) {
			redirect(303, '/app');
		}
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const rawCookie = formData.get('cookie');

		if (typeof rawCookie !== 'string' || !rawCookie.trim()) {
			return fail(400, { error: 'Paste a cookie value first.' });
		}

		// Cookies copied from devtools are the whole jar, and horizons may need
		// more than just the session token (e.g. a CSRF cookie alongside it),
		// so test them together as a set rather than one at a time.
		const candidates = parseCookieCandidates(rawCookie);

		if (!candidates.length) {
			return fail(400, { error: 'Paste a cookie value first.' });
		}

		const combinedCookieHeader = candidates
			.map((candidate) => `${candidate.name}=${candidate.value}`)
			.join('; ');

		try {
			await getUserInfo(combinedCookieHeader);
		} catch {
			return fail(400, { error: 'The pasted cookies did not authenticate successfully.' });
		}

		for (const candidate of candidates) {
			cookies.set(candidate.name, candidate.value, {
				path: '/',
				httpOnly: false,
				sameSite: 'lax'
			});
		}

		redirect(303, '/app');
	}
};
