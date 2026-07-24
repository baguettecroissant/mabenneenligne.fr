import { access, cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// Packages Sites metadata and migrations after Vite finishes compiling.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }
      if (await exists(drizzleSource)) {
        await cp(drizzleSource, resolve(outputDirectory, "drizzle"), {
          recursive: true,
        });
      }

      // Generate Cloudflare Pages Advanced Mode _worker.js and all relative resolution dependencies
      const serverDir = resolve(root, "dist", "server");
      const clientDir = resolve(root, "dist", "client");
      const serverWorker = resolve(serverDir, "index.js");
      const clientWorker = resolve(clientDir, "_worker.js");
      const clientIndex = resolve(clientDir, "index.js");
      const serverManifest = resolve(serverDir, "__vite_rsc_assets_manifest.js");
      const clientManifest = resolve(clientDir, "__vite_rsc_assets_manifest.js");
      const serverSsrDir = resolve(serverDir, "ssr");
      const clientSsrDir = resolve(clientDir, "ssr");

      // 1. Clean worker configs that trigger Cloudflare Pages conflict
      const serverWrangler = resolve(serverDir, "wrangler.json");
      const wranglerDeployDir = resolve(root, ".wrangler");
      if (await exists(serverWrangler)) {
        await rm(serverWrangler, { force: true });
      }
      if (await exists(wranglerDeployDir)) {
        await rm(wranglerDeployDir, { recursive: true, force: true });
      }

      // 2. Copy worker entries (_worker.js AND index.js so relative imports resolve)
      if (await exists(serverWorker)) {
        await cp(serverWorker, clientWorker);
        await cp(serverWorker, clientIndex);
      }

      // 3. Copy root asset manifest
      if (await exists(serverManifest)) {
        await cp(serverManifest, clientManifest);
      }

      // 4. Copy ssr directory recursively (including ssr/__vite_rsc_assets_manifest.js)
      if (await exists(serverSsrDir)) {
        await cp(serverSsrDir, clientSsrDir, { recursive: true });
        if (await exists(serverManifest)) {
          await cp(serverManifest, resolve(clientSsrDir, "__vite_rsc_assets_manifest.js"));
        }
      }

      // 5. Keep dynamic guide pages routed through the worker.
      // Cloudflare's generated _routes.json can exclude /guides/* because the
      // public guide images live in that folder. That also excludes article
      // URLs like /guides/autorisation-voirie-benne and makes them 404.
      const guideAssetsDir = resolve(clientDir, "guides");
      const guideAssets = (await exists(guideAssetsDir))
        ? (await readdir(guideAssetsDir)).map((file) => `/guides/${file}`)
        : [];
      const routes = {
        version: 1,
        include: ["/*"],
        exclude: [
          "/assets/*",
          "/services/*",
          ...guideAssets,
          "/favicon.png",
          "/favicon.svg",
          "/file.svg",
          "/globe.svg",
          "/hero-devenir-partenaire.png",
          "/hero-homepage.png",
          "/llms.txt",
          "/og.png",
          "/services-waste-streams.png",
          "/window.svg",
        ],
      };
      await writeFile(resolve(clientDir, "_routes.json"), `${JSON.stringify(routes, null, 2)}\n`);
    },
  };
}
