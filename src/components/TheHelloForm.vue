<template>
    <div class="wrapper">

        <div class="jumbotron">
            <h1 class="display-4">Добро пожаловать в игру: Пять в ряд!</h1>
            <p class="lead">Игра идёт на бесконечном поле. Фолов нет. Построение длинного ряда (5 и более фигур подряд) приносит победу.</p>
            <hr class="my-4">
            <p>Для начала введите имя игроков.</p>
            
            <form class="form" @submit.prevent="startGame">
                
                <div class="form-group">
                    <label for="Player1">Имя первого игрока</label>
                    <input type="text" class="form-control" id="Player1" placeholder="Введите имя первого игрока" v-model="players[0]">
                </div>
                
                <div class="form-group">
                    <label for="Player1">Имя второго игрока</label>
                    <input type="text" class="form-control" id="Player2" placeholder="Введите имя второго игрока" v-model="players[1]">
                </div>
                
                <button type="submit" class="btn btn-primary">Старт!</button>
                
            </form>
        </div>

    </div>
</template>

<script>
export default {
    name: 'TheHelloForm',

    data() {
        return {
            players: ['', ''],
        };
    },

    methods: {
        startGame() {

            this.players = this.players.map((player, index) => {
                return !player ? 'Игрок' + (index + 1) : player;
            });

            this.$emit('start-game', this.players);
        },
    },
};
</script>

<style lang="scss" scoped>
.wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #ffffff;

    .jumbotron {
        text-align: center;
    }

    .form {
        width: 30%;
        margin: auto;

        .form-group {
            text-align: left;
        }
    }
}
</style>
