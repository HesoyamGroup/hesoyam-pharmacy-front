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
                        <v-col align='right' class="mt-5"  cols='3'>
                            <v-btn 
                            color="primary"
                            @click="searchPharmacies">
                                Search
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-if="show">
                        <v-col>
                            <v-card>
                                <v-card-title>
                                    Pharmacies
                                    <v-spacer></v-spacer>
                                    <v-text-field
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                    ></v-text-field>
                                </v-card-title>
                                <v-data-table
                                    :headers='headers'
                                    :items="pharmacies"
                                    :item-key="selectedPharmacy.id"
                                    :search="search"
                                    v-model='selectedPharmacy'
                                    show-select
                                    :single-select='singleSelect'
                                    return-object
                                    >
                                </v-data-table>
                                <v-card-actions class="justify-center">
                                    <v-btn
                                    v-if='selectedPharmacy[0] != undefined'
                                    color="primary"
                                    @click="reserveMedicineDialog">
                                        Reserve
                                    </v-btn>
                                </v-card-actions>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <v-card>
                                        <v-card-title class="headline">Select Pick-up Date</v-card-title>
                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="reserveMedicine">Confirm</v-btn>
                                        <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-card>
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
            //Search Bar
            allMedicine:[],
            selectedMedicine:{},
            pharmacies: [],
            //Pharmacies Table
            show: false,
            search: '',
            selectedPharmacy:[],
            singleSelect: true,
            dialog: false,
            headers: [
            {text:'Name:', value:'name'},
            {text: 'City', value:'address.city.cityName'},
            {text: 'Address', value:'address.addressLine'},
            {text: 'Rating', value:'rating'},
            ],
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
    computed: {
        filteredKeys () {
        return this.keys.filter(key => key !== 'Name')
        },
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
                vm.show = true;
            }, (error) => {

            })

        },
        reserveMedicineDialog: function()
        {
            console.log(this.selectedPharmacy[0].id)
            this.dialog = true;
        },
        closeDialog: function()
        {
            this.dialog = false;
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