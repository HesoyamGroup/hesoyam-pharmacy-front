<template> 
    <div id="profile-container">
        <Profile />
    </div>
</template>


<script>
    import Profile from '@/components/users/Profile.vue';

    export default {
        name: 'ProfilePage',
        components: {
            Profile
        }
    }
</script>

<style scoped>
</style>