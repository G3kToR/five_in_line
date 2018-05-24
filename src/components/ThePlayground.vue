<template>

    <div class="playground">

        <div class="header">
            <p>Ход игрока:
                <span class="user-icon" :class="userColor"></span>{{ getPlayerName }}</p>
            <button type="button" class="btn btn-light" @click="newGame">Рестарт</button>
        </div>

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

    </div>
</template>

<script>
import InfinityFieldCell from './InfinityFieldCell.vue';
import ImgArrow from './images/img-arrow.vue';
export default {
    name: 'ThePlayground',

    components: {
        InfinityFieldCell,
        ImgArrow,
    },

    props: {
        players: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            begin: [0, 0],
            marksArr: [],
            player: 1,
        };
    },

    computed: {
        getPlayerName() {
            return this.players[this.player - 1];
        },
        userColor() {
            return `user-icon_${this.player}`;
        },
    },

    methods: {
        onClickCell([x, y]) {
            this.marksArr.push([x, y, this.player]);

            if (this.marksArr.length >= 9) {
                const result =
                    this.checkWinnerLine([x, y], 'x') ||
                    this.checkWinnerLine([x, y], 'y') ||
                    this.checkWinnerDiagonal([x, y], 'left') ||
                    this.checkWinnerDiagonal([x, y], 'right');
                if (result) {
                    $('#myModal').modal({ backdrop: 'static' });
                    return;
                }
            }

            this.player = this.player === 1 ? 2 : 1;
        },

        checkWinnerLine([x, y], type) {
            
            let coord;
            let x1, x2, y1, y2, dx, dy;

            if (type === 'x') {
                x1 = x - 4;
                x2 = x + 4;
                y1 = y;
                y2 = y;
                dx = x2 - x1;
                dy = y2 - y1;
                coord = x;
            } else {
                x1 = x;
                x2 = x;
                y1 = y + 4;
                y2 = y - 4;
                dx = x2 - x1;
                dy = y2 - y1;
                coord = y;
            }

            const lineMark = this.marksArr.filter(mark => {
                const [mrkX, mrkY, mrkPl] = mark;

                return (
                    mrkPl === this.player &&
                    dx * (mrkY - y1) - (mrkX - x1) * dy === 0
                );
            });

            if (lineMark.length < 5) {
                return false;
            }

            let counter = 0;
            for (let i = coord - 4; i <= coord + 4; i++) {
                counter = lineMark.find(mark => mark[+(type === 'y')] === i)
                    ? ++counter
                    : 0;
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
            } else {
                x1 = x + 4;
                x2 = x - 4;
                y1 = y + 4;
                y2 = y - 4;
            }

            const lineMark = this.marksArr.filter(mark => {
                const [mrkX, mrkY, mrkPl] = mark;
                return (
                    mrkPl === this.player &&
                    (mrkX - x1) / (x2 - x1) === (mrkY - y1) / (y2 - y1)
                );
            });

            if (lineMark.length < 5) {
                return false;
            }

            let counter = 0;
            let yn = type === 'right' ? y - 4 : y + 4;
            for (let i = x - 4; i <= x + 4; i++) {
                counter = lineMark.find(mark => mark[0] === i && mark[1] === yn)
                    ? ++counter
                    : 0;
                yn = type === 'right' ? yn + 1 : yn - 1;

                if (counter === 5) {
                    break;
                }
            }
            return counter === 5;
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
            switch (direct) {
                case 'top':
                    this.begin[1]++;
                    break;
                case 'right':
                    this.begin[0]++;
                    break;
                case 'bottom':
                    this.begin[1]--;
                    break;
                case 'left':
                    this.begin[0]--;
                    break;
            }

            this.$forceUpdate();
        },

        newGame() {
            this.begin = [0, 0];
            this.marksArr.length = 0;
            this.player = 1;
        },

        newPlayers() {
            this.$emit('new-players');
        },
    },
};
</script>

<style lang="scss" scoped>
$border-color: #ffaaa5;
$background-color: #fff0e7;

.playground {
    width: 100%;
    height: 100%;
    min-width: 900px;
    padding-top: 60px;
    background: $background-color;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    white-space: nowrap;
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

.header {
    text-align: center;
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
