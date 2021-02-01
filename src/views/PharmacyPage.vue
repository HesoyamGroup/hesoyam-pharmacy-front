<template>

    <div class="ma-2">
        <v-row>
            <v-col>
                <pharmacy-info v-model="pharmacy" />
                <pharmacy-employee-tabs></pharmacy-employee-tabs>
            </v-col>
            <v-col>
                <pharmacy-inventory v-if="isAdministrator" v-model="pharmacy"></pharmacy-inventory>
                <pharmacy-medicine-list v-model="pharmacy"/>
            </v-col>
        </v-row>
    </div>
</template>


<script>
import {client} from '@/client/axiosClient';
import PharmacyInfo from '@/components/pharmacy/PharmacyInfo.vue';
import PharmacyMedicineList from '@/components/pharmacy/PharmacyMedicineList.vue';
import PharmacyEmployeeTabs from '../components/pharmacy/PharmacyEmployeeTabs.vue';
import PharmacyInventory from '../components/pharmacy/PharmacyInventory.vue';


export default {
    name: 'PharmacyPage',
    components: {
        PharmacyInfo,
        PharmacyMedicineList,
        PharmacyEmployeeTabs,
        PharmacyInventory,
    },
    data: function(){
        return {
            pharmacy: null,
            userRole: 'ADMINISTRATOR'
        }
    },
    mounted(){
        this.$on('price-updated', this.fetchPharmacy);
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