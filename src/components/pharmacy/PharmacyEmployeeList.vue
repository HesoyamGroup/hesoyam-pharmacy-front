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
                <v-list-item-group color="primary">
                    <template v-if="dermatologists.length > 0">
                        <v-list-item v-for="dermatologist in dermatologists" :key="dermatologist.id" >
                            <v-list-item-content>
                                <v-list-item-title>{{dermatologist.firstName}} {{dermatologist.lastName}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <v-list-item v-else>
                        <v-list-item-content>
                            <v-list-item-title>There are no dermatologists.</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-tab-item>
            <v-tab-item value="tab-2">
                <v-list-item-group color="primary">
                    <template v-if="pharmacists.length > 0">
                        <v-list-item v-for="pharmacist in pharmacists" :key="pharmacist.id">
                            <v-list-item-content>
                                <v-list-item-title>{{pharmacist.firstName}} {{pharmacist.lastName}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <v-list-item v-else>
                        <v-list-item-content>
                            <v-list-item-title>There are no pharmacists.</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';

export default {
    name: 'PharmacyEmployeeList',
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