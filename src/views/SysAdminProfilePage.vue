<template> 
    <div id="sys-admin-profile-page">
        <add-pharmacy></add-pharmacy>
        <register-user></register-user>
        <admin-medicine></admin-medicine>
        <complaint-management> </complaint-management>
    </div>
</template>


<script>
    import AddPharmacy from '@/components/pharmacy/AddPharmacy.vue';
    import RegisterUser from '@/components/users/RegisterUser.vue';
    import AdminMedicine from '@/components/medicine/AdminMedicine.vue';
    import ComplaintManagement from '@/components/feedback/ComplaintManagement.vue';

    export default {
        name: 'sys-admin-profile-page',
        components: {
            AddPharmacy,
            RegisterUser,
            AdminMedicine,
            ComplaintManagement
        }
    }
</script>

<style scoped>
</style>