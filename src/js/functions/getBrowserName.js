// Following regular expressions are originated from bowser(https://github.com/lancedikson/bowser).
// Copyright 2015, Dustin Diaz (the "Original Author")
// https://github.com/lancedikson/bowser/blob/master/LICENSE
const browsers = [
  { name: 'Samsung', test: /SamsungBrowser/i },
  { name: 'Edge', test: /edg([ea]|ios|)\//i },
  { name: 'Firefox', test: /firefox|iceweasel|fxios/i },
  { name: 'Chrome', test: /chrome|crios|crmo/i },
  { name: 'Safari', test: /safari|applewebkit/i },
]

/**
 * Определяет текущий браузер по userAgent.
 *
 * @param {string} userAgent window.navigator.userAgent
 * @return {string} возвращает имя браузера
 * */
export function getBrowserName(userAgent) {
  for (const b of browsers) {
    if (b.test.test(userAgent)) {
      return b.name
    }
  }
  return ''
}
