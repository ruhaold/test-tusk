import { USE_MOUSE_CLASS } from '../constants'

// определяет, пользуется ли пользователь только клавиатурой для навигации, добавляя/убирая у body класс _use-mouse
export const checkUseMouse = () => {
  const keyboardKeyCodes = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Tab', 'Escape', 'Space', 'Enter']
  const mouseEvents = ['mousedown', 'mouseup']

  mouseEvents.forEach((name) => {
    document.documentElement.addEventListener(name, () => {
      document.body.classList.add(USE_MOUSE_CLASS)
    })
  })

  document.documentElement.addEventListener('keydown', (e) => {
    if (keyboardKeyCodes.some((code) => code === e.code)) {
      document.body.classList.remove(USE_MOUSE_CLASS)
    }
  })
}
