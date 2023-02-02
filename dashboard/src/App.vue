<template>
    <router-view />
</template>

<style>
body {
    padding: 1em;

}

fieldset,
fieldset>* {
    margin: 0.25em;
    padding: 0.25em;
}

th,
td {
    margin: 1px;
    padding: 1px 0.5em 1px 0.5em;
}

th {
    text-align: right;
}

.wrapped {
    display: flex;
    flex-flow: row wrap;
}

.wrapped>* {
    flex: 1;
}

.controls-label {
    margin-top: 1em;
    font-weight: bold;
}
</style>

<script setup>
  //
</script>
