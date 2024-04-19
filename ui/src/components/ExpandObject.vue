<template>

    <template v-if="Array.isArray(value)">
        <template v-for="(e, i) in value" :key="i">
            <template v-for="p in [appendPath(path, i)]">
                <v-expansion-panels v-if="isStructured(e)">
                    <v-expansion-panel :title="p">
                        <v-expansion-panel-text>
                            <ExpandObject :value="e" :path="p" />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-container v-else>
                    <v-row>
                        <v-col>{{ p }}</v-col>
                        <v-col>{{ e }}</v-col>
                    </v-row>
                </v-container>
            </template>
        </template>
    </template>

    <template v-else-if="typeof value == 'object'">
        <template v-for="(v, k, i) in value" :key="i">
            <template v-for="p in [appendPath(path, k)]">
                <v-expansion-panels v-if="isStructured(v)">
                    <v-expansion-panel :title="p">
                        <v-expansion-panel-text>
                            <ExpandObject :value="v" :path="p" />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-container v-else>
                    <v-row>
                        <v-col>{{ p }}</v-col>
                        <v-col>{{ v }}</v-col>
                    </v-row>
                </v-container>
            </template>
        </template>
    </template>

    <template v-else>
        {{ value }}
    </template>

</template>

<script setup>
const props = defineProps({
    value: {
        required: true,
    },
    path: {
        type: String,
        required: true,
    }
})

function isStructured(x) {
    return Array.isArray(x) || typeof x == 'object'
}

function appendPath(path, selector) {
    const re = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u
    if (re.exec(selector)) {
        return path + '.' + selector
    }
    return path + '[' + JSON.stringify(selector) + ']'
}
</script>
