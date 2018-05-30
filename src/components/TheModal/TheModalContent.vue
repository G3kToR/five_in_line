<template>
    <div class="modal-content">

        <div class="modal-header">
            <h5 class="modal-title">
                <slot name="header" />
            </h5>
        </div>

        <div class="modal-body">
            <slot name="body" />
        </div>

        <div class="modal-footer">
            <slot name="footer" />
        </div>

    </div>
</template>

<script>
export default {
    name: 'TheModalContent',
};
</script>
