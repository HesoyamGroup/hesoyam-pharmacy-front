<template>
    <div class="add-pharmacy">
        <v-container fill-height>
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Add pharmacy </v-toolbar-title>
                        </v-toolbar>


                        <v-card-text>
                            
                            <v-container>
                                <v-row>
                                    <v-col cols="3">
                                        <v-form v-model="pharmacy_form.isFormValid">
                                            <v-row>
                                                <v-text-field label="Name" v-model="pharmacy_form.name" prepend-icon="mdi-medical-bag" :rules="pharmacy_form.rules.nameRules"> </v-text-field>
                                            </v-row>

                                            <v-row>
                                                <v-textarea label="Description" no-resize v-model="pharmacy_form.description" prepend-icon="mdi-text" :rules="pharmacy_form.rules.descriptionRules"> </v-textarea>
                                            </v-row>

                                            <v-row>
                                                <v-subheader v-if="pharmacy_form.formErrorOccured" class="red--text">{{this.pharmacy_form.errorMessage}}</v-subheader>
                                                <v-subheader v-if="pharmacy_form.requestSuccessful" class="green--text">Successfully created pharmacy. </v-subheader>
                                            </v-row>

                                            <v-row>
                                                <v-btn @click="addPharmacy()" :disabled="!pharmacy_form.isFormValid  || !locationFormValid" style="width:100%" fluid color="success">Create pharmacy</v-btn>
                                            </v-row>

                                        </v-form>
                                    </v-col>

                                    <v-col cols="3">
                                        <v-form v-model="locationFormValid">
                                            <v-row>
                                                <v-col>

                                                        <v-select  item-text="countryName" item-value="id" @change="onCountryChanged()" v-model="pharmacy_form.selectedCountry" :items="countries" label="Country" prepend-icon="mdi-map-marker"></v-select>

                                                </v-col>

                                                <v-col>
                                                    <v-select v-model="pharmacy_form.selectedCity" item-text="cityName" item-value="id" :rules="pharmacy_form.rules.cityRules" :disabled="pharmacy_form.forbidCitySelection"  :items="cities"  label="City" prepend-icon="mdi-city"> </v-select>
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col>
                                                    <v-text-field  v-model="pharmacy_form.addressLine" :rules="pharmacy_form.rules.addressLineRules" name="address" label="Address line" type="text" prepend-icon="mdi-home-city"> </v-text-field>
                                                </v-col>

                                                <v-col>
                                                        <v-row>
                                                            <v-col>
                                                                <v-text-field  v-model="pharmacy_form.latitude" :rules="pharmacy_form.rules.latitudeRule" name="latitude" label="Latitude" prepend-icon="mdi-crosshairs-gps" type="number" min="-90" max="90"> </v-text-field>
                                                            </v-col>

                                                            <v-col>
                                                                <v-text-field  v-model="pharmacy_form.longitude" :rules="pharmacy_form.rules.longitudeRule" name="longitude" label="Longitude" prepend-icon="mdi-crosshairs-gps" type="number" min="-180" max="180"> </v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-form v-model="admin_form.isFormValid">
                                            <v-container>
                                                <v-row justify-middle>
                                                    <v-layout justify-center>
                                                        <v-data-table :headers="admin_form.headers" :items="admin_form.admins" :items-per-page="3">
                                                        <template v-slot:item="row">
                                                            <tr>
                                                                <td>{{row.item.firstName}}</td>
                                                                <td>{{row.item.lastName}}</td>
                                                                <td>{{row.item.telephone}}</td>
                                                                <td>{{row.item.email}}</td>
                                                                <td>{{row.item.gender}}</td>
                                                                <td> 
                                                                    <v-btn color="primary" @click="deleteAdmin(row.item)">X</v-btn>
                                                                </td>
                                                            </tr>
                                                        </template>
                                                        </v-data-table>
                                                    </v-layout>
                                                    
                                                </v-row>

                                                <v-row>
                                                    <v-col>
                                                        <v-text-field label="First name" v-model="admin_form.firstName" prepend-icon="mdi-account" type="text" :rules="admin_form.rules.firstNameRules"></v-text-field>
                                                    </v-col>

                                                    <v-col>
                                                        <v-text-field label="Last name" v-model="admin_form.lastName" prepend-icon="mdi-account" type="text" :rules="admin_form.rules.lastNameRules"> </v-text-field>
                                                    </v-col>

                                                    <v-col>
                                                        <v-select :disabled="admin_form.disableUserInteraction" v-model="admin_form.gender" :items="admin_form.genders" label="Gender" prepend-icon="mdi-gender-male-female" :rules="admin_form.rules.genderRules"></v-select>
                                                    </v-col>
                                                </v-row>

                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="admin_form.email" label="Email" type="text" prepend-icon="mdi-email" :rules="admin_form.rules.emailRules"> </v-text-field>
                                                    </v-col>

                                                    <v-col>
                                                        <v-text-field v-model="admin_form.phoneNumber" label="Phone number" type="text" prepend-icon="mdi-cellphone" :rules="admin_form.rules.phoneNumberRules"></v-text-field>
                                                    </v-col>
                                                </v-row>

                                                <v-row justify='end'>
                                                    <v-subheader v-if="!admin_form.formErrorOccured">Initial password will be 00000000</v-subheader>
                                                    <v-subheader v-if="admin_form.formErrorOccured" class="red--text">Administrator emails must be unique.</v-subheader>
                                                    <v-btn :disabled="!admin_form.isFormValid" @click="addAdministrator()" color="primary">Add administrator</v-btn>
                                                </v-row>
                                            </v-container>
                                        </v-form>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>



