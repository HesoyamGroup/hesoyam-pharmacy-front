<template> 
    <div id="register-container">
        <Register />
    </div>
</template>


<script>
    import Register from '@/components/users/Registration.vue';

    export default {
        name: 'RegisterPage',
        components: {
            Register
        }
    }
</script>

<style scoped>
</style>