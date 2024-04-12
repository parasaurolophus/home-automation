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

        <v-expansion-panel title="Experimental" value="experimental">
          <v-expansion-panel-text>
            <div class="pad">
              <v-btn @click="fetchResource()">fetch /hue/resource</v-btn>
              <v-btn @click="fetchResource('192.168.1.12')">fetch /hue/resource/192.168.1.12</v-btn>
              <v-btn @click="fetchResource('192.168.1.12/motion')">fetch /hue/resource/192.168.1.12/motion</v-btn>
              <v-btn @click="fetchResource('192.168.1.12/motion/c6364a48-37ca-4c42-8ed2-e513ebae48aa')">fetch
                /hue/resource/192.168.1.12/motion/c6364a48-37ca-4c42-8ed2-e513ebae48aa</v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>

    </v-main>

  </v-app>

</template>

<style scoped>
.pad * {
  margin: 0.25em;
}
</style>

<script setup>
import { inject } from 'vue'

const showAlert = inject('showAlert')

async function fetchResource(path) {
  let url = 'http://127.0.0.1:1880/hue/resource/'
  if (path) {
    url += path
  }
  const response = await fetch(url)
  if (!response.ok) {
    console.warn('received ' + response.status + ' from ' + url + ' (' + response.statusText + ')')
    showAlert('warning', url, response.status + ': ' + response.statusText)
    return
  }
  const resource = await response.json()
  console.log(resource)
  showAlert('info', url, JSON.stringify(resource, undefined, 4))
}
</script>
