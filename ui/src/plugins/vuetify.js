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
            density: 'compact',
            variant: 'tonal',
        },
        VBtn: {
            density: 'compact',
            color: 'primary',
        },
        VBtnToggle: {
            density: 'compact',
            color: 'primary',
            rounded: 'pill',
            divided: true,
            VBtn: {
                density: 'compact',
                flat: true,
                variant: 'flat'
            },
        },
        VCard: {
            density: 'compact',
        },
        VExpansionPanels: {
            variant: 'popout',
        },
        VList: {
            density: 'compact',
        },
        VListItem: {
            density: 'compact',
        },
        VSwitch: {
            density: 'compact',
            color: 'primary',
            inset: true,
            'hide-details': true,
        },
    }
})
