<template>
    <div class="modal fade" id="myModal" key="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Игра окончена!</h5>
                </div>
                <div class="modal-body">
                    Победил {{ getPlayerName }}! Хотите попробовать еще?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="newPlayers">Сменить игроков</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click="newGame">Еще раз</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFinalModal',

    computed: {
        getPlayerName() {
            //return this.players[this.player - 1];
            //return this.$store.getters.
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
