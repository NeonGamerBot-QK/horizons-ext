import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// The index page is just an entry point: always forward to /app, whose own
// guard bounces unauthenticated visitors to /login.
export const load: PageServerLoad = async () => {
	redirect(303, '/app');
};
