/**
 * @param {number} value целевое число
 * @param {number} step шаг
 * @return {number} Возвращает число, кратное шагу, избегая проблем с точностью js.
 * {@link https://stackoverflow.com/a/58440614}
 * */
export const getRoundedValue = (value, step) => {
  return Math.round(value / step) / (1 / step)
}
