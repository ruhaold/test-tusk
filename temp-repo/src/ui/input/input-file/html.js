import { formatBytes } from '../../../js/functions/formatBytes'
import { DATA_ID, FILE_DROPZONE_DELETE_FILE_CLASS, FILE_DROPZONE_FILE_CLASS } from '../../../js/constants'

export const dropzoneFile = ({ file, id }) => {
  const size = file?.size ? `${formatBytes(file.size)}` : ''
  const info = (file?.name || '').split('.')
  const name = info[0] || ''
  const type = (info[1] || '').toUpperCase()

  const path = import.meta.env.DEV ? '/__spritemap' : `${window.app.templateUrl}assets/img/svgsprite.svg`

  return `
    <div class="input-common__file-item ${FILE_DROPZONE_FILE_CLASS}">
      <div class="input-common__file-item__title">
        ${name}
      </div>
      <div class="input-common__file-item__btns">
        <div class="input-common__file-item__info">
          <svg class="svgsprite _doc" tabindex="-1" role="img" aria-hidden="true">
            <use xlink:href="${path}#doc" tabindex="-1"></use>
          </svg>
          ${type ? type + ', ' : ''}${size || ''}
        </div>
        <button ${DATA_ID}="${id}" class="input-common__file-item__delete link-hover ${FILE_DROPZONE_DELETE_FILE_CLASS}" type="button" aria-label="удалить ${name}" title="удалить ${name}">
          <svg class="svgsprite _close" tabindex="-1" role="img" aria-hidden="true">
            <use xlink:href="${path}#close" tabindex="-1"></use>
          </svg>
          Удалить
        </button>
      </div>
    </div>`
}
