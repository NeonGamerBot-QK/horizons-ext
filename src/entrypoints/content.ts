export default defineContentScript({
  matches: ['*://*.horizons.hackclub.com/*'],
  main() {
    console.log('Hello content.');
    if (document.querySelector('[placeholder="orpheus@hackclub.com"]')) {
      (document.querySelector('[placeholder="orpheus@hackclub.com"]')! as HTMLInputElement).value = "neon@saahild.com"
    }
  },
});