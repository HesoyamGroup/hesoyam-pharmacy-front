<template>

    <div class="ma-2">
        <v-row>
            <v-col>
                <pharmacy-info v-model="pharmacy" />
                <pharmacy-employee-tabs></pharmacy-employee-tabs>
            </v-col>
            <v-col>
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


export default {
    name: 'PharmacyPage',
    components: {
        PharmacyInfo,
        PharmacyMedicineList,
        PharmacyEmployeeTabs,
    },
    data: function(){
        return {
            pharmacy: null,
            userRole: 'ROLE_PATIENT'
        }
    },
    mounted(){
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
}
</script>

<style scoped>
</style>