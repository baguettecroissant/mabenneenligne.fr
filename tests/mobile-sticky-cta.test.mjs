import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import React from "react";
import { elements, loadComponent, mount, textContent } from "./helpers/component-harness.mjs";

const componentUrl = new URL("../app/_components/MobileStickyCta.tsx", import.meta.url);

function loadSticky(pathname = "/location-benne/bischheim-67800") {
  return loadComponent("app/_components/MobileStickyCta.tsx", {
    "next/link": { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) },
    "next/navigation": { usePathname: () => pathname },
  }).MobileStickyCta;
}

function stickyElement(tree) {
  return elements(tree, (node) => node.props.className === "mobile-sticky-cta")[0];
}

function spacerElement(tree) {
  return elements(tree, (node) => node.props.className === "mobile-sticky-cta-spacer")[0];
}

test("mobile sticky CTA appears only after scrolling and hides at the footer", async (t) => {
  assert.equal(existsSync(componentUrl), true, "MobileStickyCta component must exist");
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const previousObserver = globalThis.IntersectionObserver;
  const listeners = new Map();
  const footer = {};
  let observerCallback;
  globalThis.window = {
    scrollY: 0,
    addEventListener(name, callback, options) { listeners.set(name, { callback, options }); },
    removeEventListener(name, callback) { if (listeners.get(name)?.callback === callback) listeners.delete(name); },
  };
  globalThis.document = { querySelector: (selector) => selector === ".site-footer" ? footer : null };
  globalThis.IntersectionObserver = class {
    constructor(callback) { observerCallback = callback; }
    observe(target) { assert.equal(target, footer); }
    disconnect() {}
  };
  const view = mount(loadSticky());
  t.after(() => {
    view.unmount();
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    globalThis.IntersectionObserver = previousObserver;
  });
  await view.flushEffects();
  assert.equal(stickyElement(view.tree()).props.hidden, true);
  assert.equal(spacerElement(view.tree()).props.hidden, true);
  assert.equal(listeners.get("scroll").options.passive, true);

  globalThis.window.scrollY = 181;
  listeners.get("scroll").callback();
  assert.equal(stickyElement(view.tree()).props.hidden, false);
  assert.equal(spacerElement(view.tree()).props.hidden, false);
  const link = elements(view.tree(), (node) => node.props.href === "/devis")[0];
  assert.ok(link);
  assert.match(textContent(link), /^Obtenir mon devis gratuit\s*→$/);

  observerCallback([{ isIntersecting: true }]);
  assert.equal(stickyElement(view.tree()).props.hidden, true);
  assert.equal(spacerElement(view.tree()).props.hidden, true);
});

test("mobile sticky CTA is omitted from the quote page", () => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = { scrollY: 500, addEventListener() {}, removeEventListener() {} };
  globalThis.document = { querySelector: () => null };
  try {
    const view = mount(loadSticky("/devis"));
    assert.equal(view.tree(), null);
    view.unmount();
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});

test("site shell mounts a mobile-only safe-area CTA with a 48px target", () => {
  assert.equal(existsSync(componentUrl), true, "MobileStickyCta component must exist");
  const shell = readFileSync(new URL("../app/_components/SiteShell.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(shell, /import\s+\{\s*MobileStickyCta\s*\}/);
  assert.match(shell, /<MobileStickyCta\s*\/>/);
  assert.match(css, /\.mobile-sticky-cta\s*\{[^}]*position:\s*fixed/i);
  assert.match(css, /\.mobile-sticky-cta\[hidden\]\s*\{[^}]*display:\s*none\s*!important/i);
  assert.match(css, /\.mobile-sticky-cta a\s*\{[^}]*min-height:\s*48px/i);
  assert.match(css, /safe-area-inset-bottom/i);
  assert.match(css, /@media\s*\(min-width:\s*761px\)\s*\{[^}]*\.mobile-sticky-cta/i);
});
