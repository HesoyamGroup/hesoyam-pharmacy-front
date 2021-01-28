<template>

    <div class="ma-2">
        <v-row>
            <v-col>
                <pharmacy-info v-model="pharmacy" />
            </v-col>
            <v-col>
                <pharmacy-medicine-list v-model="pharmacy"/>
            </v-col>
            <v-col>
                <pharmacy-employee-list></pharmacy-employee-list>
            </v-col>
        </v-row>
    </div>
</template>


<script>
import PharmacyInfo from '@/components/pharmacy/PharmacyInfo.vue';
import PharmacyMedicineList from '@/components/pharmacy/PharmacyMedicineList.vue';
import PharmacyEmployeeList from '@/components/pharmacy/PharmacyEmployeeList.vue';
import {client} from '@/client/axiosClient';


export default {
    name: 'PharmacyPage',
    components: {
        PharmacyInfo,
        PharmacyMedicineList,
        PharmacyEmployeeList,
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