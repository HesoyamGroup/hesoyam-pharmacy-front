<template>
  <div>
    <br>
    <!-- <v-row justify="center"> -->
    <v-row justify="center">
    <h1 class="welcome">WELCOME!</h1>
    </v-row>
    <v-row justify="left">
    <v-btn class="profile-nav" plain v-if="role==='ROLE_PHARMACIST'" to="/pharmacist"><v-avatar color="indigo lighten-2"><span class="white-text">{{firstName.substring(0,1)}}{{lastName.substring(0,1)}}</span></v-avatar></v-btn>
    <v-btn class="profile-nav" plain v-if="role==='ROLE_DERMATOLOGIST'" to="/dermatologist"><v-avatar color="indigo lighten-2"><span class="white-text">{{firstName.substring(0,1)}}{{lastName.substring(0,1)}}</span></v-avatar></v-btn>
    </v-row>
    <br>

    <!-- DRAWER -->
    <!-- <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar color="indigo lighten-2"><span class="avatar-txt">{{firstName.substring(0,1)}}{{lastName.substring(0,1)}}</span></v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{firstName}} {{lastName}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item link to="/pharmacist" v-if="role==='ROLE_PHARMACIST'">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/dermatologist" v-if="role === 'ROLE_DERMATOLOGIST'">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigation='calendar'">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigation='searchUsers'">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Search Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigation='bookNewAppointment'">
          <v-list-item-icon>
            <v-icon>mdi-calendar-clock</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Book a new appointment</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="navigation='vacationRequest'">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Request a vacation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  <div v-if="navigation==='calendar'">
    <WorkCalendar />
  </div>

  <div v-if="navigation==='searchUsers'">
    <br>
    <SearchUsers />
  </div>

  <div v-if="navigation==='bookNewAppointment'">
    <br>
    <BookNewAppointment />
  </div>

  <div v-if="navigation==='vacationRequest'">
    <v-row justify="center" class="vacation-request">
    <br>
    <VacationRequestCreation />
    </v-row>
  </div> -->
  <v-row justify="center" class="recommendation-text">
  <h2 class="welcome">Take a look at your tasks for today!</h2>
  </v-row>
  <v-row justify="center" class="list-item">
    
    <WorkCalendar class="calendar"/>
  </v-row>

  <v-divider inset></v-divider>
  <v-row justify="center" class="recommendation-text">
  <h2 class="welcome">Search for patients and start/cancel appointments!</h2>
  </v-row>
  <v-row justify="center" class="list-item">
    <SearchUsers />
  </v-row>

  <v-divider inset></v-divider>
  <v-row justify="center" class="recommendation-text">
  <h2 class="welcome">Book a new appointment for your patients!</h2>
  </v-row>
  <v-row justify="center" class="list-item">
    <BookNewAppointment />
  </v-row>

  <v-divider inset></v-divider>
  <v-row justify="center" class="recommendation-text">
  <h2 class="welcome">Request some time off!</h2>
  </v-row>
  <v-row justify="center" class="list-item">
    <br>
    <VacationRequestCreation />
  </v-row>
  </div>
</template>

<script>
  import WorkCalendar from '@/components/employee/WorkCalendar.vue';
  import SearchUsers from "@/components/users/SearchUsers.vue";
  import VacationRequestCreation from "@/components/employee/VacationRequestCreation.vue";
  import BookNewAppointment from "@/components/appointment/BookNewAppointment.vue";
  import {client} from '@/client/axiosClient';

  export default {
    components: {
      WorkCalendar,
      SearchUsers,
      BookNewAppointment,
      VacationRequestCreation
    },
    data: function(){
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: 'hesoyampharmacy+jd@gmail.com',
            navigation: 'calendar',
            role: null,
            drawer: false,
            userDTO:{
                    firstName: '',
                    lastName: '',
                    pharmacyName: ''
                },
            
        right: null,
        }
    },

    mounted(){
      var link = '';
      if(localStorage.getItem("user_role") === "ROLE_PHARMACIST"){
        link = 'pharmacist/pharmacist-information';
        this.role = "ROLE_PHARMACIST";
      }
      else{
        this.role = "ROLE_DERMATOLOGIST";
        link = 'dermatologist/dermatologist-information';
      }


          client({
            method: 'GET',
            url: link
          }).then((response) => {
            console.log(response.data);
            this.firstName = response.data.firstName;
            this.lastName = response.data.lastName;
          })
        },
  }
</script>
<style scoped>
    .avatar-txt{
        color: white;
    }
    .welcome{
      color: #7986CB;
      justify-items: center;
    }
    .vacation-request{
      margin-bottom: 5%;
      margin-top: 5%;
    }

    .list-item{
      margin: 10%;
      max-width: 100%;
    }

    .recommendation-text{
      margin-top: 5%;
      margin-bottom: 5%;
    }

    .calendar{
      width: 1000px;
    }
    .white-text{
      color: white;
    }
    .profile-nav{
      margin-left: 5%;
    }
</style>