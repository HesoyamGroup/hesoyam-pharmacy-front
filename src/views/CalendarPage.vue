<template> 
    <div id="work-calendar-container">
        <WorkCalendar />
    </div>
</template>

<script>
    import WorkCalendar from '@/components/employee/WorkCalendar.vue';

    export default {
        name: 'WorkCalendarPage',
        components: {
            WorkCalendar
        }
    }
</script>

<style scoped>
</style>