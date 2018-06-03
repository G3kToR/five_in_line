<template>
    <div class="modal fade" id="modal" key="modal" tabindex="-1" role="dialog" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="modal">
            <ModalWaitPlayers v-if="getGameRoom.status === 1" />
            <ModalFinalGame v-else-if="getGameRoom.status === 2" />
            <ModalRestartGame v-else-if="getGameRoom.status === 3" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ModalFinalGame from './ModalFinalGame.vue';
import ModalWaitPlayers from './ModalWaitPlayers.vue';
import ModalRestartGame from './ModalRestartGame.vue';

export default {
    name: 'TheFinalModal',

    components: {
        ModalFinalGame,
        ModalWaitPlayers,
        ModalRestartGame,
    },

    computed: {
        ...mapGetters(['getGameRoom', 'getPlayerKey']),
    },

    mounted() {
        $('#modal').modal({ backdrop: 'static', keyboard: false, show: true });
    },

    beforeDestroy() {
        $('#modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.$emit('modal-close');
    },
};
</script>
