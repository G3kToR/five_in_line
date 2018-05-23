<template>
    <div id="app">
        <TheHelloForm v-if="players" @start-game="onStartGame" />
        <TheInfinityField v-else />
    </div>
</template>

<script>
import TheHelloForm from './components/TheHelloForm';
import TheInfinityField from './components/TheInfinityField.vue';
export default {
    name: 'app',

    components: {
        TheHelloForm,
        TheInfinityField,
    },

    data() {
        return {
            players: null,
        };
    },

    methods: {
        onStartGame($event) {
            this.players = $event;
            console.log($event);
        },
    },
};
</script>

<style lang="scss">
@import 'main';

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
