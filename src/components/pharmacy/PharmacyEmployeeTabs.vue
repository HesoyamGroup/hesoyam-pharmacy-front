<template>
    <div>
        <v-tabs
          v-model="activeTab"
          centered
          background-color="primary"
        >
          <v-tab href="#tab-1">Dermatologists</v-tab>
          <v-tab href="#tab-2">Pharmacists</v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
            <v-tab-item value="tab-1">
                <pharmacy-employee-list type="dermatologist" :employees="dermatologists"></pharmacy-employee-list>
            </v-tab-item>
            <v-tab-item value="tab-2">
                <pharmacy-employee-list type="pharmacist" :employees="pharmacists"></pharmacy-employee-list>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';
import PharmacyEmployeeList from './PharmacyEmployeeList.vue';

export default {
    name: 'PharmacyEmployeeTabs',
    components:{
        PharmacyEmployeeList
    },
    data: function(){
        return {
            activeTab: "tab-1",
            dermatologists: [],
            pharmacists: []
        }
    },
    methods:{
        
    },
    mounted(){
        let pharmacyId = this.$route.params.id;

        client({
            method: 'GET',
            url: 'dermatologist/pharmacy/' + pharmacyId
        }).then((response) => {
            this.dermatologists = response.data;
        }, (error) => {
        });

        client({
            method: 'GET',
            url: 'pharmacist/pharmacy/' + pharmacyId
        }).then((response) => {
            this.pharmacists = response.data;
        }, (error) => {
        });

    }
}
</script>