<template>
    <div id='feedback-container'>
        <PatientFeedback/>
    </div>  
</template>

<script>
    import PatientFeedback from '@/components/feedback/PatientFeedback.vue';
    export default {
        name:'PatientFeedbackPage',
        components: {
            PatientFeedback
        }
    }
</script>