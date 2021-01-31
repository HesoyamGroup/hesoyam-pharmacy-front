<template> 
    <div id="sys-admin-profile-page">
        <add-pharmacy></add-pharmacy>
        <register-user></register-user>
        <admin-medicine></admin-medicine>
        <complaint-management> </complaint-management>
        <loyalty-management> </loyalty-management>
    </div>
</template>


<script>
    import AddPharmacy from '@/components/pharmacy/AddPharmacy.vue';
    import RegisterUser from '@/components/users/RegisterUser.vue';
    import AdminMedicine from '@/components/medicine/AdminMedicine.vue';
    import ComplaintManagement from '@/components/feedback/ComplaintManagement.vue';
    import LoyaltyManagement from '@/components/users/LoyaltyManagement.vue';

    export default {
        name: 'sys-admin-profile-page',
        components: {
            AddPharmacy,
            RegisterUser,
            AdminMedicine,
            ComplaintManagement,
            LoyaltyManagement
        }
    }
</script>

<style scoped>
</style>