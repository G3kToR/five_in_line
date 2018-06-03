<template>
    <TheModalContent v-if="!wait">

        <template slot="header">
            Игра окончена!
        </template>

        <template slot="body">
            Победил {{ getCurrentPlayer.name }}! Хотите попробовать еще?
        </template>

        <template slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="leaveGameRoom">Отмена</button>
            <button v-if="getPlayerKey" type="button" class="btn btn-primary" @click="restartGameRoom">Еще раз</button>
        </template>

    </TheModalContent>

    <ModalWaitPlayers v-else />

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TheModalContent from './TheModalContent.vue';
import ModalWaitPlayers from './ModalWaitPlayers.vue';

export default {
    name: 'ModalFinishGame',

    components: {
        TheModalContent,
        ModalWaitPlayers,
    },

    computed: {
        ...mapGetters(['getCurrentPlayer', 'getPlayerFromApi', 'getPlayerKey']),

        wait() {
            return (this.getPlayerFromApi && ('status' in this.getPlayerFromApi) && this.getPlayerFromApi.status === 1);
        }
    },

    methods: {
        ...mapActions(['leaveGameRoom', 'restartGameRoom']),
    },
};
</script>
