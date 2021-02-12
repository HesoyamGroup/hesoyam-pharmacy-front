<template>
    <div>
        <br>
        <work-calendar />
    </div>
</template>

<script>
import WorkCalendar from '../components/employee/WorkCalendar.vue'

export default {
  components: { WorkCalendar },
    name: 'WorkCalendarPage',
    data: function(){
        return {

        }
    }
}
</script>