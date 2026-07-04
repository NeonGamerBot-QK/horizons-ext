import { redirect } from '@sveltejs/kit';
import { getUserInfo } from '$lib/util/rest';
import type { PageServerLoad } from './$types';

// Server-side guard: /app is only reachable with a cookie that horizons
// still accepts. Anything else gets sent to the login page.
export const load: PageServerLoad = async ({ request }) => {
	const cookieHeader = request.headers.get('cookie');

	try {
		if (!cookieHeader) {
			throw new Error('no cookie sent');
		}
		await getUserInfo(cookieHeader);
	} catch {
		redirect(303, '/login');
	}
};
