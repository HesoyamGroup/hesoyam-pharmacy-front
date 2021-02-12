<template>
<div>

<v-row align="center" justify="center" class="container">
    <vacation-request-creation />
</v-row>
</div>
</template>

<script>
import VacationRequestCreation from '../components/employee/VacationRequestCreation.vue'

export default {
  components: {  VacationRequestCreation },
    name: 'VacationRequestCreationPage',
    data: function(){
        return {

        }
    }
}
</script>
<style scoped>
    .container{
        margin-top: 5%;
    }
</style>