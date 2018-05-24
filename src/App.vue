<template>
    <div id="app">
        <TheHelloForm v-if="!players" @start-game="onStartGame" />
        <ThePlayground v-else :players="players" @new-players="onNewPlayers" />
    </div>
</template>

<script>
import TheHelloForm from './components/TheHelloForm';
import ThePlayground from './components/ThePlayground';
export default {
    name: 'app',

    components: {
        TheHelloForm,
        ThePlayground,
    },

    data() {
        return {
            players: null,
        };
    },

    methods: {
        onStartGame($event) {
            this.players = $event;
        },

        onNewPlayers() {
            this.players = null;
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
