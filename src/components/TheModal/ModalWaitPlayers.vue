<template>
    <TheModalContent>
        <template slot="header">Ожидание соперника...</template>

        <template slot="body">
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
            </div>
        </template>

        <template slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancel">Отмена</button>
        </template>
    </TheModalContent>
</template>

<script>
import { mapActions } from 'vuex';

import TheModalContent from './TheModalContent.vue';

export default {
    name: 'ModalWaitPlayers',

    components: {
        TheModalContent,
    },

    props: {
        type: {
            type: String,
            default: 'none',
        },
    },

    methods: {
        ...mapActions(['leaveGameRoom', 'editGameRoom']),

        cancel() {
            return this.type === 'restart' ? this.cancelRestart() : this.leaveGameRoom();
        },

        cancelRestart() {
            this.editGameRoom({ key: 'status', value: 0 });
        },
    },
};
</script>
