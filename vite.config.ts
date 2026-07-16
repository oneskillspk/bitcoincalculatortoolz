import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// Keep the main stylesheet render-blocking but high-priority. The previous
// preload+onload swap made CSS depend on JS execution, which caused
// Googlebot / GSC Live Test to screenshot the page BEFORE the onload handler
// promoted the preload to a stylesheet — the result looked completely
// unstyled to search engines. A normal <link rel="stylesheet"> guarantees
// every crawler (and every browser with JS disabled) sees a styled page on
// first paint. Critical CSS is already inlined in index.html for FCP.
function deferCss(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" fetchpriority="high">'
      );
    }
  };
}

function calculatorDeepLinkFallback(): Plugin {
  const shouldFallback = (req: { method?: string; url?: string; headers: Record<string, string | string[] | undefined> }) => {
    if (req.method !== 'GET' || !req.url) return false;
    const accept = String(req.headers.accept || '');
    if (!accept.includes('text/html')) return false;
    const pathname = req.url.split('?')[0];
    if (!pathname || pathname === '/' || pathname.includes('.')) return false;
    // SPA fallback for ALL client-side routes. Without this, `vite preview`
    // returns 404 for deep links like /tools, /learn, /about, /contact,
    // /tr/*, which breaks the a11y-names CI job that crawls those routes
    // against the production build.
    return true;
  };

  const rewrite = (req: { url?: string; originalUrl?: string }) => {
    if (!req.url) return;
    req.originalUrl = req.originalUrl || req.url;
    const queryIndex = req.url.indexOf('?');
    req.url = queryIndex >= 0 ? `/${req.url.slice(queryIndex)}` : '/';
  };

  return {
    name: 'calculator-deep-link-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (shouldFallback(req)) rewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (shouldFallback(req)) rewrite(req);
        next();
      });
    },
  };
}

// Dev/preview-only proxy for Lovable CDN assets served under
// `/__l5e/assets-v1/*`. In production, Lovable's hosting layer serves these
// paths directly. Locally there is no such handler, so Vite would fall back
// to `index.html` (Content-Type: text/html) and the browser renders broken
// image placeholders in ad slots and any component that references an
// `.asset.json` URL. This middleware proxies the request to the published
// site so local previews render the real WebP/PNG bytes.
function lovableAssetsDevProxy(): Plugin {
  const UPSTREAM = 'https://bitcoincalculatortoolz.lovable.app';
  const shouldProxy = (url?: string) =>
    !!url && url.startsWith('/__l5e/assets-v1/');

  const proxy = async (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: unknown) => void }) => {
    try {
      const upstreamUrl = `${UPSTREAM}${req.url}`;
      const upstream = await fetch(upstreamUrl);
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.statusCode = upstream.status;
      const ct = upstream.headers.get('content-type');
      if (ct) res.setHeader('Content-Type', ct);
      const cc = upstream.headers.get('cache-control');
      if (cc) res.setHeader('Cache-Control', cc);
      res.end(buf);
    } catch (err) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`lovable-assets dev proxy failed: ${(err as Error).message}`);
    }
  };

  return {
    name: 'lovable-assets-dev-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (shouldProxy(req.url)) return void proxy(req, res as never);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (shouldProxy(req.url)) return void proxy(req, res as never);
        next();
      });
    },
  };
}

const CLOUD_URL_FALLBACK = "https://fyquklzfhkeiybhdnccb.supabase.co";
const CLOUD_KEY_FALLBACK = "sb_publishable_FxjF-2P7SIdDrvO-215ajw_rQ2UQCM_";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const cloudUrl = env.VITE_SUPABASE_URL || CLOUD_URL_FALLBACK;
  const cloudKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || CLOUD_KEY_FALLBACK;

  return ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(cloudUrl),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(cloudKey),
  },
  plugins: [
    lovableAssetsDevProxy(),
    calculatorDeepLinkFallback(),
    react(),
    mcpPlugin(),
    mode === 'development' && componentTagger(),
    mode === 'production' && deferCss(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react-router",
      "react-router-dom",
      "react-helmet-async",
      "@tanstack/react-query",
      "recharts",
      "lodash-es",
      "date-fns",
      "@radix-ui/react-slot",
      "@radix-ui/react-primitive",
      "@radix-ui/react-compose-refs",
      "@radix-ui/react-context",
      "@radix-ui/react-collection",
      "@radix-ui/react-dismissable-layer",
      "@radix-ui/react-focus-scope",
      "@radix-ui/react-portal",
      "@radix-ui/react-presence",
      "@radix-ui/react-use-controllable-state",
      "class-variance-authority",
      "clsx",
      "tailwind-merge"
    ],
  },
  build: {
    sourcemap: 'hidden',
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        return deps.filter((dep) => {
          if (/\/charts-[^/]+\.js$/.test(dep)) return false;
          return true;
        });
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom', '@tanstack/react-query'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          utils: ['lodash-es', 'date-fns'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/styles/[name].[hash].css'
          }
          return 'assets/[name].[hash].[ext]'
        }
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    cssMinify: true
  },
});
});
