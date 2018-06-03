<template>
    <div class="wrapper">

        <div class="jumbotron">
            <h1 class="display-4">Добро пожаловать в игру: Пять в ряд!</h1>
            <p class="lead">Игра идёт на бесконечном поле. Фолов нет. Построение длинного ряда (5 и более фигур подряд) приносит победу.</p>
            <hr class="my-4">

            <form class="form" @submit.prevent="startGame">

                <div class="form-group">
                    <label for="player-name">Для начала введите свое имя.</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': nameError }" id="player-name" placeholder="Введите ваше имя" v-model="playerName">
                    <div class="invalid-feedback">
                        Пожалуйста, введите имя (Только буквы и цифры).
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Далее</button>

            </form>
        </div>

    </div>
</template>

<script>
export default {
    name: 'TheHelloForm',

    data() {
        return {
            playerName: '',
            nameError: false,
        };
    },

    methods: {
        clear_str(value) {
            let result = value;

            if (typeof result === 'string') {
                result = result
                    .replace(/<[^>]*?script[^>]*?>/gi, '')
                    .replace(/<[^>]*?js:[^>]*?>/gi, '');
                result = result
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                result = result
                    .replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '');
                return result;
            } else {
                return value;
            }
        },

        startGame() {
            const name = this.clear_str(this.playerName);

            name ? this.$store.commit('setPlayer', { name }) : (this.nameError = true);
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
