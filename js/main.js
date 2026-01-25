// load header and footer partials
import { loadPartial } from "./core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "../pages/partials/header.html");
    loadPartial("footer", "../pages/partials/footer.html");
});