<script>
    import {client} from '@/client/axiosClient';
    export default{
        name: 'add-pharmacy',
        mounted(){
            client({
                method:'GET',
                url:'countries/getAll'
            }).then( (response) => {
                this.countries = response.data;
            }, (error) => {

            });
        },
        data(){
            return {
                locationFormValid: false,
                countries: [],
                cities: [],
                pharmacy_form: {
                    isFormValid: false,
                    formErrorOccured: false,
                    requestSuccessful: false,
                    errorMessage: '',
                    name: '',
                    description: '',
                    rules: {
                        nameRules: [
                            name => !!name || 'Pharmacy name is required.',
                            name => /^.{2,75}$/.test(name) || 'Pharmacy name should have between 2 and 75 characters'
                        ],
                        descriptionRules: [
                            desc => /^.{0,300}$/.test(desc) || 'Pharmacy description should not exceed 300 characters.'
                        ],
                        addressLineRules: [
                        add => !!add || 'Address line is mandatory',
                        add => /^.{3,150}$/.test(add) || 'Address line should have between 3 and 150 characters'
                        ],
                        latitudeRule: [
                            v => (!isNaN(parseFloat(v)) && v >= -90 && v <= 90) || 'Latitude has to be between -90 and 90'
                        ],
                        longitudeRule: [
                            v => (!isNaN(parseFloat(v)) && v >= -180 && v <= 180) || 'Longitude has to be between -180 and 180'
                        ],
                        countryRules:[
                            country => !!country || "You must select a country."
                        ],
                        cityRules: [
                            city => !!city || "You must select a city."
                        ]
                    },
                    selectedCountry: null,
                    selectedCity: null,
                    forbidCitySelection: true,
                    addressLine: '',
                    latitude: 0,
                    longitude: 0
                },
                admin_form: {
                    isFormValid: false,
                    formErrorOccured: false,
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    gender: null,
                    genders: [
                            'MALE',
                            'FEMALE',
                            'OTHER',
                            'DONT_SAY'
                    ],
                    headers: [
                        {
                            text: 'First name',
                            value: 'firstName',
                        },
                        {
                            text: 'Last name',
                            value: 'lastName',
                        },
                        {
                            text: 'Telephone',
                            value: 'telephone',
                        },
                        {
                            text: 'Email',
                            value: 'email',
                        },
                        { 
                            text: 'Gender', 
                            value: 'gender' 
                        },
                        {
                            text: "X",
                            value: "Remove"
                        }
                    ],
                    admins: [],
                    rules: {
                        emailRules: [
                            em => !!em || 'E-mail is required.',
                            em => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(em) || 'E-mail must be valid',
                        ],
                        firstNameRules: [
                            fn => !!fn || 'First name is required.',
                            fn => /^[a-z A-Z\.-]{3,75}$/.test(fn) || "First name should have between 2 and 75 characters."
                        ],
                        lastNameRules: [
                            fn => !!fn || 'Last name is required.',
                            fn => /^[a-z A-Z\.-]{3,100}$/.test(fn) || "Last name should have between 3 and 100 characters."
                        ],
                        phoneNumberRules: [
                            num => !!num || 'Phone number is mandatory.',
                            value => (/^\d{10}$/.test(value) || /^(\d{3}[- .]?){2}\d{4}$/.test(value) 
                            || /^((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value)
                            || /^(\+\d{1,3}( )?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value)) || 'Phone number format is not valid.'
                        ],
                        addressLineRules: [
                            add => !!add || 'Address line is mandatory',
                            add => /^.{3,150}$/.test(add) || 'Address line should have between 3 and 15 characters'
                        ],
                        latitudeRule: [
                            v => (!isNaN(parseFloat(v)) && v >= -90 && v <= 90) || 'Latitude has to be between -90 and 90'
                        ],
                        longitudeRule: [
                            v => (!isNaN(parseFloat(v)) && v >= -180 && v <= 180) || 'Longitude has to be between -180 and 180'
                        ],
                        genderRules: [
                            gender => this.admin_form.genders.includes(gender) || 'You must choose a gender'
                        ]
                    },
                },
                
            }
        },
        // firstName, lastName, telephone, email, gender, address,
        methods: {
            onCountryChanged: function(){
                if(this.pharmacy_form.selectedCountry != null){
                    this.pharmacy_form.forbidCitySelection = false;
                }
                this.pharmacy_form.selectedCity = null;
                this.refreshCities();
                
            },
            refreshCities: function(){
                client({
                    method: 'GET',
                    url: `cities/within-country/${this.pharmacy_form.selectedCountry}`
                }).then( (response) => {
                    this.cities = response.data;
                });
            },
            addAdministrator: function(){
                this.admin_form.formErrorOccured = false; //reset.

                if(this.isEmailAlreadyAdded(this.admin_form.email)){
                    this.admin_form.formErrorOccured = true;
                    return;
                }
                

                this.admin_form.admins.push({
                    firstName: this.admin_form.firstName,
                    lastName: this.admin_form.lastName,
                    telephone: this.admin_form.phoneNumber,
                    email: this.admin_form.email,
                    gender: this.admin_form.gender,
                    password: '00000000',
                    address: this.getAddress()
                });

                this.resetAdminForm();
            },
            isEmailAlreadyAdded: function(email){
                for(var admin of this.admin_form.admins){
                    if(email === admin.email) return true;
                }

                return false;
            },
            resetAdminForm: function(){

                this.admin_form.isFormValid= false;
                this.admin_form.formErrorOccured= false;
                this.admin_form.firstName= '';
                this.admin_form.lastName= '';
                this.admin_form.email= '';
                this.admin_form.phoneNumber= '';
                this.admin_form.gender= null;
            },
            getAddress(){
                return {
                    addressLine: this.pharmacy_form.addressLine,
                    latitude: this.pharmacy_form.latitude,
                    longitude: this.pharmacy_form.longitude,
                    city: {
                        id: this.pharmacy_form.selectedCity
                    }
                }
            },
            addPharmacy: function(){
                this.pharmacy_form.errorMessage = "";
                this.pharmacy_form.formErrorOccured = false;
                this.pharmacy_form.requestSuccessful = false;
                

                if(!this.isAddPharmacyRequestValid()){
                    this.pharmacy_form.errorMessage = "Make sure you've added at least one administrator";
                    this.pharmacy_form.formErrorOccured = true;
                    return;
                }

                client({
                    method: 'post',
                    url: 'pharmacy/create',
                    data: {
                        name: this.pharmacy_form.name,
                        description: this.pharmacy_form.description,
                        address: this.getAddress(),
                        administrators: this.admin_form.admins
                    }
                }).then( (response) => {
                    this.pharmacy_form.requestSuccessful = true;
                    this.resetWholeForm();
                    this.admin_form.admins=[];
                }, (error) => {
                    this.pharmacy_form.formErrorOccured = true;
                    let errorStatus = error.response.status;
                    if(errorStatus == '400'){
                        this.pharmacy_form.errorMessage = 'Invalid request.';
                    }else if(errorStatus == '409'){
                        this.pharmacy_form.errorMessage = 'Administrator emails are not unique.';
                    }
                });
 
            },
            resetWholeForm: function(){
                this.resetAdminForm();
                this.resetPharmacyForm();
                this.resetLocationForm();
            },
            resetLocationForm(){
                this.pharmacy_form.selectedCountry = null;
                this.pharmacy_form.selectedCity = null;
                this.pharmacy_form.forbidCitySelection = true;
                this.pharmacy_form.addressLine='';
                this.pharmacy_form.latitude = 0;
                this.pharmacy_form.longitude = 0;
            },
            resetPharmacyForm: function(){
                this.pharmacy_form.isFormValid= false;
                this.pharmacy_form.formErrorOccured= false;
                this.pharmacy_form.errorMessage= '';
                this.pharmacy_form.name= '';
                this.pharmacy_form.description ='';
            },
            isAddPharmacyRequestValid: function(){
                if(this.admin_form.admins.length > 0){
                    return true;
                }
                return false;
            },
            deleteAdmin: function(item){
                let newAdmins = [];
                for(const admin of this.admin_form.admins){
                    if(admin.email != item.email){
                        newAdmins.push(admin);
                    }
                }
                this.admin_form.admins = newAdmins;
            }
        }
    }

</script>


<style scoped>

</style>