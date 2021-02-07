<template> 
    <div id="checkup-report-container">
        <CheckUpReport />
    </div>
</template>


<script>
    import CheckUpReport from '@/components/appointment/CheckupReport1.vue';

    export default {
        name: 'CheckUpReportPage',
        components: {
            CheckUpReport
        }
    }
</script>

<style scoped>
</style>