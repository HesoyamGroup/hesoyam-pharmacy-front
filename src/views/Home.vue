<template>
  <div class="home">
    <administrator-home-page v-if="isAdministrator"></administrator-home-page>
    <!--
    <patient-home-page v-if="isPatient"></patient-home-page>
    ...
    ...
      -->
  </div>
</template>

<script>
// @ is an alias to /src
import AdministratorHomePage from './AdministratorHomePage.vue'
import * as UserService from '@/service/UserService'

export default {
  name: 'Home',
  components: {
    AdministratorHomePage
  },
  data: function(){
    return{
      userRole: ''
    }
  },
  created(){
    let user = UserService.getLoggedUserData();
    this.userRole = user.userRole;
  },
  computed:{
    isAdministrator(){
      return this.userRole == 'ADMINISTRATOR';
    },
    isPatient(){
      return this.userRole == 'PATIENT';
    },
    isUnauthorized(){
      return this.userRole == '';
    },
    isSysAdmin(){
      return this.userRole == 'SYS_ADMIN';
    }
  }
}
</script>
