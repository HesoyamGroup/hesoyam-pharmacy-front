<template>
    <div class="registration-component">

    <v-container>
        <v-layout align-center justify-center>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Registration form</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-form v-model="form.isFormValid">
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="form.firstName" :rules="form.rules.firstNameRules" name="firstName" label="First name" type="text" prepend-icon="mdi-account">
                                    </v-text-field>
                                </v-col>

                                <v-col>
                                    <v-text-field v-model="form.lastName" :rules="form.rules.lastNameRules" name="lastName" label="Last name" type="text" prepend-icon="mdi-account">
                                    </v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-select v-model="form.gender" :rules="form.rules.genderRules" :items="form.genders" label="Gender" prepend-icon="mdi-gender-male-female"></v-select>
                                </v-col>

                                <v-col>

                                </v-col>
                            </v-row>


                            <v-row>
                                <v-col>
                                    <v-text-field v-model="form.email" :rules="form.rules.emailRules" name="email" label="Email address" type="text" prepend-icon="mdi-email"> </v-text-field>
                                </v-col>

                                <v-col>
                                    <v-text-field v-model="form.phone" :rules="form.rules.phoneNumberRules" name="phone" label="Phone number" type="text" prepend-icon="mdi-cellphone"> </v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                     <v-text-field v-model="form.password" :rules="form.rules.passwordRules" name="password" label="Password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                </v-col>

                                <v-col>
                                     <v-text-field v-model="form.confirmPassword" :rules="form.rules.confirmPasswordRules" name="confirmPassword" label="Confirm password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                </v-col>
                            </v-row>


                            <v-row>
                                <v-col>
                                    <v-select item-text="countryName" item-value="id" @change="onCountryChanged()" v-model="form.selectedCountry" :items="form.countries" label="Country" prepend-icon="mdi-map-marker"></v-select>
                                </v-col>

                                <v-col>
                                    <v-select v-model="form.selectedCity" item-text="cityName" item-value="id" :disabled="form.forbidCitySelection"  :items="form.cities"  label="City" prepend-icon="mdi-city"> </v-select>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field v-model="form.addressLine" name="address" label="Address line" type="text" prepend-icon="mdi-home-city"> </v-text-field>
                                </v-col>

                                <v-col>
                                        <v-row>
                                            <v-col>
                                                <v-text-field v-model="form.latitude" :rules="form.rules.latitudeRule" name="latitude" label="Latitude" prepend-icon="mdi-crosshairs-gps" type="number" min="-90" max="90"> </v-text-field>
                                            </v-col>

                                            <v-col>
                                                 <v-text-field v-model="form.longitude" :rules="form.rules.longitudeRule" name="longitude" label="Longitude" prepend-icon="mdi-crosshairs-gps" type="number" min="-180" max="180"> </v-text-field>
                                            </v-col>
                                        </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer> </v-spacer>

                    <v-btn color="gray" @click="resetForm()">Reset</v-btn>
                    <v-btn :disabled="!form.isFormValid" color="primary" @click="sendRegistrationRequest()">Register </v-btn>
                </v-card-actions>
            </v-card>
        </v-layout>
    </v-container>
        
    </div>

</template>


<script>

import {client} from '@/client/axiosClient';

export default {
    name: 'Register',
    mounted(){
        //Retrieve countries
        client({
            method:'GET',
            url:'countries/getAll'
        }).then( (response) => {
            this.form.countries = response.data;
        }, (error) => {

        })
    },
    data: function(){
        return {
            form: {
                genders: [
                        'MALE',
                        'FEMALE',
                        'OTHER',
                        'DONT_SAY'
                ],
                gender: null,
                countries: [],
                cities: [],
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                selectedCountry: null,
                selectedCity: null,
                addressLine: '',
                latitude: '0',
                longitude: '0',
                forbidCitySelection: true,
                isFormValid: false,
                rules: {
                    emailRules: [
                        em => !!em || 'E-mail is required.',
                        em => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(em) || 'E-mail must be valid',
                    ],
                    passwordRules: [
                        pw => !!pw || 'Password is required.',
                        pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                    ],
                    confirmPasswordRules: [
                        pw => this.form.password === pw || "Passwords must match",
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
                        add => /^.{3,150}$/ || 'Address line should have between 3 and 15 characters'
                    ],
                    latitudeRule: [
                        v => (!isNaN(parseFloat(v)) && v >= -90 && v <= 90) || 'Latitude has to be between -90 and 90'
                    ],
                    longitudeRule: [
                        v => (!isNaN(parseFloat(v)) && v >= -180 && v <= 180) || 'Longitude has to be between -180 and 180'
                    ],
                    genderRules: [
                        gender => this.form.genders.includes(gender) || 'You must choose a gender'
                    ]
                }
            },
            
        }
    },
    methods:{
        resetForm: function(){
                this.form.gender = null;
                this.form.firstName = '';
                this.form.lastName = '';
                this.form.email = '';
                this.form.phone = '';
                this.form.password = '';
                this.form.confirmPassword = '';
                this.form.selectedCountry = null;
                this.form.selectedCity = null;
                this.form.addressLine = '';
                this.form.latitude = '0';
                this.form.longitude = '0';
                this.form.forbidCitySelection = true;
                this.form.isFormValid = false;
        },
        onCountryChanged: function(){
            if(this.form.selectedCountry != null){
                this.form.forbidCitySelection = false;
            }
            this.form.selectedCity = null;
            this.refreshCities();
            
        },
        refreshCities: function(){
            //Retrieve cities
            client({
                method: 'GET',
                url: `cities/within-country/${this.form.selectedCountry}`
            }).then( (response) => {
                this.form.cities = response.data;
            })
        },
        sendRegistrationRequest: function(){
            client({
                method: 'POST',
                url: 'auth/register',
                data: {
                    firstName: this.form.firstName,
                    lastName: this.form.lastName,
                    telephone: this.form.phone,
                    gender: this.form.gender,
                    email: this.form.email,
                    password: this.form.password,
                    confirmPassword: this.form.confirmPassword,
                    address: {
                        addressLine: this.form.addressLine,
                        latitude: this.form.latitude,
                        longitude: this.form.longitude,
                        city: {
                            id: this.form.selectedCity
                        }
                    }
                }
            }).then( (response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        }
    }
}

</script>

<style scoped>
    .registration-component{
        padding: 2rem;
        display:flex;
        align-items: center;
    }
</style>