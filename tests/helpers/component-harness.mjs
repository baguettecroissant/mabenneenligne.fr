import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileFunction } from "node:vm";
import * as React from "react";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
let currentMount;

function context() {
  if (!currentMount) throw new Error("A component hook must run within mount().");
  return currentMount;
}

const hooks = {
  ...React,
  useState(initial) {
    const instance = context();
    const index = instance.cursor++;
    if (!(index in instance.slots)) {
      instance.slots[index] = typeof initial === "function" ? initial() : initial;
    }
    return [instance.slots[index], (next) => {
      if (!instance.mounted) return;
      const value = typeof next === "function" ? next(instance.slots[index]) : next;
      if (!Object.is(value, instance.slots[index])) {
        instance.slots[index] = value;
        instance.dirty = true;
      }
    }];
  },
  useRef(initial) {
    const instance = context();
    const index = instance.cursor++;
    instance.slots[index] ??= { current: initial };
    return instance.slots[index];
  },
  useEffect(callback, dependencies) {
    const instance = context();
    const index = instance.cursor++;
    const previous = instance.slots[index];
    const changed = !previous || !dependencies || dependencies.some((value, position) => !Object.is(value, previous.dependencies?.[position]));
    if (changed) {
      instance.slots[index] = { dependencies, cleanup: previous?.cleanup };
      instance.effects.set(index, callback);
    }
  },
};

export function loadComponent(relativePath, mocks = {}) {
  const loaded = new Map();
  function load(filename) {
    if (loaded.has(filename)) return loaded.get(filename).exports;
    if (extname(filename) === ".json") return JSON.parse(readFileSync(filename, "utf8"));
    const loadedModule = { exports: {} };
    loaded.set(filename, loadedModule);
    const source = readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    const localRequire = (specifier) => {
      if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
      if (specifier === "react") return hooks;
      if (specifier.startsWith(".")) {
        let dependency = resolve(dirname(filename), specifier);
        if (!extname(dependency)) {
          dependency = [".ts", ".tsx", ".mjs", ".js"].map((extension) => `${dependency}${extension}`).find((candidate) => {
            try { readFileSync(candidate); return true; } catch { return false; }
          });
          if (!dependency) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
        }
        return load(dependency);
      }
      return require(specifier);
    };
    compileFunction(outputText, ["require", "module", "exports"], { filename })(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load(resolve(root, relativePath));
}

export function mount(Component, props = {}) {
  const instance = { slots: [], effects: new Map(), cursor: 0, mounted: true, dirty: true };
  let currentProps = props;
  let tree;
  function render() {
    if (!instance.mounted || !instance.dirty) return tree;
    const previous = currentMount;
    currentMount = instance;
    instance.cursor = 0;
    instance.dirty = false;
    try { tree = Component(currentProps); } finally { currentMount = previous; }
    return tree;
  }
  render();
  return {
    tree: render,
    rerender(nextProps) {
      currentProps = nextProps;
      instance.dirty = true;
      return render();
    },
    async flushEffects() {
      for (let turn = 0; turn < 10; turn += 1) {
        render();
        const effects = [...instance.effects];
        instance.effects.clear();
        for (const [index, callback] of effects) {
          instance.slots[index].cleanup?.();
          instance.slots[index].cleanup = callback();
        }
        await new Promise((done) => setImmediate(done));
        if (!instance.dirty && instance.effects.size === 0) break;
      }
      return render();
    },
    unmount() {
      instance.mounted = false;
      instance.effects.clear();
      for (const slot of instance.slots) {
        if (typeof slot?.cleanup === "function") slot.cleanup();
      }
    },
  };
}

export function elements(tree, predicate = () => true) {
  if (Array.isArray(tree)) return tree.flatMap((item) => elements(item, predicate));
  if (!React.isValidElement(tree)) return [];
  return [...(predicate(tree) ? [tree] : []), ...elements(tree.props.children, predicate)];
}

export function textContent(tree) {
  if (Array.isArray(tree)) return tree.map(textContent).join("");
  if (React.isValidElement(tree)) return textContent(tree.props.children);
  return typeof tree === "string" || typeof tree === "number" ? String(tree) : "";
}
