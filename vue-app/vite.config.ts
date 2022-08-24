import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/tophub": {
        target: "https://tophub.today/",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/tophub", "");
        },
      },
      "/zhihu": {
        target: "https://www.zhihu.com/hot",
        changeOrigin: true,
        secure: false,
        rewrite(path) {
          return path.replace("/zhihu", "");
        },
      },
    },
  },
});
