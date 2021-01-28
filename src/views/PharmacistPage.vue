<template>

    <div id="pharmacist-page-main-container">
        <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold display-3 basil--text">
        {{user.name}} {{user.surname}}
      </h1>

    </v-card-title>
    <v-row justify="center">
      <h2 class="display-1 basil2--text" id="pharmacy-text">
        {{user.pharmacyName}}
      </h2>
    </v-row>
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
        <div id="work-calendar-container" v-if="tab == '1'">
            <WorkCalendar />
        </div>
        <div v-else-if="tab ==2">
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

    export default {
        name: 'WorkCalendarPage',
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