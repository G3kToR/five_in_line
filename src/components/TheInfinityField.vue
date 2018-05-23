<template>
    <div class="infinity-field">
        <img-arrow :size="120" :rotate="-90" class="arrow arrow_row" @click="moveField('top')" />
        <div class="field-wrapper">
            <img-arrow :size="120" :rotate="180" class="arrow arrow_column" @click="moveField('left')" />
            <div class="field" v-if="center">
                <div class="column" v-for="col in size" :key="'col'+col">
                    <InfinityFieldCell v-for="row in size" :key="'row'+row" 
                    :coords="calcCoords(row, col)" :mark="checkMark(calcCoords(row, col))" @click="onClickCell"/>
                </div>
            </div>
            <img-arrow :size="120" class="arrow arrow_column" @click="moveField('right')" />
        </div>
        <img-arrow :size="120" :rotate="90" class="arrow arrow_row" @click="moveField('bottom')" />
    </div>
</template>

<script>
import InfinityFieldCell from './InfinityFieldCell.vue';
import ImgArrow from './images/img-arrow.vue';
export default {
    name: 'TheInfinityField',

    components: {
        InfinityFieldCell,
        ImgArrow,
    },

    data() {
        return {
            center: [0, 0],
            size: 10,
            marksArr: [[2, 3, 1], [4, 5, 2]],
            player: 1,
        };
    },

    methods: {

        onClickCell($event) {
            if (!this.checkMark($event)) {
                const [x, y] = $event;
                this.marksArr.push([x, y, this.player]);
                this.player = (this.player === 1) ? 2 : 1;
            }
        },

        calcCoords(row, col) {
            return [10 - (row + this.center[1]), (col - 1 + this.center[0])];
        },

        checkMark(coords) {
            for(const mark of this.marksArr) {
                if (mark[0] === coords[0] && mark[1] === coords[1]) {
                    return mark[2];
                }
            }
            return 0;
        },

        moveField(direct) {
            switch (direct) {
                case 'top':
                    this.center[1]++;
                    break;
                case 'right':
                    this.center[0]++;
                    break;
                case 'bottom':
                    this.center[1]--;
                    break;
                case 'left':
                    this.center[0]--;
                    break;
            }
            console.log(this.center);
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="scss" scoped>
$border-color: #ffaaa5;
$background-color: #fff0e7;

.infinity-field {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 100px;
    background: $background-color;
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
    //display: flex;
    //overflow: auto;
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
</style>
