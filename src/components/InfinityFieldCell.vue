<template>
    <div class="cell" :class="cellBackground" @click="onClick" :title="coords"></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'InfinityFieldCell',

    props: {
        coords: {
            type: Array,
            required: true,
        },
        mark: {
            type: Number,
            default: 0,
        },
    },

    computed: {
        ...mapGetters([
            'getGameRoom',
            'checkPlayerStep',
        ]),
        
        cellBackground() {
            return { 0: '', 1: 'cell1', 2: 'cell2' }[this.mark];
        },

    },

    methods: {
        onClick() {
            if (this.mark === 0 && this.checkPlayerStep) {
                this.$emit('click', this.coords);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
$border-color: #ffaaa5;
$background-color: #ffd3b6;

.cell {
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 2px 1px;
    border: 1px solid $border-color;
    background: $background-color;
    cursor: pointer;
}

.cell:hover {
    border: 1px solid $background-color;
    background: $border-color !important;
}

.cell1,
.cell1:hover {
    background: #000000 !important;
}
.cell2,
.cell2:hover {
    background: #ffffff !important;
}
</style>
