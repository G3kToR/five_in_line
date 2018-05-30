<template>

    <div v-if="isLoad" class="playground">

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <p class="navbar-brand mb-0">
                Комната №{{ gameRoom.id }}
            </p>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
                <div class="navbar-nav">
                    <a class="nav-item nav-link" href="#" @click.prevent="restartGame">Рестарт</a>
                    <a class="nav-item nav-link" href="#" @click.prevent="leaveGameRoom">Покинуть комнату</a>
                </div>
            </div>

            <p class="navbar-brand mb-0">
                Ход игрока:
                <span class="user-icon" :class="userColor"></span>{{ getPlayerName }}
            </p>
        </nav>

        <img-arrow :size="120" :rotate="-90" class="arrow arrow_row" @click="moveField('top')" />
        <div class="field-wrapper">
            <img-arrow :size="120" :rotate="180" class="arrow arrow_column" @click="moveField('left')" />
            <div class="field">
                <div class="column" v-for="row in 10" :key="'row'+row">
                    <InfinityFieldCell v-for="col in 10" :key="'col'+col" :coords="calcCoords(row, col)" :mark="checkMark(calcCoords(row, col))" @click="onClickCell" />
                </div>
            </div>
            <img-arrow :size="120" class="arrow arrow_column" @click="moveField('right')" />
        </div>
        <img-arrow :size="120" :rotate="90" class="arrow arrow_row" @click="moveField('bottom')" />

        <TheModal v-if="gameRoom.status > 0" :type="modalType" @modal-close="modalType = 'default'" />

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import InfinityFieldCell from './InfinityFieldCell.vue';
import ImgArrow from './images/img-arrow.vue';
import TheModal from './TheModal/TheModal.vue';

