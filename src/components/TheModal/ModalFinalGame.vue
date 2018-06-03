<template>
    <TheModalContent v-if="isFinish">

        <template slot="header">
            Игра окончена!
        </template>

        <template slot="body">
            Победил {{ getCurrentPlayer.name }}! Хотите попробовать еще?
        </template>

        <template slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="leaveGameRoom">Отмена</button>
            <button type="button" class="btn btn-primary" @click="restartGame">Еще раз</button>
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

    data() {
        return {
            isFinish: true,
        };
    },

    computed: {
        ...mapGetters(['getCurrentPlayer']),
    },

    methods: {
        ...mapActions(['leaveGameRoom', 'restartGameRoom']),

        restartGame() {
            this.restartGameRoom();
            this.isFinish = false;
        },
    },
};
</script>
