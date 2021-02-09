<template>
    <div class="register-user">
        <v-container fill-height>
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Register user account</v-toolbar-title>
                        </v-toolbar>


                        <v-card-text>
                            <v-form v-model="form.isFormValid">
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="form.firstName" :rules="form.rules.firstNameRules" label="First name" prepend-icon="mdi-account"></v-text-field>
                                        </v-col>

                                        <v-col>
                                            <v-text-field v-model="form.lastName" :rules="form.rules.lastNameRules" label="Last name" prepend-icon="mdi-account"></v-text-field>
                                        </v-col>

                                        <v-col>
                                            <v-select v-model="form.gender" :rules="form.rules.genderRules" :items="form.genders" label="Gender" prepend-icon="mdi-gender-male-female"></v-select>
                                        </v-col>

                                        <v-col>
                                                <v-select v-model="form.selectedAccountType" :rules="form.rules.accountTypeRules" :items="form.accountTypes" label="Account type" prepend-icon="mdi-briefcase"></v-select>
                                        </v-col>

                                        <v-col cols="3">

                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="form.password" :rules="form.rules.passwordRules" label="Password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                        </v-col>

                                        <v-col>
                                            <v-text-field v-model="form.confirmPassword" :rules="form.rules.confirmPasswordRules" label="Confirm password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                        </v-col>

                                        <v-col>
                                            <v-text-field :disabled="form.disableUserInteraction" v-model="form.email" :rules="form.rules.emailRules" name="email" label="Email address" type="text" prepend-icon="mdi-email"> </v-text-field>
                                        </v-col>

                                        <v-col>
                                            <v-text-field :disabled="form.disableUserInteraction" v-model="form.phone" :rules="form.rules.phoneNumberRules" name="phone" label="Phone number" type="text" prepend-icon="mdi-cellphone"> </v-text-field>
                                        </v-col>

                                         <v-col cols="3">
                                             <v-row>
                                                <v-subheader  v-if="form.status.registrationInProgress">Registration in progress....</v-subheader>
                                                <v-subheader class="red--text" v-if="form.status.registrationErrorOccured">{{this.form.status.registrationErrorMessage}}</v-subheader>
                                                <v-subheader class="green--text" v-if="form.status.registrationSuccessful">Registration successful</v-subheader>
                                            </v-row>
                                        </v-col>
                                    </v-row>


                                    <v-row>
                                        <v-col>
                                            <v-select :disabled="form.disableUserInteraction" :rules="form.countryRules" item-text="countryName" item-value="id" @change="onCountryChanged()" v-model="form.selectedCountry" :items="form.countries" label="Country" prepend-icon="mdi-map-marker"></v-select>
                                        </v-col>

                                        <v-col>
                                            <v-select v-model="form.selectedCity" item-text="cityName" item-value="id" :rules="form.rules.cityRules" :disabled="form.forbidCitySelection || form.disableUserInteraction"  :items="form.cities"  label="City" prepend-icon="mdi-city"> </v-select>
                                        </v-col>

                                        <v-col>
                                            <v-text-field :disabled="form.disableUserInteraction" v-model="form.addressLine" :rules="form.rules.addressLineRules" label="Address line"> </v-text-field>
                                        </v-col>

                                       

                                        <v-col cols="3">
                                           

                                            <v-row align="end">
                                                <v-btn  class="confirmButton" :disabled="!form.isFormValid" @click="createUserAccount()" color="primary">Register account</v-btn>
                                            </v-row>
                                            
                                        </v-col>

                                    </v-row>
                                </v-container>
                            </v-form>
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
        name: 'register-user',
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
        data(){
            return {
                form: {
                    status: {
                        registrationInProgress: false,
                        registrationErrorOccured: false,
                        registrationSuccessful: false,
                        registrationErrorMessage: ''
                    },
                    accountTypes: [
                        'DERMATOLOGIST',
                        'PHARMACIST',
                        'SYS_ADMIN',
                        'SUPPLIER'
                    ],
                    genders: [
                            'MALE',
                            'FEMALE',
                            'OTHER',
                            'DONT_SAY'
                    ],
                    selectedAccountType: null,
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
                        accountTypeRules: [
                            accountType => this.form.accountTypes.includes(accountType) || "You must choose an account type"
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
                }
            }
        },
        methods: {
            createUserAccount: function(){
                this.resetFormStatus();
                this.form.status.registrationInProgress = true;
                client({
                    method:'POST',
                    url: this.getUrlForAccountType(),
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
                        roleEnum: this.form.selectedAccountType
                    }
                }).then( (response) => {
                        this.form.status.registrationInProgress = false;
                        this.form.status.registrationSuccessful = true;
                        this.resetForm();
                }, (error) => {
                        this.form.status.registrationInProgress = false;
                        this.form.status.registrationErrorOccured = true;

                        let errorStatus = error.response.status;
                        let errorMessage = '';
                        if(errorStatus == '403'){
                            errorMessage = 'Insufficient privileges.';
                        }else if(errorStatus == '409'){
                            errorMessage = 'Email already taken';
                        }else if(errorStatus == '400'){
                            errorMessage == 'Invalid request.'
                        }
                        this.form.status.registrationErrorMessage = errorMessage;
                });

            },
            getUrlForAccountType: function(){
                var accountType = this.form.selectedAccountType;
                if(accountType === 'SYS_ADMIN'){
                    return '/auth/register-sys-admin-account';
                }else if(accountType === 'SUPPLIER'){
                    return '/auth/register-supplier-account';
                }

                return '/auth/register-employee-account';
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
            },
            resetFormStatus: function(){
                this.form.status = {
                    registrationInProgress: false,
                    registrationErrorOccured: false,
                    registrationSuccessful: false,
                    registrationErrorMessage: ''
                }
            }
        }
    }
</script>



<style scoped>
    .confirmButton{
        width:100%;
    }
</style>