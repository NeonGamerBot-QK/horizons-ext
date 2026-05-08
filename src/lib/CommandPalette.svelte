<script lang="ts">
  import { onMount } from "svelte";
  const ADMIN_ROUTES = [
    {
      path: "/hoome",
      name: "Home",
    },
    {
      path: "/review",
      name: "Review",
    },
    {
      path: "/projects",
      name: "Projects",
    },
    {
      path: "/users",
      name: "Users",
    },
    {
      path: "/shop",
      name: "Shop",
    },
    {
      path: "/giftcodes",
      name: "Gift codes",
    },
    {
      path: "/transactions",
      name: "Transactions",
    },
    {
      path: "/events",
      name: "Events",
    },
  ].map((e) => {
    e.path = "/admin" + e.path;
    e.name = `[ADMIN] - ${e.name}`;
    return e;
  });
  type Command = { label: string; action: () => void; icon?: string };

  let { pluginCommands = [] }: { pluginCommands: Command[] } = $props();

  let open = $state(false);
  let query = $state("");
  let selected = $state(0);

  const baseCommands: Command[] = [
    {
      label: "Go to projects",
      action: () => location.assign("/app/projects"),
      icon: "projects",
    },
    {
      label: "Go to shop",
      action: () => location.assign("/app/shop"),
      icon: "shopping_cart",
    },
    {
      label: "Go to dashboard",
      action: () => location.assign("/app"),
      icon: "home",
    },
    {
      label: "Copy page URL",
      action: () => navigator.clipboard.writeText(location.href),
      icon: "link",
    },
    ...ADMIN_ROUTES.map((r) => ({
      label: r.name,
      action: () => location.assign(r.path),
      icon: r.icon || "admin",
    })),
  ];

  const allCommands = $derived([...baseCommands, ...pluginCommands]);

  const filteredCommands = $derived(
    query
      ? allCommands.filter((c) =>
          c.label.toLowerCase().includes(query.toLowerCase()),
        )
      : allCommands,
  );

  onMount(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open = !open;
        query = "";
        selected = 0;
      }
      if (e.key === "Escape") open = false;
      if (e.key === "ArrowDown")
        selected = Math.min(selected + 1, filteredCommands.length - 1);
      if (e.key === "ArrowUp") selected = Math.max(selected - 1, 0);
      if (e.key === "Enter" && open) {
        filteredCommands[selected]?.action();
        open = false;
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" onclick={() => (open = false)}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="palette" onclick={(e) => e.stopPropagation()}>
      <!-- svelte-ignore a11y_autofocus -->
      <input bind:value={query} placeholder="Search commands..." autofocus />
      <ul>
        {#each filteredCommands as cmd, i}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <li
            class:active={i === selected}
            onclick={() => {
              cmd.action();
              open = false;
            }}
          >
            {cmd.label}
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
  }

  .palette {
    background: #fff;
    border-radius: 8px;
    width: 480px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #eee;
    outline: none;
    box-sizing: border-box;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 4px 0;
    max-height: 320px;
    overflow-y: auto;
  }

  li {
    padding: 10px 16px;
    cursor: pointer;
  }

  li.active {
    background: #f0f0f0;
  }
</style>
