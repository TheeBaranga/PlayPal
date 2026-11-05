const pages = [["index.html", "Home"], ["shop.html", "Toy shop"], ["games.html", "Games"], ["activities.html", "Activities"]];
const current = location.pathname.split("/").pop() || "index.html";
const header = document.getElementById("site-header");
if (header) header.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a><nav class="site-nav" aria-label="Main navigation"><a class="site-brand" href="./index.html">PlayPal</a>${pages.map(([file, label]) => `<a href="./${file}"${file === current ? ' aria-current="page"' : ''}>${label}</a>`).join("")}</nav>`;
const footer = document.getElementById("site-footer");
if (footer) { footer.className = "site-footer"; footer.textContent = "PlayPal - Make time for play, creativity and discovery."; }
