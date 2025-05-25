/**
 * @param {number} number
 * @param {String[]} titles - например: ['участник', 'участника', 'участников']
 * @description возвращает строку с окончанием, в соответствии с числом
 * */
export default function (number, titles) {
  if (!isNaN(number) && Array.isArray(titles) && titles.length === 3) {
    if (number) {
      const n = number
      return titles[
        n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
      ]
    } else return titles[2]
  } else return ''
}
