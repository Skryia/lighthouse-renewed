import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b2447", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <p>Loading Southampton Lighthouse International Church…</p>
    </div>
  );
}
