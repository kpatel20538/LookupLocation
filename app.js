// import control
// import model

window.addEventListener("load", () => {
  const model = loadModel();
  switch (model.lastScreen) {
    case "item":
      setScreen(model, "item", control.itemScreen(model));
    case "search":
    default:
      setScreen(model, "search", control.searchScreen(model));
  }
});