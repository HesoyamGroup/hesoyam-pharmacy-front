<template> 
    <div id="counseling-report-container">
        <CounselingReport />
    </div>
</template>


<script>
    import CounselingReport from '@/components/appointment/CounselingReport.vue';

    export default {
        name: 'CounselingReportPage',
        components: {
            CounselingReport
        }
    }
</script>

<style scoped>
</style>