import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import obfuscator from "rollup-plugin-obfuscator";
import { uglify } from "rollup-plugin-uglify";
import { dependencies, version } from "./package.json";
import GlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";
import path from "path";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: path.resolve(__dirname, "packages", "frontend", "public"),
  base: "./",
  root: path.resolve(__dirname, "./packages/frontend"),
  server: {
    open: false,
    port: process.env.PORT || 8080,
  },
  plugins: [
    vue(),
    copy({
      targets: [
        {
          src: "manifest.json",
          dest: path.join(__dirname, "Built App", `Extension v${version}`),
        },
        {
          src: "packages/backend/",
          dest: path.join(
            __dirname,
            "Built App",
            `Extension v${version}/packages`
          ),
        },
      ],
      hook: "writeBundle",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./packages/frontend/src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        GlobalsPolyfills({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  build: {
    sourcemap: false,
    emptyOutDir: true,
    outDir: path.join(__dirname, "Built App", `Extension v${version}`),
    minify: "terser",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        plugins: [
          uglify({
            sourcemap: false,
          }),
          obfuscator({
            fileOptions: {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 1,
              numbersToExpressions: true,
              simplify: true,
              stringArrayShuffle: true,
              splitStrings: true,
              stringArrayThreshold: 1,
              rotateStringArray: true,
              stringArray: true,
              disableConsoleOutput: true,
              deadCodeInjection: true,
              debugProtection: true,
              debugProtectionInterval: 2000,
              selfDefending: true,
              sourceMap: false,
              splitStringsChunkLength: 1,
            },
            globalOptions: {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 1,
              numbersToExpressions: true,
              simplify: true,
              stringArrayShuffle: true,
              stringArrayThreshold: 1,
              rotateStringArray: true,
              stringArray: true,
              disableConsoleOutput: true,
              deadCodeInjection: true,
              debugProtection: true,
              debugProtectionInterval: 2000,
              selfDefending: true,
              sourceMap: false,
            },
          }),
        ],
      },
    },
  },
});
