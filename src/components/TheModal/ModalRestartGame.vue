<template>

    <TheModalContent v-if="!wait">

        <template slot="header">
            Рестарт игры.
        </template>

        <template slot="body">
            Соперник хочет начать игру сначала, Вы согласны?
        </template>

        <template slot="footer">
            <button type="button" class="btn btn-danger" @click="cancelRestart">Нет</button>
            <button type="button" class="btn btn-success" @click="restartGame">Да</button>
        </template>

    </TheModalContent>

    <ModalWaitPlayers v-else type="restart" />

</template>

<script>
import { mapActions } from 'vuex';

import TheModalContent from './TheModalContent.vue';
import ModalWaitPlayers from './ModalWaitPlayers.vue';

export default {
    name: 'ModalRestartGame',

    components: {
        TheModalContent,
        ModalWaitPlayers,
    },

    props: {
        wait: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        ...mapActions(['leaveGameRoom', 'editGameRoom', 'resetGameRoom']),

        cancelRestart() {
            this.editGameRoom({ key: 'status', value: 0 });
        },

        restartGame() {
            this.resetGameRoom({ status: 0 });
        },
    },
};
</script>
