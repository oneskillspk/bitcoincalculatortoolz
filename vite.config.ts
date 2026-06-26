import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Make CSS non-render-blocking so the first paint isn't blocked by stylesheets (improves FCP)
function deferCss(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1" fetchpriority="high" onload="this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" href="$1"></noscript>'
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
    calculatorDeepLinkFallback(),
    react(),
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
