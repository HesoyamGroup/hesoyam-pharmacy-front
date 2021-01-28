<template>
<div class='medicine-search-component'>
    <v-container fluid fill-height class='spacing-playground pa-6 justify-center'>
            <v-card class='elevation-12 ma-4 flex-grow-1' shaped max-width="50%">
                    <v-row>
                        <v-col class='mt-3 ml-3' cols='8'>
                            <v-select
                            outlined
                            :items='allMedicine'
                            v-model='selectedMedicine'
                            item-text='name'
                            item-value="id"
                            label='Select Medicine:'
                            return-object
                            >

                            </v-select>
                        </v-col>
                        <v-col justify='center' align='right' class="mt-3"  cols='3'>
                            <v-btn 
                            color="primary"
                            @click="searchPharmacies">
                                Search
                            </v-btn>
                        </v-col>
                    </v-row>
            </v-card>
    </v-container>
</div>
</template>

<script>

import {client} from '@/client/axiosClient';

export default {
    name: 'MedicineSearch',
    data(){
        return {
            allMedicine:[],
            selectedMedicine:{},
            pharmacies: []
        }
    },
    mounted(){
        const vm = this;

        client({
            method: 'GET',
            url: 'medicine/all'
        })
        .then((response) => {
            vm.allMedicine = response.data;
        }, (error) => {

        })
    },
    methods:{
        searchPharmacies: function()
        {
            const vm = this;
            const url = 'pharmacy/medicine-' + this.selectedMedicine.id;
            client({
                method: 'GET',
                url: url
            })
            .then((response) => {
                vm.pharmacies = response.data;
            }, (error) => {

            })

        }
    }

}
</script>

<style scoped>
    .medicine-search-component{
        height: auto;
        display:flex;
        align-items: center;
    }
</style>