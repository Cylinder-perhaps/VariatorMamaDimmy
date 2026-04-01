import { fileURLToPath } from "url";

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [],
    server: {
      host: "localhost",
      port: 3000,
      open: true,
      cors: true,
    },
    preview: {
      host: "localhost",
      port: 3000,
      open: true,
    },
    build: {
      cssCodeSplit: false,
      target: "esnext",
      modulePreload: false,
      outDir: "build",
      assetsDir: "",
    },
    resolve: {
      alias: [
        {
          find: "@api",
          replacement: fileURLToPath(new URL("./src/api", import.meta.url)),
        },
      ],
    },
  };
});
