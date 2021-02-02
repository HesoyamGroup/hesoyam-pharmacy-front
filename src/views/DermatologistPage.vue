<template>
    <div id="pharmacist-page-main-container">
        <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">
        {{userDTO.firstName}} {{userDTO.lastName}}
      </h1>

    </v-card-title>
    <v-btn plain @click="logout()">Logout</v-btn>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      grow
    >
      <v-tab
        v-for="item in items"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item"
      >
        <v-card
          color="basil"
          flat
        >
        <div id="work-calendar-container" v-if="tab == '0'">
            <WorkCalendar />
        </div>
        <div v-else-if="tab ==1">
            <div id="update-employee-information-container">
                <EmployeeUpdateInformation />
            </div>
        </div>
        </v-card>
        </v-tab-item>
        </v-tabs-items>
    </v-card>
        
    </div>

</template>

<script>
    import WorkCalendar from '@/components/employee/WorkCalendar.vue';
    import EmployeeUpdateInformation from '@/components/users/EmployeeUpdateInformation.vue';
    import {client} from '@/client/axiosClient';

    export default {
        name: 'WorkCalendarPage',
        components: {
            WorkCalendar,
            EmployeeUpdateInformation
        },
        data: function(){
            return{
                userDTO:{
                    firstName: '',
                    lastName: '',
                },
                mode: 'calendar',
                tab: 0,
        items: [
        'Calendar', 'Edit Profile',
        ],


            }
        },
        mounted(){
          client({
            method: 'GET',
            url: 'dermatologist/dermatologist-information'
          }).then((response) => {
                console.log(response.data);
                this.userDTO = response.data;
          })
        },
        methods:{
          logout: function(){
            localStorage.user_role = null;
            localStorage.user_token = null;
            localStorage.user_token_expires = null;
            setTimeout(() => { this.$router.push({path: '/login'})}, 2000);
        },
        },
    }
</script>

<style>
    /* #pharmacist-page-main-container{
        margin-top: 2%;
    } */
    #work-calendar-container{
        margin: 2%;
    }

    #pharmacy-text{
      margin-bottom: 2%;
    }

    #update-employee-information-container{
      margin-top: 2%;
    }

    .main-buttons{
        margin: 10%;
    }

    /* Helper classes */
    .basil {
        background-color: #1A237E;
    }
    .basil--text {
        color: #5C6BC0;
    }
    
    .basil2--text {
        color: #7986CB;
    }

</style>