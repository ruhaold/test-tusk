export default {
  devmode: process.env.NODE_ENV === 'development',
  paths: {
    source: './src',
    output: './dist',
    public: './public',
  },
  server: {
    port: 8888,
  },
  gitlab: {
    base: '/rs/html/frontend-vite-pug/',
  },
};
