<template>
    <HandOutMedicine class="main-container"/>
</template>

<script>
    import HandOutMedicine from "@/components/medicine/HandOutMedicine.vue";

export default {
     name: 'HandOutMedicinePages',
        components: {
            HandOutMedicine
        }
}
</script>
<style scoped>
    .main-container{
        margin: 5%;
    }
</style>