import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 * @description The Vite configuration for the project.
 * This file configures the Vite development server, build process, and plugins.
 *
 * @property {Array<import('vite').Plugin>} plugins - An array of Vite plugins to use.
 *   - `@vitejs/plugin-react`: Enables React support.
 *   - `vite-tsconfig-paths`: Enables path mapping from `tsconfig.json`.
 * @property {object} server - Configuration for the development server.
 *   @property {number} server.port - The port to run the server on.
 *   @property {boolean} server.open - Whether to open the browser on server start.
 * @property {object} build - Configuration for the build process.
 *   @property {string} build.outDir - The output directory for the build.
 *   @property {boolean} build.sourcemap - Whether to generate source maps.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
