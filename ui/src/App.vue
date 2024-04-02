<template>
  <v-app>
    <v-main>

      <home-automation-app-bar />
      <alerts-pop-up />

      <v-expansion-panels>

        <v-expansion-panel title="Connections" value="status">
          <v-expansion-panel-text>
            <connection-diagram />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Lighting" value="lighting">
          <v-expansion-panel-text>
            <hue-control-panels />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Window Shades" value="shades">
          <v-expansion-panel-text>
            <power-view-control-panel />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Debug" value="debug">
          <v-expansion-panel-text>
            <v-container>
              <v-row>
                <v-col>
                  <all-times-list />
                </v-col>
                <v-col>
                  <automation-trigger />
                  <v-card title="Test Icon">
                    <v-card-subtitle>
                      <v-btn href="https://pictogrammers.com/library/mdi/" variant="text">
                        https://pictogrammers.com/library/mdi/
                      </v-btn>
                    </v-card-subtitle>
                    <v-card-text>
                      <v-text-field v-model="testIcon" :prepend-icon="testIcon" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const testIcon = ref('mdi-home-automation')
</script>
