<template>
<div class='all-pharmacies'>
    <v-container fluid fill-height class='spacing-playground pa-6 justify-center'>
        <v-card class='elevation-12 ma-4 flex-grow-1' max-width="60%" shaped >
            <v-toolbar 
                dark
                color='primary'
                shaped>
                    <v-toolbar-title>Pharmacies</v-toolbar-title>
                    <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-actions class='justify-right ma-2' width='30%'>
                <v-text-field
                    v-model="searchPharmacy"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    outlined
                    clearable
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
            </v-card-actions>
            <v-data-table
            :items='allPharmacies'
            :single-expand='singleExpand'
            :expanded.sync='expanded'
            :headers='pharmacyHeaders'
            :search="searchPharmacy"
            item-key='id'
            show-expand
            class='elevation-12'>

            <template v-slot:expanded-item="{headers, item}">
                    <td :colspan="headers.length">
                        <div class="row sp-details">
                            <div class="col-4 text-left ma-6">
                                <v-row>
                                    <h1>{{item.name}}</h1>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    color="primary"
                                    rounded
                                    @click="goToProfile(item.id)"
                                    >
                                        Profile
                                    </v-btn>
                                </v-row>
                                <v-row>
                                    <div>{{item.cityName}}, {{item.addressLine}}</div>
                                </v-row>
                                <v-row>
                                    <h3> Rating: {{item.rating}}/5.00 </h3>
                                </v-row>
                                <v-row>
                                    <v-divider
                                    ></v-divider>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <h3>Description:</h3>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <v-divider
                                    ></v-divider>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <div>{{item.description}}</div>
                                </v-row>
                                <v-row>
                                    
                                </v-row>
                            </div>
                            <div class="col-7 text-right">
                                <v-row>
                                    <v-card id="leafletmap" class='justify-right flex-grow-1 ma-4'>
                                        <leaflet-map 
                                        id='bilostas' 
                                        mode="display" 
                                        height="250"
                                        width="250"
                                        v-model='item.pharmacyLocationDTO'
                                        >
                                        </leaflet-map>
                                    </v-card>
                                </v-row>
                            </div>
                        </div>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</div>
</template>

<script>

import {client} from '@/client/axiosClient';
import LeafletMap from '../location/LeafletMap.vue';

export default {
    components: {LeafletMap},
    name: '',
    data(){
        return {
            allPharmacies: [],
            searchPharmacy: '',
            singleExpand: true,
            ratingFilter: '',
            expanded: [],
            pharmacyHeaders:[
                {text:'Name', value:'name'},
                {text:'Rating', value:'rating'},
                {text:'City', value:'cityName'},
            ],

        }
    },
    mounted(){
        const vm = this;
        client({
            method: 'GET',
            url: 'pharmacy/all'
        })
        .then((response) => {
            vm.allPharmacies = response.data;
        }, (error) => {

        })
    },
    computed:{
        pharmacyHeaders(){
            return[
                {text:'Name', value:'name'},
                {text:'Rating', value:'rating'},
                {text:'City', value:'cityName'},
            ]
        }
    },
    methods:{
        goToProfile(id)
        {
            var url = '../pharmacy/'+id;
            window.location.href = url;
        },
    },
}
</script>

<style scoped>
    .all-pharmacies{
        height: auto;
        display:flex;
        align-items: center;
    }
</style>