import path from 'node:path'
import { defineConfig } from 'vite'
import cleanPlugin from 'vite-plugin-clean'
import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'
import cleanCss from 'vite-plugin-clean-css'
import autoprefixer from 'autoprefixer'
import extractMediaQuery from 'postcss-extract-media-query'
import svgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import vue from '@vitejs/plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import viteRestart from 'vite-plugin-restart'
import environment from './config/environment.js'
import { altMedia } from './src/media.js'
import * as constants from './src/js/constants.js'

export default defineConfig({
  base: './',
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
    postcss: {
      plugins: environment.devmode
        ? [autoprefixer]
        : [
            autoprefixer,
            extractMediaQuery({
              output: {
                path: path.join(__dirname, environment.paths.output, 'css'),
                name: '[query].css',
              },
              extractAll: false,
              queries: altMedia.reduce((acc, val) => {
                acc[val] = 'alt-media'

                return acc
              }, {}),
            }),
          ],
    },
  },
  server: {
    port: environment.server.port,
    open: false,
  },
  resolve: {
    alias: {
      '~': path.resolve(process.cwd(), 'node_modules'),
      '@': path.resolve(process.cwd(), environment.paths.source),
      src: path.resolve(process.cwd(), environment.paths.source),
      '@ui': path.resolve(process.cwd(), environment.paths.source, 'ui'),
    },
  },
  plugins: [
    cleanPlugin({
      targetFiles: [environment.paths.output],
    }),
    vituum({
      pages: {
        dir: `${environment.paths.source}/views`,
        normalizeBasePath: true,
      },
    }),
    pug({
      root: environment.paths.source,
      globals: {
        isDev: environment.devmode,
        ...constants,
      },
      options: {
        pretty: !environment.devmode,
      },
    }),
    cleanCss(),
    svgSpritemap(`${environment.paths.source}/svgsprite/*.svg`, {
      prefix: false,
      output: {
        filename: 'img/svgsprite[extname]',
      },
      styles: false,
      injectSVGOnDev: true,
      svgo: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeUselessStrokeAndFill: false,
                removeViewBox: false,
                removeUselessDefs: false,
                cleanupIds: false,
              },
            },
          },
        ],
      },
    }),
    vue(),
    commonjs(),
    viteRestart({
      restart: [`${environment.paths.source}/svgsprite/**`],
    }),
  ],
  build: {
    emptyOutDir: false,
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      input: [
        `${environment.paths.source}/views/*.pug`,
        `${environment.paths.source}/js/app.js`,
        `${environment.paths.source}/js/initVue.js`,
        `${environment.paths.source}/scss/*.scss`,
      ],
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assets) => {
          let folder = assets.name.split('.').pop()

          if (/webp|png|jpe?g|svg|ico/i.test(folder)) {
            folder = 'assets/img'
          }

          if (/ttf|woff2|woff?/i.test(folder)) {
            folder = 'assets/fonts'
          }

          if (/css|scss?/i.test(folder)) {
            folder = 'css'
          }

          return `${folder}/[name][extname]`
        },
      },
    },
  },
})
