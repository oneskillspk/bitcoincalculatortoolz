import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Make CSS non-render-blocking so the inline splash screen paints immediately (improves FCP)
function deferCss(): Plugin {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1" onload="this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" href="$1"></noscript>'
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
    return pathname.startsWith('/calculators') || pathname.startsWith('/tr/hesaplayicilar');
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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
}));
