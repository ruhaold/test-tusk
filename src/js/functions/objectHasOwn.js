/**
 * Полифил для использования свойства Object.hasOwn.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn}
 *
 * @param {Object} obj целевой объект
 * @param {string} key ключ
 * @return {boolean}
 * */
export const objectHasOwn = (obj, key) => {
  if (!obj || !key) return false

  if (Object.hasOwn) {
    return Object.hasOwn(obj, key)
  } else {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
}
