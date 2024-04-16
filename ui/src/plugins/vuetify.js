/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { md3 } from 'vuetify/blueprints'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'dark',
  },
  defaults: {
    global: {
      density: 'compact',
    },
    VAlert: {
      variant: 'tonal',
    },
    VBtn: {
      color: 'primary',
    },
    VBtnToggle: {
      color: 'primary',
      rounded: 'pill',
      divided: true,
      VBtn: {
        flat: true,
        variant: 'flat'
      },
    },
    VChip: {
      variant: 'text',
    },
    VSwitch: {
      color: 'primary',
      inset: true,
      'hide-details': true,
    },
  }
})
