import { watchSelector } from "@/lib/util";
const plugins = [{
  name: "Auto Login",
  enabled: true,
  async run() {
    watchSelector('[placeholder="orpheus@hackclub.com"]', (e) => {
      (
        document.querySelector(
          '[placeholder="orpheus@hackclub.com"]',
        )! as HTMLInputElement
      ).value = "neon@saahild.com";
      document.querySelector('[class*="signup-btn"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    })
  }
}, {

}]
export default defineContentScript({
  matches: ["*://*.horizons.hackclub.com/*"],
  main() {
    console.log("Hello content.");
    for (const plugin of plugins) {
      if (plugin.enabled) plugin.run();
    }

  },
});
