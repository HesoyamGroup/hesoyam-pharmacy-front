<template> 
    <div id="profile-container">
        <administrator-profile v-if="isAdministrator"></administrator-profile>
        <Profile v-else/>
    </div>
</template>


<script>
    import Profile from '@/components/users/Profile.vue';
    import * as UserService from '@/service/UserService';
    import AdministratorProfile from '../components/users/AdministratorProfile.vue';
    export default {
        name: 'ProfilePage',
        components: {
            Profile,
            AdministratorProfile
        },
        data(){
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

<style scoped>
</style>