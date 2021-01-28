<template>
  <v-parallax
    dark
    src="../resources/dermatologistPageBackground.jpg"
    height="100%"
  >
    
  </v-parallax>
</template>

<script>
    import WorkCalendar from '@/components/employee/WorkCalendar.vue';
    import EmployeeUpdateInformation from '@/components/users/EmployeeUpdateInformation.vue';

    export default {
        name: 'DermatologistPage',
        components: {
            WorkCalendar,
            EmployeeUpdateInformation
        },
        data: function(){
            return{
                user:{
                    name: 'Name',
                    surname: 'Surname',
                    pharmacyName: 'Hesoyam Pharmacy'
                },
                mode: 'calendar',
                tab: 1,
        items: [
          'Search Users', 'Calendar', 'Edit Profile',
        ],
            }
        }
    }
</script>
<style scoped>
    .pharmacy{
        color: rgb(255, 255, 255);
    }

    .title{
        color:rgb(88, 88, 88);
    }

</style>