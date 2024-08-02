<template>
  <v-app>
    <v-main>
      <AppBar />
      <AlertsPopUp />
      <v-expansion-panels>
        <v-expansion-panel title="Settings" value="settings">
          <v-expansion-panel-text>
            <SettingsPanel />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Lighting" value="lighting">
          <v-expansion-panel-text>
            <HueControlPanels />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Window Shades" value="shades">
          <v-expansion-panel-text>
            <PowerViewControlPanel />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Connections" value="status">
          <v-expansion-panel-text>
            <ConnectionDiagram />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel v-if="debugMode" title="Debug" value="debug">
          <v-expansion-panel-text>
            <DebugTabs />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-main>
  </v-app>
</template>

<script setup>
import { inject, onMounted, onUpdated } from 'vue'
import { useTheme } from 'vuetify'
import mermaid from 'mermaid'

const debugMode = inject('debugMode')
const theme = useTheme()

onMounted(initializeMermaid)
onUpdated(initializeMermaid)

function initializeMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: theme.global.current.value.dark ? 'dark' : 'light',
  })
}
</script>