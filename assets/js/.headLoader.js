// headLoader.js - Dynamically inject common head elements

// Calculate and set prefix FIRST
const depth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
const prefix = depth > 0 ? '../'.repeat(depth) : '';
window.__assetPrefix = prefix || './';

const headConfig = {
  meta: [
    { charset: "UTF-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "description", content: "Dean van Zyl's CV website" },
    { name: "keywords", content: "Dean, Dean van Zyl, Software Engineering Student" },
    { name: "author", content: "Dean van Zyl" }
  ],
  title: "Dean van Zyl — Software Engineering Student",
  links: [
    { rel: "icon", href: "assets/icons/favicon.png", type: "image/x-icon" },
    { rel: "stylesheet", href: "assets/css/theme.css" },
    { rel: "stylesheet", href: "assets/css/layout-header.css" },
    { rel: "stylesheet", href: "assets/css/layout-nav.css" },
    { rel: "stylesheet", href: "assets/css/layout-body.css" },
    { rel: "stylesheet", href: "assets/css/layout-footer.css" }
  ],
  scripts: [
    { src: "assets/js/splashHeaderController.js", defer: true },
    { src: "assets/js/navController.js", defer: true },
    { src: "assets/js/cvDownloadHandler.js", defer: true },
    { src: "assets/js/dataLoader.js", type: "module" }
  ]
};

function loadHead(pathPrefix = "") {
  const head = document.head;
  
  // Meta tags
  headConfig.meta.forEach(meta => {
    const el = document.createElement("meta");
    Object.entries(meta).forEach(([key, val]) => el.setAttribute(key, val));
    head.appendChild(el);
  });
  
  // Title
  document.title = headConfig.title;
  
  // Links
  headConfig.links.forEach(link => {
    const el = document.createElement("link");
    Object.entries(link).forEach(([key, val]) => {
      el.setAttribute(key, key === "href" ? pathPrefix + val : val);
    });
    head.appendChild(el);
  });
  
  // Scripts
  headConfig.scripts.forEach(script => {
    const el = document.createElement("script");
    Object.entries(script).forEach(([key, val]) => {
      if (key === "src") el.src = pathPrefix + val;
      else if (key === "defer") el.defer = true;
      else el.setAttribute(key, val);
    });
    head.appendChild(el);
  });
}

loadHead(prefix);
