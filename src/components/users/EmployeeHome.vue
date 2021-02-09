<template>
  <div>
    <br>
    <v-row justify="center">
    <h1 class="welcome">WELCOME!</h1>
    </v-row>
    <v-row justify="left">
    <v-btn plain color="indigo lighten-2" @click="drawer = true"><v-icon>mdi-menu</v-icon></v-btn>
    </v-row>
    <br>

    <!-- DRAWER -->
    <v-navigation-drawer
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


  </div>
</template>

<script>
  import WorkCalendar from '@/components/employee/WorkCalendar.vue';
  import SearchUsers from "@/components/users/SearchUsers.vue";
  import BookNewAppointment from "@/components/appointment/BookNewAppointment.vue";
  import {client} from '@/client/axiosClient';

  export default {
    components: {
      WorkCalendar,
      SearchUsers,
      BookNewAppointment
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
    }
</style>