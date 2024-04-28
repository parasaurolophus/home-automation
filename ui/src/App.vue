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
      <pre v-if="debugMode">{{ JSON.stringify(lastMessage, undefined, 4) }}</pre>
    </v-main>
  </v-app>
</template>

<script setup>
import { inject } from 'vue'

const lastMessage = inject('lastMessage')
const debugMode = inject('debugMode')
</script>