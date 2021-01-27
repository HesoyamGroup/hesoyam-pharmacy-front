<template>
<div class="profile-component">
    <v-container fluid fill-height class="spacing-playground pa-6">
                <v-row>
                    <v-col cols="4" class="d-flex">
                        <v-card v-if="overlay" class='elevation-12 ma-4 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Address</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field
                                        label='City:'
                                        outlined
                                        v-model = address.city.cityName
                                        readonly>
                                </v-text-field>
                                <v-text-field
                                        label='Address:'
                                        outlined
                                        v-model = address.addressLine
                                        readonly>
                                </v-text-field>
                                <div class="text-center">
                                    <v-btn rounded color="primary" dark @click="overlay = !overlay">
                                        Change Address
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-card v-if="!overlay" class='elevation-12 ma-4 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Change Address</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-select
                                    v-model="selectedCountry"
                                    v-on:change="getCities"
                                    :items="countries"
                                    item-text="countryName"
                                    item-value="id"
                                    label="Country:"
                                    outlined
                                    return-object>
                                </v-select>
                                <v-select
                                    v-model="selectedCity"
                                    :items="citiesInCountry"
                                    item-text="cityName"
                                    item-value="id"
                                    label="City:"
                                    outlined
                                    return-object>
                                </v-select>
                                <v-text-field
                                    v-model="addressLine"
                                    label="Address Line:"
                                    outlined>
                                </v-text-field>
                                <div class="text-center">
                                    <v-btn rounded color="primary" dark @click="saveAddress">
                                        Cancel
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4" class="d-flex">
                        <v-card class='elevation-12 ma-4 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Password</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field
                                        label="e-Mail:"
                                        readonly
                                        outlined>
                                </v-text-field>
                                <v-text-field
                                        label="e-Mail:"
                                        readonly
                                        outlined
                                        >
                                    </v-text-field>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col class="d-flex">
                        <v-card class='elevation-12 ma-4 flex-grow-1' shaped > 
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Loyalty Program - Drug dealer</v-toolbar-title>
                            </v-toolbar>
                                <v-container >
                                    <v-row
                                        class="fill-height"
                                        align-content="center"
                                        justify="center"
                                    >
                                        <v-col class="subtitle-1 text-center" cols="12">
                                        You are 150 points away from getting to next level
                                        </v-col>
                                        <v-col cols="5">
                                        <v-progress-circular
                                            :rotate="90"
                                            :size="150"
                                            :width="30"
                                            :value="value"
                                            color="red"
                                            >    
                                        </v-progress-circular>
                                        </v-col>
                                    </v-row>
                                </v-container>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" class="d-flex">
                        <v-card class='elevation-12 ma-4 mb-1 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Profile Information</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                    <v-text-field
                                        label='First Name:'
                                        outlined
                                        v-model = userDTO.firstName>
                                    </v-text-field>
                                    <v-text-field
                                        label="Last Name:"
                                        outlined
                                        v-model = userDTO.lastName>
                                    </v-text-field>
                                    <v-text-field
                                        label="Gender:"
                                        readonly
                                        v-model = userDTO.gender
                                        outlined>
                                    </v-text-field>
                                    <v-text-field
                                        label="e-Mail:"
                                        readonly
                                        outlined
                                        v-model = userDTO.email>
                                    </v-text-field>
                                    <v-text-field
                                        label="Phone Number:"
                                        outlined
                                        v-model = userDTO.telephone>                               >
                                    </v-text-field>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="4" class="d-flex">
                        <v-card class="elevation-12 ma-4 mb-1 flex-grow-1" shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Allergies</v-toolbar-title>
                            </v-toolbar>
                        
                            <v-data-table
                            :headers="headers"
                            :items="desserts"
                            :items-per-page="5"
                            ></v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
    </v-container>
    
</div>
</template>>


<script>

import {client} from '@/client/axiosClient';

export default {
        name: 'Profile',
        data(){
            return {
                userDTO:{
                    firstName: '',
                    lastName: '',
                    gender: '',
                    email: '',
                    telephone: ''
                },
                headers: [
                {
                    text: 'Dessert (100g serving)',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Calories', value: 'calories' },
                { text: 'Fat (g)', value: 'fat' },
                { text: 'Carbs (g)', value: 'carbs' },
                { text: 'Protein (g)', value: 'protein' },
                { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                
                ],
                value:69,
                address:{
                },
                selectedCountry:{},
                selectedCity:{},
                addressLine:'',
                countries:[],
                citiesInCountry:[],
                absolute: true,
                opacity: 0.5,
                overlay: true,
            }
        },
        mounted(){
            const vm = this;
            client({
                    method: 'GET',
                    url: 'profile/user-information'
                })
                .then( (response) => {
                    vm.userDTO = response.data;
                    console.log(vm.userDTO.firstName)
                }, (error) => {

                })
            
            client({
                method:'GET',
                url: 'profile/user-address'
            })
            .then( (response) => {
                vm.address = response.data;
            }, (error)=>{

            })

            client({
                method:'GET',
                url: 'countries/getAll'
            })
            .then( (response) => {
                vm.countries = response.data
            }, (error) => {

            })
        },
        methods:{
            getCities: function(){
                const vm = this;
                var selectedCityId = this.selectedCountry.id;
            
                client({
                    method: 'GET',
                    url: 'cities/within-country/'+selectedCityId
                })
                .then((response) =>{
                    vm.citiesInCountry = response.data
                }, (error)=>{

                })
            },
            saveAddress: function(){
                client({
                    method: 'post',
                    url: 'profile/change-address',
                    data:{
                        city: this.selectedCity,
                        addressLine: this.addressLine
                    }
                })
                .then((response) => {
                    console.log('ok');
                    this.address.city = this.selectedCity;
                    this.address.addressLine = this.addressLine;
                    this.overlay = !this.overlay;
                }, (error) => {

                })

            }
        }
        

    }


</script>

<style scoped>
    .profile-component{
        height: 500px;
        display:flex;
        align-items: center;
    }
    .v-progress-circular {
        margin: 1rem;
    }
</style>