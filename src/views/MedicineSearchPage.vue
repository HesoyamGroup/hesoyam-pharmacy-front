<template>
    <div id='medicine-search-container'>
        <MedicineSearch />
    </div>
</template>

<script>
    import MedicineSearch from '@/components/medicine/MedicineSearch.vue';

    export default {
        name: 'MedicineSearchPage',
        components:{
            MedicineSearch
        }
    }
</script>