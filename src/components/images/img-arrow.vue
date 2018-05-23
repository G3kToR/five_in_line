<template>
    <svg version="1.1" id="Layer_1"
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    x="0px" y="0px"
    class="arrow"
    :width="size+'px'" 
    :height="size+'px'"
    @click="$emit('click')"
    :style="{'transform': `rotate(${rotate}deg)`}"
    viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
        <path :fill="color" d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
    </svg>
</template>

<script>
export default {
    name: 'img-arrow',
    props: {
        size: {
            type: Number,
            default: 24,
        },
        color: {
            type: String,
            default: '#333333',
        },
        rotate: {
            type: Number,
            default: 0,
        }
    },
};
</script>

<style lang="scss" scoped>
</style>

