import { objectHasOwn } from './objectHasOwn'

/**
 * Преобразовывает FormData в объект.
 *
 * @param {FormData} formData
 * @return {Object}
 * */
export const formDataToObject = (formData) => {
  const result = {}

  formData.forEach((value, key) => {
    if (!objectHasOwn(result, key)) {
      result[key] = value
      return
    }
    if (!Array.isArray(result[key])) {
      result[key] = [result[key]]
    }
    result[key].push(value)
  })

  return result
}
