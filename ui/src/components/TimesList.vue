<template>

    <v-list>

        <v-list-item title="Theme">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ timerTheme }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Evening lighting theme
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Sunrise">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.sunrise).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Lights off, morning shades
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Midday">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.midday).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                All shades open
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Afternoon">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.afternoon).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Afternoon shades
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Sunset">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.sunset).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Evening lights, all shades open
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Dusk">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.dusk).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                All shades closed
            </div>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item title="Bedtime">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.bedtime).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
            <div class="notes">
                Nightlights, all shades closed
            </div>
        </v-list-item>

    </v-list>

</template>

<style scoped>
.notes {
    font-size: small;
    width: 100%;
    align-self: right;
    text-align: right;
}
</style>

<script setup>
import { inject } from 'vue'

const timerTime = inject('timerTime')
const timerTheme = inject('timerTheme')
</script>
