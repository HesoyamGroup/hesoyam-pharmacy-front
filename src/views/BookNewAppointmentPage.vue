<template>
    <div id='new-appointment-container' class="main-container">
        <BookNewAppointment />
    </div>
</template>

<script>
    import BookNewAppointment from '@/components/appointment/BookNewAppointment.vue';

    export default {
        name: 'BookNewAppointmentPage',
        components:{
            BookNewAppointment
        }
    }
</script>

<style scoped>
    .main-container{
        margin: 5%;
    }
</style>