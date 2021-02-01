<template>
    <div id='all-pharmacies-container'>
        <AllPharmacies />
    </div>
</template>

<script>
    import AllPharmacies from '@/components/pharmacy/AllPharmacies.vue';

    export default {
        name: 'AllPharmaciesPage',
        components:{
            AllPharmacies
        }
    }
</script>