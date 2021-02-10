<template>
  <div class="home">
    <administrator-home-page v-if="isAdministrator"></administrator-home-page>
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
    }
  }
}
</script>