export default {
    name: 'ThePlayground',

    components: {
        InfinityFieldCell,
        ImgArrow,
        TheModal,
    },

    data() {
        return {
            isLoad: false,
            modalType: 'default',
        };
    },

    computed: {
        ...mapGetters(['getPlayer', 'getCurrentPlayer']),
        ...mapGetters({
            gameRoom: 'getGameRoom',
        }),

        userColor() {
            return `user-icon_${this.player}`;
        },

        players() {
            return this.gameRoom.players;
        },

        getPlayerName() {
            return this.gameRoom ? this.getCurrentPlayer.name : 'Аноним';
        },

        player() {
            return this.gameRoom.player;
        },

        begin: {
            get() {
                return this.gameRoom.begin;
            },
            set(value) {
                this.editGameRoom({
                    key: 'begin',
                    value: value,
                });
            },
        },

        marksArr() {
            return this.gameRoom.marksArr.slice();
        },
    },

    methods: {
        ...mapActions(['editGameRoom', 'leaveGameRoom', 'setGameMark', 'loadGameRoomFromApi']),

        onClickCell([x, y]) {
            this.marksArr.push([x, y, this.player]);

            if (this.marksArr.length >= 9) {
                const result =
                    this.checkWinnerLine([x, y], 'x') ||
                    this.checkWinnerLine([x, y], 'y') ||
                    this.checkWinnerDiagonal([x, y], 'left') ||
                    this.checkWinnerDiagonal([x, y], 'right');

                if (result) {
                    return this.editGameRoom({
                        key: 'status',
                        value: 2,
                    });
                }
            }

            this.setGameMark(this.marksArr);
        },

        checkWinnerLine([x, y], type) {
            let x1, x2, y1, y2, coord;

            if (type === 'x') {
                x1 = x - 4;
                x2 = x + 4;
                y1 = y;
                y2 = y;
                coord = x;
            } else if (type === 'y') {
                x1 = x;
                x2 = x;
                y1 = y + 4;
                y2 = y - 4;
                coord = y;
            }

            const lineMark = this.findPlayerMarks([x, y], { x1, x2, y1, y2 });

            if (lineMark.length < 5) {
                return false;
            }

            let counter = 0;
            for (let i = coord - 4; i <= coord + 4; i++) {
                counter = lineMark.find(mark => mark[+(type === 'y')] === i) ? ++counter : 0;
                if (counter === 5) {
                    break;
                }
            }
            return counter === 5;
        },

        checkWinnerDiagonal([x, y], type) {
            let x1, x2, y1, y2;
            if (type === 'left') {
                x1 = x - 4;
                x2 = x + 4;
                y1 = y + 4;
                y2 = y - 4;
            } else if (type === 'right') {
                x1 = x + 4;
                x2 = x - 4;
                y1 = y + 4;
                y2 = y - 4;
            }

            const lineMark = this.findPlayerMarks([x, y], { x1, x2, y1, y2 });

            if (lineMark.length < 5) {
                return false;
            }

            let counter = 0;
            let yn = type === 'right' ? y - 4 : y + 4;
            for (let i = x - 4; i <= x + 4; i++) {
                counter = lineMark.find(mark => mark[0] === i && mark[1] === yn) ? ++counter : 0;
                yn = type === 'right' ? yn + 1 : yn - 1;

                if (counter === 5) {
                    break;
                }
            }
            return counter === 5;
        },

        findPlayerMarks([x, y], { x1, x2, y1, y2 }) {
            let dx, dy;

            dx = x2 - x1;
            dy = y2 - y1;

            const lineMark = this.marksArr.filter(mark => {
                const [mrkX, mrkY, mrkPl] = mark;

                return mrkPl === this.player && dx * (mrkY - y1) - (mrkX - x1) * dy === 0;
            });

            return lineMark;
        },

        calcCoords(row, col) {
            return [row - 1 + this.begin[0], 10 - col + this.begin[1]];
        },

        checkMark(coords) {
            for (const mark of this.marksArr) {
                if (mark[0] === coords[0] && mark[1] === coords[1]) {
                    return mark[2];
                }
            }
            return 0;
        },

        moveField(direct) {
            if (this.getPlayer.id !== this.getCurrentPlayer.id) return;

            switch (direct) {
                case 'top':
                    this.begin = [this.begin[0], ++this.begin[1]];
                    break;
                case 'right':
                    this.begin = [++this.begin[0], this.begin[1]];
                    break;
                case 'bottom':
                    this.begin = [this.begin[0], --this.begin[1]];
                    break;
                case 'left':
                    this.begin = [--this.begin[0], this.begin[1]];
                    break;
            }

            this.$forceUpdate();
        },

        restartGame() {
            this.modalType = 'restart';
            this.editGameRoom({ key: 'status', value: 5 });
        },
    },

    created() {
        this.loadGameRoomFromApi().then(() => {
            this.isLoad = true;
        });

        window.onbeforeunload = () => {
            const isLeave = window.confirm(
                'Вы действительно хотите уйти? У вас есть несохранённые изменения!'
            );

            if (isLeave) {
                this.leaveGameRoom();
            }
        };
    },
};
</script>

<style lang="scss" scoped>
$border-color: #ffaaa5;
$background-color: #fff0e7;

.playground {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    min-width: 900px;
    background: $background-color;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    white-space: nowrap;

    .navbar {
        box-shadow: 0px 0px 8px #dfb5b3;

        .navbar-brand {
            font-size: 16px;
        }
    }
}

.field-wrapper {
    margin: 0 auto;
    text-align: center;
}

.field {
    width: 542px;
    height: 524px;
    border: 1px solid $border-color;
    display: inline-block;
    vertical-align: middle;
    background: #f3f3f3;
    box-shadow: 0px 0px 8px #dfb5b3;
}

.column {
    display: inline-block;
}

.arrow {
    cursor: pointer;
    opacity: 0.5;
}

.arrow:hover {
    opacity: 1;
}

.arrow_row {
    display: block;
    margin: auto;
}

.arrow_column {
    display: inline-block;
    width: 120px;
    margin-bottom: -50px;
}

.step {
    float: right;
}

.user-icon {
    display: inline-block;
    vertical-align: middle;
    height: 20px;
    width: 20px;
    margin: -3px 10px 0 0;
    border: 1px solid #666666;
    border-radius: 50%;
}

.user-icon_1 {
    background: #000000;
}

.user-icon_2 {
    background: #ffffff;
}
</style>
