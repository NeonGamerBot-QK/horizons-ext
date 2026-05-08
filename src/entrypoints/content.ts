import { watchSelector } from "@/lib/util";
import { mount } from "svelte";
import CommandPalette from "../lib/CommandPalette.svelte";

type Command = { label: string; action: () => void; icon?: string };

type Plugin = {
  name: string;
  internal?: boolean
  enabled?: boolean;
  commands?: Command[];
  run?: () => void | Promise<void>;
};

const RESERVED_KEYS = new Set([
  "w", "a", "s", "d",
  "W", "A", "S", "D",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
]);

function reserveKeysForExtension() {
  const handler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    if (!RESERVED_KEYS.has(event.key)) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    window.dispatchEvent(
      new CustomEvent("ext:key", {
        detail: { key: event.key, type: event.type },
      }),
    );
  };
  window.addEventListener("keydown", handler, { capture: true });
  window.addEventListener("keyup", handler, { capture: true });
  window.addEventListener("keypress", handler, { capture: true });
}

const plugins: Plugin[] = [
  {
    name: "Reserve Keys",
    enabled: true,
    internal: true,
    run: reserveKeysForExtension,
  },
  {
    name: "Command Palette",
    enabled: true,
    run() {
      const host = document.createElement("div");
      document.body.appendChild(host);
      mount(CommandPalette, { target: host, props: { pluginCommands } });
    },
  },
  {
    name: "Auto Login",
    enabled: true,
    commands: [
      {
        label: "Auto Login: trigger now",
        icon: "login",
        action: () => {
          const input = document.querySelector<HTMLInputElement>(
            '[placeholder="orpheus@hackclub.com"]',
          );
          if (input) {
            input.value = "neon@saahild.com";
            document
              .querySelector('[class*="signup-btn"]')
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }
        },
      },
    ],
    async run() {
      watchSelector('[placeholder="orpheus@hackclub.com"]', () => {
        const input = document.querySelector<HTMLInputElement>(
          '[placeholder="orpheus@hackclub.com"]',
        );
        if (input) {
          input.value = "neon@saahild.com";
          document
            .querySelector('[class*="signup-btn"]')
            ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
      });
    },
  },
];

const pluginCommands = plugins.flatMap((p) => p.commands ?? []);

export default defineContentScript({
  matches: ["*://*.horizons.hackclub.com/*"],
  main() {
    for (const plugin of plugins) {
      if (plugin.enabled) plugin.run?.();
    }
  },
});
