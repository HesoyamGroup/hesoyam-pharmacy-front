<template>

    <div class="ma-2">
        <v-row>
            <v-col>
                <pharmacy-info v-model="pharmacy" />
                <pharmacy-appointments :pharmacyId="pharmacy.id"></pharmacy-appointments>
                <pharmacy-employee-tabs></pharmacy-employee-tabs>
            </v-col>
            <v-col>
                <pharmacy-inventory v-if="isAdministrator" v-model="pharmacy"></pharmacy-inventory>
            </v-col>
        </v-row>
    </div>
</template>


<script>
import {client} from '@/client/axiosClient';
import PharmacyInfo from '@/components/pharmacy/PharmacyInfo.vue';
import PharmacyEmployeeTabs from '../components/pharmacy/PharmacyEmployeeTabs.vue';
import PharmacyInventory from '../components/pharmacy/PharmacyInventory.vue';
import PharmacyAppointments from '../components/pharmacy/PharmacyAppointments.vue';

import * as UserService from '@/service/UserService';


export default {
    name: 'PharmacyPage',
    components: {
        PharmacyInfo,
        PharmacyEmployeeTabs,
        PharmacyInventory,
        PharmacyAppointments
    },
    data: function(){
        return {
            pharmacy: null,
            userRole: ''
        }
    },
    mounted(){
        this.$on('price-updated', this.fetchPharmacy);
        this.userRole = UserService._getUserRole();
        this.fetchPharmacy();
    },
    methods:{
        fetchPharmacy(){
            let id = this.$route.params.id;
            client({
                method: 'GET',
                url: 'pharmacy/' + id
            }).then((response) => {
                this.pharmacy = response.data;
            }, (error) => {
                this.$router.push('/');
            });
        }
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