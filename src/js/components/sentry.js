;(async function () {
  const Sentry = await import('@sentry/browser')

  if (!Sentry) return

  Sentry.init({
    dsn: 'https://3225aeec453c46b48fa9ba5b03daaef2@sentry.rs-app.ru/5',
    integrations: [new Sentry.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
})()
