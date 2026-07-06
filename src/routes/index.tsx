import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
// Inline the static site's HTML at build time. This lets the Lovable preview
// serve the exact same page GitHub Pages will host, at "/" (not /site/...).
import rawHtml from "../../public/site/index.html?raw";

// Extract just the <body> contents, strip <script> tags (we re-add them below),
// and rewrite relative asset paths so they resolve under Vite's public dir
// (public/site/* is served at /site/*).
const bodyContent = (rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/(src|href)="images\//g, '$1="/site/images/')
  .replace(/(src|href)="css\//g, '$1="/site/css/')
  .replace(/(src|href)="js\//g, '$1="/site/js/')
  .replace(/url\('images\//g, "url('/site/images/");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Southampton Lighthouse International Church — A Family of Faith, Hope & Community",
      },
      {
        name: "description",
        content:
          "Southampton Lighthouse International Church (SLIC) is a welcoming multicultural family in Southampton. Join us for worship, prayer, children's ministry and community outreach.",
      },
      { name: "theme-color", content: "#0b2447" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Southampton Lighthouse International Church",
      },
      {
        property: "og:description",
        content:
          "A welcoming multicultural family of faith in Southampton — worship, prayer, community and hope.",
      },
      { property: "og:image", content: "/site/images/fb-diversity.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: "/site/css/styles.css" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    // Load jQuery, then the site's main.js — matching the standalone index.html.
    const jq = document.createElement("script");
    jq.src = "https://code.jquery.com/jquery-3.7.1.min.js";
    jq.async = false;
    jq.onload = () => {
      const main = document.createElement("script");
      main.src = "/site/js/main.js";
      main.async = false;
      document.body.appendChild(main);
    };
    document.body.appendChild(jq);
    return () => {
      jq.remove();
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}
