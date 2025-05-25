import {
  COMMON_VIDEO_CLASS,
  COMMON_VIDEO_PLAY_BTN_CLASS,
  COMMON_VIDEO_WRAP_CLASS,
  DATA_NO_EFFECTS,
  HIDDEN_CLASS_NAME,
  LOADED_CLASS,
} from '../../js/constants'

export default class VideoClass {
  constructor(config) {
    if (typeof config === 'object') {
      Object.keys(config).forEach((key) => {
        this[key] = config[key]
      })
    }

    this.init()
    this.initAutoplay()
  }

  init() {
    const videos = document.querySelectorAll(`.${COMMON_VIDEO_WRAP_CLASS}`)

    videos.forEach((el) => {
      const video = el.querySelector(`.${COMMON_VIDEO_CLASS}`)
      const playBtn = el.querySelector(`.${COMMON_VIDEO_PLAY_BTN_CLASS}`)

      if (video && playBtn) {
        const src = video.getAttribute('data-src')
        const isVideo = video.tagName.toLowerCase() === 'video'
        const isIframe = video.tagName.toLowerCase() === 'iframe'

        const hidePlay = () => {
          playBtn.classList.add(HIDDEN_CLASS_NAME)
          video.classList.remove(HIDDEN_CLASS_NAME)

          setTimeout(() => {
            playBtn.remove()
          }, 500)
        }

        playBtn.addEventListener('click', () => {
          if (isVideo && video.paused) {
            video.setAttribute('controls', '')
            video.play()
            video.style.objectFit = 'contain'
          } else if (isIframe && src) {
            video.setAttribute('src', src)
          }

          hidePlay()
        })
      }
    })
  }

  initAutoplay() {
    const videos = document.querySelectorAll('video[autoplay]')

    if (videos && window.IntersectionObserver) {
      const observerOptions = {
        threshold: 0.5,
      }
      const callback = function (entries, observer) {
        entries.forEach((entry) => {
          const video = entry.target
          const isLoaded = video.classList.contains(LOADED_CLASS)

          if (document.documentElement.hasAttribute(DATA_NO_EFFECTS)) {
            video.pause()
            video.currentTime = 0
          } else {
            if (!entry.isIntersecting) {
              video.pause()
              video.currentTime = 0
            } else {
              if (!isLoaded) {
                const dataSrc = video.dataset.src

                video.classList.add(LOADED_CLASS)

                if (video.children.length) {
                  for (const source in video.children) {
                    const videoSource = video.children[source]
                    const dataSrc = videoSource?.dataset?.src

                    if (
                      videoSource &&
                      typeof videoSource.tagName === 'string' &&
                      videoSource.tagName === 'SOURCE' &&
                      dataSrc
                    ) {
                      videoSource.src = dataSrc
                    }
                  }
                } else if (dataSrc) {
                  video.src = dataSrc
                }

                video.load()
              }

              video.play()
            }
          }
        })
      }
      const observer = new IntersectionObserver(callback, observerOptions)
      videos.forEach((el) => {
        if (el) {
          observer.observe(el)
        }
      })
    }
  }
}
