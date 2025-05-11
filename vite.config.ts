import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { extname, relative, resolve } from "path";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["lib/**/*.ts", "lib/**/*.tsx"],
      tsconfigPath: "./tsconfig.lib.json",
      outDir: "dist",
      insertTypesEntry: true,
      cleanVueFileName: true,
      copyDtsFiles: true,
    }),
    libInjectCss(),
    wasm()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    outDir: "dist",
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync("lib/**/*.{ts,tsx}", {
            ignore: ["lib/**/*.d.ts"],
          })
          .map((file) => [
            relative("lib", file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: {
      events: "events",
    },
  },
});
