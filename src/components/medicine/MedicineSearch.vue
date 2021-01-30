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
                                    v-if='selectedPharmacy[0] != undefined && userLoggedIn'
                                    color="primary"
                                    @click="reserveMedicineDialog">
                                        Reserve
                                    </v-btn>
                                    <v-btn
                                    color="primary"
                                    v-if='!userLoggedIn'
                                    @click='redirectToLogin'>
                                    Log in to reserve
                                    </v-btn>
                                </v-card-actions>
                                
                            </v-card>
                        </v-col>
                    </v-row>
            </v-card>
            <v-dialog v-model="dialog" width="350px">
                                    <v-card>
                                        <v-card-title class="headline justify-center">Select Pick-Up Date</v-card-title>
                                        
                                        <v-card-actions class='justify-center'>
                                            <v-date-picker
                                            v-model='selectedDate'
                                            elevation="12"
                                            color='primary'
                                            :min='currentDate'
                                            :max='maxDate'>
                                            </v-date-picker>
                                        </v-card-actions>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                                            <v-btn color="blue darken-1" text @click='reserveMedicine' >Confirm</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
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
            //DatePicker
            currentDate: null,
            maxDate: null,
            selectedDate: null,
            showAlert: false,
            //Loggedin User
            userLoggedIn: false

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

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        this.currentDate = yyyy+"-"+mm+"-"+dd;
        this.maxDate = yyyy+1+"-"+mm+"-"+dd;

        this.userLoggedIn = this.isLoggedin();
        console.log(this.userLoggedIn)
    },
    computed: {
        filteredKeys () {
        return this.keys.filter(key => key !== 'Name')
        },
    },
    methods:{
        isLoggedin: function(){
            let token = localStorage.getItem('user_token');
            if(token == null)
                return false;
            return true;
        },
        redirectToLogin: function()
        {
            window.location.replace("../login");
        },
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
                this.selectedPharmacy=[];
                vm.show = true;
            }, (error) => {

            })

        },
        reserveMedicineDialog: function()
        {
            this.dialog = true;
        },
        closeDialog: function()
        {
            this.dialog = false;
        },
        reserveMedicine: function()
        {
            client({
                method: 'POST',
                url: 'medicine-reservation/create',
                data:{
                    pickUpDate: this.selectedDate+" 23:59:59",
                    medicineReservationItemList: [{quantity: 1, medicine:{id: this.selectedMedicine.id}}]
                }
            })
            .then((response)=>{
                console.log('uspesno dodat')
                this.showAlert=true;
            }, (error) => {

            })

            this.resetPage();
            
        },
        resetPage()
        {
            this.dialog = false;
            this.show = false;
            this.selectedPharmacy=[]
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