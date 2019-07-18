import { app } from "./app.js";
import { screens } from "./screens.js";

/**
 * Bootstrap the app and load and previous state from storage
 */
window.addEventListener("load", () => {
  app.screen = typeof app.storage.screen === "undefined"
    ? screens.search()
    : screens[app.storage.screen](app.storage.intent);
});
