<template>
    <router-view />
</template>

<style>
body {
    padding: 1em;

}

fieldset>* {
    margin: 0.5em;
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
</style>

<script setup>
  //
</script>
