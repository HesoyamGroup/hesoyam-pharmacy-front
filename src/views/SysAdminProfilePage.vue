<template> 
    <div id="sys-admin-profile-page">
        <add-pharmacy></add-pharmacy>
        <register-user></register-user>
        <admin-medicine></admin-medicine>
    </div>
</template>


<script>
    import AddPharmacy from '@/components/pharmacy/AddPharmacy.vue';
    import RegisterUser from '@/components/users/RegisterUser.vue';
    import AdminMedicine from '@/components/medicine/AdminMedicine.vue';

    export default {
        name: 'sys-admin-profile-page',
        components: {
            AddPharmacy,
            RegisterUser,
            AdminMedicine
        }
    }
</script>

<style scoped>
</style>