<template>

  <v-app>

    <v-main>

      <HomeAutomationAppBar />
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

      </v-expansion-panels>

    </v-main>

  </v-app>

</template>
