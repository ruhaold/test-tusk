/**
 * Вырезает html теги из строки
 *
 * @param {string} str целевая строка
 * @return {string} возвращает строку без html тегов
 * */
export const stripTags = (str = '') => {
  return str?.replace(/<\/?[^>]+>/gi, '')
}
