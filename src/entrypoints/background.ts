export default defineBackground(() => {
  console.debug(`#bg`)
  console.log('Hello background!', { id: browser.runtime.id });
});
