import axios from 'axios'

export default class HttpClass {
  constructor() {
    const defaultConfig = {
      baseURL: window.app.restUrl,
      timeout: 60 * 1000, // Timeout
      params: {
        [window.app.langParam]: window.app.lang,
      },
    }
    this.axios = axios.create(defaultConfig)

    this.axios.interceptors.request.use(
      (config) => {
        if (config.params instanceof URLSearchParams) {
          Object.entries(defaultConfig.params).forEach(([k, v]) => {
            config.params.append(k, v)
          })
        }
        // Do something before request is sent
        return config
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error)
      },
    )

    // Add a response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        if (response.status !== 200 || response.data?.success === false) {
          return Promise.reject(response.data)
        }
        return response.data
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error)
      },
    )
  }
}
