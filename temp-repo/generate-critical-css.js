import path from 'path'
import environment from './config/environment.js'
import fs from 'fs-extra'

const HTML = '.html'
const CSS = '.css'
const CRITICAL_PATH = 'css/critical/'

const htmlDir = path.resolve(environment.paths.output, '')
const cssDir = path.resolve(environment.paths.output, 'css')
const htmlFiles = fs.readdirSync(htmlDir).filter((fileName) => fileName.endsWith(HTML))
const cssFiles = fs.readdirSync(cssDir).filter((fileName) => fileName.endsWith(CSS))
const startTime = Date.now()
let filesCount = 0

async function readFiles() {
  const targetDirectory = 'dist/' + CRITICAL_PATH
  fs.removeSync(targetDirectory)

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory)
  }

  console.log('Starting generate critical css')

  for (const file of htmlFiles) {
    const { generate } = await import('critical')
    let name = file.split(HTML)[0]

    if (name) {
      if (name === 'index') {
        name = 'main-page'
      }
      const targetCss = `${name}.css`

      console.log(`${name}.css is generating...`)

      fs.appendFile(`${targetDirectory}${targetCss}`, '', (e) => {
        if (e) {
          console.error(e)
        }
      })

      await generate({
        inline: false,
        base: htmlDir,
        src: file,
        target: {
          css: `${CRITICAL_PATH}${targetCss}`,
        },
        css: cssFiles.map((name) => path.resolve(environment.paths.output, `css/${name}`)),
        dimensions: [
          {
            width: 320,
            height: 570,
          },
          {
            width: 1280,
            height: 720,
          },
          {
            width: 1920,
            height: 1080,
          },
        ],
        ignore: [
          /.header-full-menu[_-]{1,2}.*$/,
          /.popup[_-]{1,2}.*$/,
          /.form-msg[_-]{1,2}.*$/,
          /.time-widget.*$/,
          /.header-menu__dropdown__link.*$/,
          /.header-alternative-menu__inner.*$/,
          /.header-alternative-menu__title-wrap.*$/,
          /.header-alternative-menu__title.*$/,
          /.header-alternative-menu__color-block.*$/,
          /.header-alternative-menu__subtitle.*$/,
          /.header-alternative-menu__animation-block.*$/,
          '.header-alternative-menu__reset',
          '.header-alternative-menu__btns',
          /.header-alternative-menu__color-btn.*$/,
          /.header-alternative-menu__font-btn.*$/,
          /.header-alternative-menu__font-block.*$/,
          /.header-alternative-menu__img-block.*$/,
          /.header-alternative-menu__text.*$/,
          /.header-theme__text.*$/,
          '.header-alternative-menu__hint',
          '@keyframes',
          '@-webkit-keyframes',
          'background-image',
          '@font-face',
        ],
        penthouse: {
          forceInclude: [
            '.menu-toggler:not(._open,._open-alt-menu) ._close',
            '.form-message:not(._loading,._success,._error)',
            /.error503.*$/,
            '.vue-container',
          ],
        },
      })
        .then(() => {
          filesCount++
          console.log(`${name}.css is generated`)
        })
        .catch((e) => {
          console.error(`Error with file: ${name}.css`)
          console.error(e)
        })
    }
  }
}

readFiles().finally(() => {
  console.log(`Generated files: ${filesCount} in ${htmlFiles.length}`)
  console.log(`Operation duration: ${Date.now() - startTime} ms`)
})
