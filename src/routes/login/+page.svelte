<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

Yo gimmie ur cookie
<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}}
>
	<input type="text" name="cookie" placeholder="a cookie" />
	<button type="submit" disabled={submitting}>{submitting ? 'Testing…' : 'Submit'}</button>
</form>

{#if form?.error}
	<p>{form.error}</p>
{/if}
