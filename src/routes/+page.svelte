<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// if login cookie exists then redir to /app
		if (window.document.cookie.includes('cookie')) {
			window.location.href = '/app';
		}
	});
</script>

<center>
	<main>
		<br />
		<h1 class="text-5xl">Horizons Alt Platform</h1>
		<br />
		<p>if u dont like the horizons platform you can use ts lowk</p>
	</main>
</center>
