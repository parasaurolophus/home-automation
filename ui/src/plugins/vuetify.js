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
        defaultTheme: 'dark'
    },
    defaults: {
        VAlert: {
            variant: 'tonal',
        },
        VBtn: {
            flat: true,
            variant: 'flat',
            color: 'primary',
        },
        VSwitch: {
            color: 'primary',
            inset: true,
            'hide-details': true,
        },
    }
})
