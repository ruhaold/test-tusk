/**
 * Выполняет динамическую загрузку файла стилей через js.
 *
 * {@link https://stackoverflow.com/a/577002}
 *
 * @param {string} url ссылка на файл
 * @return {Promise} возвращает промис, который показывает статус загрузки файла: успех/ошибка
 * */
export const fetchStyle = (url) => {
  return new Promise((resolve, reject) => {
    if (!url || url.indexOf('css') === -1) return reject()

    const urlObj = new URL(url, window.location.origin)
    url = urlObj.href
    const head = document.getElementsByTagName('head')[0]
    const linkExist = head.querySelector(`link[href='${url}']`)

    if (linkExist) return resolve()

    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.onload = () => {
      resolve()
    }
    link.href = url

    head.append(link)
  })
}
