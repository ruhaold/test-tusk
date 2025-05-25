// https://dbanks.design/blog/dark-mode-with-style-dictionary/#Multi-file-method
// https://github.com/dbanksdesign/style-dictionary-dark-mode

import StyleDictionary from 'style-dictionary'
import fs from 'fs-extra'
import tinycolor from 'tinycolor2'
import { darken } from './build-figma-tokens/darken.js'
import { lighten } from './build-figma-tokens/lighten.js'

const webPath = './src/scss/generated/'
const figmaPath = 'figma-tokens/themes'

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${webPath}...`)
fs.removeSync(webPath)

// Adding custom actions, transforms, and formats
const styleDictionary = StyleDictionary

const indexOfAll = (string, substring) => {
  let a = [],
    i = -1
  while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i)
  return a
}

// заменяет конструкцию вида rgba(#000, 1) на валидный цвет rgba(0, 0, 0, 1)
styleDictionary.registerTransform({
  name: 'color/validRgba',
  type: 'value',
  transitive: true,
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function (token) {
    if (!tinycolor(token.value).isValid() && token.value) {
      let value = token.value
      const str = 'rgba(#'
      const firstIndexArr = indexOfAll(value, str)

      firstIndexArr.forEach((firstIndex) => {
        firstIndex = value.indexOf(str)

        if (firstIndex > -1) {
          let lastIndex = value.substring(firstIndex).indexOf(',')
          if (lastIndex > -1) {
            lastIndex = lastIndex + firstIndex

            const color = value.substring(firstIndex + str.length - 1, lastIndex).trim()

            if (tinycolor(color).isValid()) {
              const rgbaObj = tinycolor(color).toRgb()
              const resultColor = value.replace(color, `${rgbaObj.r}, ${rgbaObj.g}, ${rgbaObj.b}`)

              if (tinycolor(resultColor).isValid()) {
                value = resultColor
              }
            }
          }
        }
      })

      return value
    }
    return token.value
  },
})

// поддержка теней
// https://docs.tokens.studio/available-tokens/shadow-tokens
styleDictionary.registerTransform({
  name: 'shadow/css',
  type: 'value',
  matcher: function (token) {
    return token.type === 'boxShadow'
  },
  transformer: function (token) {
    const generateShadow = (obj) => {
      // destructure shadow values from original token value
      const { x, y, blur, spread, color, type } = obj

      const pxToRem = (pxVal) => {
        return pxVal ? pxVal / 10 : 0
      }

      // convert to rgba string
      const shadowColor = tinycolor(color)
      shadowColor.toRgbString()

      const inset = type === 'innerShadow' ? 'inset' : ''

      return `${inset} ${pxToRem(x)}rem ${pxToRem(y)}rem ${pxToRem(blur)}rem ${pxToRem(
        spread
      )}rem ${shadowColor}`.trim()
    }

    if (Array.isArray(token.original.value)) {
      return token.original.value.map(generateShadow).join(', ')
    } else {
      return generateShadow(token.value)
    }
  },
})

// поддержка составных свойств
// https://github.com/amzn/style-dictionary/issues/848#issuecomment-1217796455
styleDictionary.registerTransform({
  type: 'value',
  transitive: true,
  name: 'figma/web/flatten-properties',
  matcher: ({ type }) => {
    return ['typography', 'composition', 'border'].includes(type)
  },
  transformer: ({ value, name, type }) => {
    if (!value) return value

    const entries = Object.entries(value)
    const pxToRem = (pxVal) => {
      return pxVal ? pxVal / 10 : 0
    }

    return entries.reduce(
      (acc, [key, v], index) => {
        const isPx = v.endsWith('px')

        if (isPx) {
          const pxValArr = v.split('px')

          if (pxValArr.length === 2 && !isNaN(Number(pxValArr[0]))) {
            v = `${pxToRem(pxValArr[0])}rem`
          }
        }

        return `${acc ? `${acc}\n  ` : ''}--${name}-${StyleDictionary.transform['name/cti/kebab'].transformer(
          { path: [key] },
          { prefix: '' }
        )}: ${v}${index + 1 === entries.length ? '' : ';'}`
      },
      `${name.includes(type) ? '' : `${type}-`}${name}-group;`
    )
  },
})

// поддержка модификаторов для цвета
// https://docs.tokens.studio/tokens/color-modifiers
styleDictionary.registerTransform({
  name: 'color/modifiers',
  type: 'value',
  transitive: true,
  matcher: function (token) {
    return token.type === 'color' && token.value && tinycolor(token.value).isValid()
  },
  transformer: function (token) {
    const modify = token?.$extensions?.['studio.tokens']?.modify
    const modifyType = modify?.type
    const modifySpace = modify?.space
    let modifyValue = Number(modify?.value)
    const LIGHTEN = 'lighten'
    const DARKEN = 'darken'
    const ALPHA = 'alpha'

    if (modify && modifySpace && [LIGHTEN, DARKEN, ALPHA].includes(modifyType) && modifyValue) {
      if (modifyType === LIGHTEN) {
        return lighten(token.value, modifySpace, modifyValue)
      } else if (modifyType === DARKEN) {
        return darken(token.value, modifySpace, modifyValue)
      } else if (modifyType === ALPHA) {
        return tinycolor(token.value).setAlpha(modifyValue).toString()
      } else {
        return token.value
      }
    }

    return token.value
  },
})

// имена общих файлов между цветовыми схемами
const GLOBAL_THEMES = ['global', 'no-theme']

// имена файлов цветовых схем
const THEMES = ['light', 'dark', 'contrast-light', 'contrast-dark', 'contrast-blue']

console.log('Building global mode...')

styleDictionary
  .extend({
    source: [
      // this is saying find any files in the tokens folder
      // that does not have dark or light, but ends in .json
      ...GLOBAL_THEMES.map((gTheme) => `${figmaPath}/**/${gTheme}.json`),
    ],

    platforms: {
      css: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'color/css',
          'color/validRgba',
          'shadow/css',
          'figma/web/flatten-properties',
          'color/modifiers',
        ],
        buildPath: webPath,
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
            options: {},
          },
        ],
      },
    },
  })
  .buildAllPlatforms()

THEMES.forEach((theme) => {
  console.log(`Building ${theme} mode...`)

  styleDictionary
    .extend({
      // Using the include array so that theme token overrides don't show
      // warnings in the console.
      include: [...GLOBAL_THEMES.map((gTheme) => `${figmaPath}/**/${gTheme}.json`)],
      source: [`${figmaPath}/**/${theme}.json`],
      platforms: {
        css: {
          transforms: [
            'attribute/cti',
            'name/cti/kebab',
            'color/css',
            'color/validRgba',
            'shadow/css',
            'figma/web/flatten-properties',
            'color/modifiers',
          ],
          buildPath: webPath,
          files: [
            {
              destination: `variables-${theme}.css`,
              format: 'css/variables',
              // only putting in the tokens from files with ${theme} in the filepath
              filter: (token) => token.filePath.indexOf(`${theme}`) > -1,
              options: {
                selector: `:root[data-theme="${theme}"]`,
              },
            },
          ],
        },
      },
    })
    .buildAllPlatforms()
})
