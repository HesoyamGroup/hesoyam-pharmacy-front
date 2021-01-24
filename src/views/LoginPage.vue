<template> 
    <div id="login-container">
        <Login />
    </div>
</template>


<script>
    import Login from '@/components/users/Login.vue';

    export default {
        name: 'LoginPage',
        components: {
            Login
        }
    }
</script>

<style scoped>
</style>