<template>
  <div class="home">
    <administrator-home-page v-if="isAdministrator"></administrator-home-page>
    <sys-admin-profile-page v-if="isSysAdmin"></sys-admin-profile-page>
    <supplier-page v-if="isSupplier"></supplier-page>
    <!--
    <patient-home-page v-if="isPatient"></patient-home-page>
    ...
    ...
      -->
  </div>
</template>

<script>
// @ is an alias to /src
import AdministratorHomePage from './AdministratorHomePage.vue';
import SysAdminProfilePage from './SysAdminProfilePage.vue';
import SupplierPage from './SupplierPage.vue';
import * as UserService from '@/service/UserService';

export default {
  name: 'Home',
  components: {
    AdministratorHomePage,
    SysAdminProfilePage,
    SupplierPage
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
    },
    isSupplier(){
      return this.userRole == 'SUPPLIER';
    }
  }
}
</script>
