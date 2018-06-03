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
            <button type="button" class="btn btn-success" @click="restartGameRoom">Да</button>
        </template>

    </TheModalContent>

    <ModalWaitPlayers v-else type="restart" />

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TheModalContent from './TheModalContent.vue';
import ModalWaitPlayers from './ModalWaitPlayers.vue';

export default {
    name: 'ModalRestartGame',

    components: {
        TheModalContent,
        ModalWaitPlayers,
    },

    computed: {
        ...mapGetters(['getPlayerFromApi']),

        wait() {
            return (this.getPlayerFromApi && ('status' in this.getPlayerFromApi) && this.getPlayerFromApi.status === 1);
        }
    },

    methods: {
        ...mapActions(['leaveGameRoom', 'editGameRoom', 'restartGameRoom', 'resetPlayersStatus']),

        cancelRestart() {
            this.editGameRoom({ key: 'status', value: 0 });
            this.resetPlayersStatus();
        },
    },
};
</script>
