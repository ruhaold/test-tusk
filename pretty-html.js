import path from 'path'
import environment from './config/environment.js'
import fs from 'fs-extra'
import beautify from 'js-beautify'
import vkbeautify from 'vkbeautify'

const jsBeautify = beautify.html
const HTML = '.html'

const htmlDir = path.resolve(environment.paths.output, '')
const htmlFiles = fs.readdirSync(htmlDir).filter((fileName) => fileName.endsWith(HTML))

function readFiles() {
  const targetDirectory = 'dist/'

  console.log('Starting pretty html')

  for (const file of htmlFiles) {
    const htmlStr = fs.readFileSync(path.resolve(environment.paths.output, file), 'utf8')
    const resultHtml = jsBeautify(htmlStr, {
      indent_size: 4,
      indent_char: '\x20',
      max_preserve_newlines: -1,
      preserve_newlines: false,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_inner_html: true,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false,
      extra_liners: [],
      wrap_attributes: 'auto',
      operator_position: 'preserve-newline',
    })

    fs.writeFile(`${targetDirectory}${file}`, resultHtml, (e) => {
      if (e) {
        console.error(e)
      }
    })
  }

  console.log('Pretty html done')
}

readFiles()
