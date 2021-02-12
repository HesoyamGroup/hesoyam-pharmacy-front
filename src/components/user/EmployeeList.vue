<template>
    <div>
        <v-card flat class="ma-5">
            <v-card-title>
                <div>{{tableTitle}}</div>
                <v-spacer></v-spacer>
                <v-btn v-if="userRole == 'ADMINISTRATOR' && type == 'pharmacist'" to="/pharmacist-new" color="green" dark>New</v-btn>
                <v-btn v-if="userRole == 'ADMINISTRATOR' && type == 'dermatologist'" to="/dermatologists/management" color="green" dark>Management</v-btn>
            </v-card-title>

            <v-card-title>
                <v-text-field class="mt-5 mr-3" label="First Name" v-model="firstName"></v-text-field>
                <v-text-field class="mt-5 mr-3" label="Last Name" v-model="lastName"></v-text-field>
                <v-btn @click="search">Search</v-btn>
            </v-card-title>
     
            <v-data-table
            :headers="employeeHeaders"
            :items="filteredEmployees"
            item-key="id"
            :show-expand="expandTable"
            :expanded.sync="expanded"
            class="elevation-1 ma-5">

            <template v-slot:top>
            <v-toolbar flat>
                <v-text-field
                        v-model="filterRating"
                        append-icon="mdi-magnify"
                        label="Filter by rating"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="filterPharmacy"
                        append-icon="mdi-magnify"
                        label="Filter by pharmacy"
                        single-line
                        hide-details
                    ></v-text-field>
            </v-toolbar>
            </template>

            <template v-slot:item.profile="{item}">
                <v-btn plain :to="'/' + type + '/' + item.id"><v-icon>mdi-account</v-icon></v-btn>
            </template>

            <template v-slot:item.rating="{ item }">
                <v-chip
                    :color="getColor(item.rating)"
                    dark
                >
                    {{ item.rating }}
                </v-chip>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-list-item-group color="primary">
                        <v-list-item v-for="pharmacy in item.pharmacies" :key="pharmacy.id">
                            <v-list-item-content>
                                <v-row>
                                    <v-col>
                                        <v-list-item-title>{{pharmacy.name}}</v-list-item-title>
                                    </v-col>
                                    <v-col>
                                        <v-btn :to="'/pharmacy/' + pharmacy.id"><v-icon>mdi-home-variant-outline</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </td>
            </template>

            <template v-slot:item.remove="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        @click="removeDermatologist(item)"
                        color="red"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        >
                        Remove
                        </v-btn>
                    </template>
                    <span>Remove from my pharmacy</span>
                </v-tooltip>
            </template>
            
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';
import * as UserService from '@/service/UserService';

export default {
    //Props:
    //      type - must be either pharmacist or dermatologist
    name: 'EmployeeList',
    props: {
        type:{
            type: String,
            required: true
        }
    },
    data: function(){
        return {
            firstName: '',
            lastName: '',
            employees: [],
            expanded: [],
            filterRating: '',
            filterPharmacy: '',
            pharmacyHeaders: [
                {
                    text: 'Pharmacy',
                    value: 'name'
                },
                {
                    text: 'Rating',
                    value: 'rating'
                }
            ],
            userRole: ''
        }
    },
    mounted(){
        this.fetchEmployees();
        let user = UserService.getLoggedUserData();
        this.userRole = user.userRole;
    },
    methods:{
        fetchEmployees(){
            client({
                method: 'GET',
                url: this.type
            }).then((response) => {
                //console.log(response.data);
                this.employees = response.data;
            }, (error) => {

            });
        },
        search(){
            client({
                method: 'GET',
                url: this.type + '/search',
                params: {
                    firstName: this.firstName,
                    lastName: this.lastName
                }
            }).then((response) =>{
                this.employees = response.data;
            }, (error) => {});
        },
        getColor (calories) {
            if (calories >= 4) return 'green'
            else if (calories >= 2) return 'orange'
            else return 'red'
        },
        isPharmacyNameSatisfied(employee, pharmacyName){
            let result = false;
            if(this.type == 'pharmacist')
                result = employee.pharmacy.name.toLowerCase().indexOf(pharmacyName.toLowerCase()) !== -1;
            else
                employee.pharmacies.forEach(ph => ph.name.toLowerCase().indexOf(pharmacyName.toLowerCase()) !== -1 ? result = true : {});
            
            return result;
        },
        removeDermatologist(dermatologist){
            client({
                method: 'DELETE',
                url: '/dermatologist/' + dermatologist.id
            }).then((response) => {
                let index = this.employees.findIndex(derm => derm.id == dermatologist.id);
                if(index != -1)
                    this.employees.splice(index, 1);
            }, (error) => {
                switch(error.response.status){
                    case 404: alert('Selected dermatologist cannot be found.'); break;
                    case 409: alert('Dermatologist has scheduled appointments'); break;
                    case 400: alert('Dermatologist is already removed from pharmacy'); break;
                }
            });
        }
    },
    computed: {
        filteredEmployees(){
            return this.employees.filter(e => e.rating.toString().indexOf(this.filterRating.toLowerCase()) !== -1 && this.isPharmacyNameSatisfied(e, this.filterPharmacy));
        },
        expandTable(){
            return this.type == 'dermatologist';
        },
        tableTitle(){
            return this.type == 'pharmacist' ? 'Pharmacists' : 'Dermatologists'
        },
        employeeHeaders(){
            if(this.type == 'pharmacist'){
                return [
                    {text: '', value: 'profile', sortable: false},
                    {
                        text: 'First Name',
                        align: 'start',
                        value: 'firstName',
                    },
                    { text: 'Last Name', value: 'lastName' },
                    { text: 'Rating', value: 'rating' },
                    { text: 'Pharmacy', value: 'pharmacy.name'}
                ]
            }
            else if(this.type == 'dermatologist'){
                let dermatologistHeaders = [
                    {text: '', value: 'profile', sortable: false},
                    {
                        text: 'First Name',
                        align: 'start',
                        value: 'firstName',
                    },
                    { text: 'Last Name', value: 'lastName' },
                    { text: 'Rating', value: 'rating' },
                    { text: 'Pharmacies', value: 'data-table-expand' }
                ];
                if(this.userRole == 'ADMINISTRATOR')
                    dermatologistHeaders.push({text: 'Remove', value: 'remove', sortable: false})
                return dermatologistHeaders;
            }
        }
    }
}
</script>