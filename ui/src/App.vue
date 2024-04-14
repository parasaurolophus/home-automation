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
            <v-expansion-panels>
              <v-expansion-panel v-for="(bridge, address) in hueBridges" :key="address">
                <v-expansion-panel-title>
                  {{ bridge.title ?? 'Unknown Bridge' }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <HueControlPanels :address="address" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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

      </v-expansion-panels>

    </v-main>

  </v-app>

</template>

<script setup>
import { inject } from 'vue'

const hueBridges = inject('hueBridges')
</script>
