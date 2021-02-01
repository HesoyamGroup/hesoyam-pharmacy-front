<template> 
    <div id="supplier-page">
        <browse-medicine> </browse-medicine>
        
    </div>
</template>


<script>

    import BrowseMedicine from '@/components/medicine/BrowseMedicine.vue';

    export default {
        name: 'browse-medicine-page',
        components: {
            BrowseMedicine
        }
    }
</script>

<style scoped>
</style>