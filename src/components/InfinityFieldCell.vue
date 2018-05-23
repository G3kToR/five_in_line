<template>
    <div class="cell" :style="{'background': backColor}" @click="onClick">

    </div>
</template>

<script>
export default {
    name: 'InfinityFieldCell',

    props: {
        coords: {},
        mark: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            state: 0,
        };
    },

    computed: {
        backColor() {
            switch (this.mark) {
                case 0:
                    return '#ffd3b6';
                case 1:
                    return 'black';
                case 2:
                    return 'white';
            }
        },
    },

    methods: {
        onClick() {
            if (this.mark === 0) {
                this.$emit('click', this.coords);
            }
        },
    },

    /* mounted() {
        console.log(this.coords);
    }*/
};
</script>

<style lang="scss" scoped>
$border-color: #ffaaa5;
$background-color: #ffd3b6;

.cell {
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 2px;
    border: 1px solid $border-color;
    background: $background-color;
    cursor: pointer;
}

.cell:hover {
    border: 1px solid $background-color;
    background: $border-color !important;
}
</style>
