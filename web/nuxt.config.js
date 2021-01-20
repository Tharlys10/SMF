import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Sistema de Mensageria do Finaceiro',
    title: 'SMF',
    htmlAttrs: {
      lang: 'pt-BR',
      amp: true
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', 
        href: process.env.NODE_ENV === 'production'
          ? process.env.BASE_URL + '/favicon.ico'
          : '/favicon.ico' 
      }
    ]
  },

  /**
  * env
  */
  env: {
    url_server: process.env.REST_ENDPOINT_CLIENT || 'http://localhost:4000'
  },


  server: {
    port: 3000,
    host: '0.0.0.0', // default: localhost
  },

  router: {
    base:
      process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL : '/',
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/vue-notification.js', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/moment',
  ],

  moment: {
    defaultLocale: 'pt',
    locales: ['pt'],
    timezone: true
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.REST_ENDPOINT_SERVER || 'http://localhost:4000',
    browserBaseURL: process.env.REST_ENDPOINT_CLIENT || 'http://localhost:4000',
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },



  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['vue-notification']
  }
}
