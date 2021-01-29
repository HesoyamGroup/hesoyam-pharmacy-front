<template>
    <v-data-table
    :headers="employeeHeaders"
    :items="employees"
    item-key="name"
    :show-expand="expandTable"
    class="elevation-1 ma-5">

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{tableTitle}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field class="mt-5 mr-1" label="First Name" v-model="firstName"></v-text-field>
        <v-text-field class="mt-5 mr-1" label="Last Name" v-model="lastName"></v-text-field>
        <v-btn @click="search">Search</v-btn>
      </v-toolbar>
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

    </v-data-table>
</template>

<script>
import {client} from '@/client/axiosClient';

export default {
    //Props:
    //      type - must be either pharmacist or dermatologist
    name: 'EmployeeList',
    props: ['type'],
    data: function(){
        return {
            firstName: '',
            lastName: '',
            employees: [],
            pharmacyHeaders: [
                {
                    text: 'Pharmacy',
                    value: 'name'
                },
                {
                    text: 'Rating',
                    value: 'rating'
                }
            ]
        }
    },
    mounted(){
        this.fetchEmployees();
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
            }, (error) => {

            })
        }
    },
    computed: {
        expandTable(){
            return this.type == 'dermatologist';
        },
        tableTitle(){
            return this.type == 'pharmacist' ? 'Pharmacists' : 'Dermatologists'
        },
        employeeHeaders(){
            if(this.type == 'pharmacist'){
                return [
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
            else{
                return [
                    {
                        text: 'First Name',
                        align: 'start',
                        value: 'firstName',
                    },
                    { text: 'Last Name', value: 'lastName' },
                    { text: 'Rating', value: 'rating' },
                    { text: 'Pharmacies', value: 'data-table-expand' }
                ]
            }
        }
    }
}
</script>