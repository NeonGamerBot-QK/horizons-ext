<script lang="ts">
	import { getUserInfo, type UserInfoResponse } from '$lib/util/rest';
	import { onMount } from 'svelte';
	let user = $state<UserInfoResponse | null>(null);
	onMount(() => {
		getUserInfo(document.cookie!).then((data) => {
			console.log(data);
			user = data;
		});
	});
</script>

{#if user}
	<div>
		<h1>Hi there {user.firstName}</h1>
	</div>
{:else}
	<p>loading...</p>
{/if}
