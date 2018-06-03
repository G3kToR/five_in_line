<template>
    <div id="app">
        <TheHelloForm v-if="!getPlayer.name" />
        <TheGameRooms v-else-if="getPlayer.name && !getRoomId" />
        <ThePlayground v-if="getRoomId" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import TheHelloForm from './components/TheHelloForm';
import TheGameRooms from './components/TheGameRooms.vue';
import ThePlayground from './components/ThePlayground';

export default {
    name: 'app',

    components: {
        TheHelloForm,
        TheGameRooms,
        ThePlayground,
    },

    computed: {
        ...mapGetters(['getPlayer', 'getRoomId']),
    },
};
</script>

<style lang="scss">
@import 'main';

#app {
    width: 100vw;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
