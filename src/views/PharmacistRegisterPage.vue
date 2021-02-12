<template>
    <div class="register-user">
        <v-card flat class="ma-5">
            <v-card-title>
                <div>Register pharmacist</div>
                <v-spacer></v-spacer>
                <v-btn  class="confirmButton" :disabled="!isValid" @click="createUserAccount()" color="primary">Register</v-btn>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-card flat class="ma-5">
                            <v-card-title>Personal information</v-card-title>
                            <v-card-text>
                                <v-form v-model="form.isFormValid">
                                    <v-text-field v-model="form.firstName" :rules="form.rules.firstNameRules" label="First Name" prepend-icon="mdi-account"></v-text-field>
                                    <v-text-field v-model="form.lastName" :rules="form.rules.lastNameRules" label="Last Name" prepend-icon="mdi-account"></v-text-field>
                                    <v-select v-model="form.gender" :rules="form.rules.genderRules" :items="form.genders" label="Gender" prepend-icon="mdi-gender-male-female"></v-select>
                                    <v-text-field v-model="form.password" :rules="form.rules.passwordRules" label="Password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                    <v-text-field v-model="form.confirmPassword" :rules="form.rules.confirmPasswordRules" label="Confirm password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                    <v-text-field :disabled="form.disableUserInteraction" v-model="form.email" :rules="form.rules.emailRules" name="email" label="Email address" type="text" prepend-icon="mdi-email"> </v-text-field>
                                    <v-text-field :disabled="form.disableUserInteraction" v-model="form.phone" :rules="form.rules.phoneNumberRules" name="phone" label="Phone number" type="text" prepend-icon="mdi-cellphone"> </v-text-field>

                                    <v-select :disabled="form.disableUserInteraction" :rules="form.countryRules" item-text="countryName" item-value="id" @change="onCountryChanged()" v-model="form.selectedCountry" :items="form.countries" label="Country" prepend-icon="mdi-map-marker"></v-select>
                                    <v-select v-model="form.selectedCity" item-text="cityName" item-value="id" :rules="form.rules.cityRules" :disabled="form.forbidCitySelection || form.disableUserInteraction"  :items="form.cities"  label="City" prepend-icon="mdi-city"> </v-select>
                                    <v-text-field :disabled="form.disableUserInteraction" v-model="form.addressLine" :rules="form.rules.addressLineRules" label="Address line"> </v-text-field>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <shift-picker v-model="shifts"></shift-picker>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';
import ShiftPicker from '../components/employee/ShiftPicker.vue';
export default {
    components: { ShiftPicker },
    name: 'PharmacistRegisterPage',
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
                password: '',
                confirmPassword: '',
                countries: [],
                cities: [],
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
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
                    genderRules: [
                        gender => this.form.genders.includes(gender) || 'You must choose a gender'
                    ],
                    countryRules:[
                        country => !!country || "You must select a country."
                    ],
                    cityRules: [
                        city => !!city || "You must select a city."
                    ],
                    passwordRules: [
                        pw => !!pw || 'Password is required.',
                        pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                    ],
                    confirmPasswordRules: [
                        pw => this.form.password === pw || "Passwords must match",
                    ],
                }
            },
            shifts: {
                shiftRange: [],
                shiftFrom: '',
                shiftTo: '',
                shiftsValid: false
            },
        }
    },
    mounted(){
        this.fetchCountries();
    },
    methods:{
        fetchCountries(){
            client({
                method:'GET',
                url:'countries/getAll'
            }).then( (response) => {
                this.form.countries = response.data;
            }, (error) => {});
        },
        createUserAccount: function(){
            client({
                method:'POST',
                url: '/auth/register-pharmacist',
                data: {
                    firstName: this.form.firstName,
                    lastName: this.form.lastName,
                    telephone: this.form.phone,
                    email: this.form.email,
                    gender: this.form.gender,
                    password: this.form.password,
                    confirmPassword: this.form.confirmPassword,
                    address: {
                        addressLine: this.form.addressLine,
                        latitude: 0,
                        longitude: 0,
                        city: {
                            id: this.form.selectedCity
                        }
                    },
                    roleEnum: 'PHARMACIST',
                    shiftRange: {
                        from: new Date(this.shifts.shiftRange[0]).toISOString(),
                        to: new Date(this.shifts.shiftRange[1]).toISOString()
                    },
                    shiftFrom: this.shifts.shiftFrom,
                    shiftTo: this.shifts.shiftTo
                }
            }).then( (response) => {
                    this.resetForm();
                    alert('Pharmacist registered successfully');
            }, (error) => {
                switch(error.response.status){
                    case 403: alert('Insufficient privileges.'); break;
                    case 409: alert('Email already taken'); break;
                    case 400: alert('Pharmacist already works.'); break;
                }
            });
        },
        resetForm(){
            this.form.selectedAccountType = null;
            this.form.gender = null;
            this.form.password = '';
            this.form.confirmPassword = '';
            this.form.firstName = '';
            this.form.lastName = '';
            this.form.email = '';
            this.form.phone = '';
            this.form.selectedCountry = null;
            this.form.selectedCity = null;
            this.form.addressLine = '';
            this.shifts = {
                shiftRange: [],
                shiftFrom: '',
                shiftTo: '',
                shiftsValid: false
            }
        },
        onCountryChanged(){
            if(this.form.selectedCountry != null){
                this.form.forbidCitySelection = false;
            }
            this.form.selectedCity = null;
            this.refreshCities();  
        },
        refreshCities(){
            //Retrieve cities
            client({
                method: 'GET',
                url: `cities/within-country/${this.form.selectedCountry}`
            }).then( (response) => {
                this.form.cities = response.data;
            });
        },
    },
    computed:{
        isValid(){
            return this.form.isFormValid && this.shifts.shiftsValid;
        }
    }

}
</script>