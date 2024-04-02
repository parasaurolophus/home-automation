<template>

    <v-list>

        <v-list-item title="Theme (determines evening lighting colors)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ timerTheme }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Sunrise (lights off, morning shades)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.sunrise).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Midday (all shades open)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.midday).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Afternoon (afternoon shades)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.afternoon).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Sunset (evening lights, all shades open)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.sunset).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Dusk (all shades closed)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.dusk).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

        <v-list-item title="Bedtime (nightlights, all shades closed)">
            <v-list-item-subtitle>
                <v-chip variant="text" color="primary">
                    {{ new Date(timerTime.bedtime).toLocaleString() }}
                </v-chip>
            </v-list-item-subtitle>
        </v-list-item>

    </v-list>

</template>

<script setup>
import { inject } from 'vue'

const timerTime = inject('timerTime')
const timerTheme = inject('timerTheme')
</script>
