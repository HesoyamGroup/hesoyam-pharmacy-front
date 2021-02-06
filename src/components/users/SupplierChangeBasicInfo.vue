<template>
    <div fluid class="supplier-basic-info">
        <v-container fluid fill-height>
            <v-row class="fill-height">
                <v-card :elevation="5" height="100%" width="100%">

                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Change basic info</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-row height="100%">
                            <v-col>
                                <v-card >
                                    <v-card-text class="p-6">
                                        <v-row>
                                            <v-col>
                                                <v-text-field v-model="firstName" label="First name" :rules="rules.firstNameRules"> </v-text-field>
                                            </v-col>
                                            <v-col>
                                                 <v-text-field v-model="lastName" label="Last name" :rules="rules.lastNameRules"> </v-text-field>
                                            </v-col>                                        
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field v-model="phoneNumber" label="Phone number" :rules="rules.phoneNumberRules"> </v-text-field>
                                            </v-col>

                                            <v-col>
                                                 <v-select v-model="gender" :items="genders" label="Gender" :rules="rules.genderRules"> </v-select>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col>
                                                <v-select v-model="selectedCountry" item-text="countryName" item-value="id" :items="countries" label="Country" :rules="rules.countryRules"> </v-select>
                                            </v-col>

                                            <v-col>
                                                <v-select v-model="selectedCity" item-text="cityName" item-value="id" :items="cities" label="City" :rules="rules.cityRules"> </v-select>
                                            </v-col>
                                        </v-row>
                                         <v-text-field v-model="addressLine" label="Address line" :rules="rules.addressLineRules"> </v-text-field>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer> </v-spacer>

                                        <v-btn color="gray">Reset</v-btn>
                                        <v-btn color="primary">Update</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>

                            <v-col>
                                <v-form v-model="isChangePassFormValid">
                                    <v-card height="100%">
                                        <v-card-text class="p-6">
                                            <v-text-field v-model="oldPassword" type="password" label="Old password" :rules="rules.passwordRules"> </v-text-field>
                                            <v-text-field v-model="newPassword" type="password" label="New password" :rules="rules.passwordRules"> </v-text-field>
                                            <v-text-field v-model="confirmNewPassword" type="password" label="Confirm new password" :rules="rules.confirmPasswordRules"> </v-text-field>

                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer> </v-spacer>
                                            <v-subheader v-if="passChangeSuccessMessage" class="green--text">{{passChangeSuccessMessage}}</v-subheader>
                                            <v-subheader v-if="passChangeErrorMessage" class="red--text">{{passChangeErrorMessage}}</v-subheader>
                                            <v-btn color="primary" :disabled="!isChangePassFormValid" @click="changePass()">Change password</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-row>
        </v-container>
    </div>

</template>



<script>
    import {client} from '@/client/axiosClient.js';
    export default {
        mounted(){
            this.fetchUserBasicInfo();
            this.fetchUserLocationInfo();
        },
        data(){
            return {
                passChangeSuccessMessage: '',
                passChangeErrorMessage: '',
                isChangePassFormValid : false,
                tab: null,
                my_data: null,
                countries: [],
                cities: [],
                selectedCity: null,
                selectedCountry: null,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                gender: null,
                addressLine: '',
                genders: [
                    'MALE',
                    'FEMALE',
                    'OTHER',
                    'DONT_SAY'
                ],
                rules: {
                    passwordRules: [
                        pw => !!pw || 'Password is required.',
                        pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                    ],
                    confirmPasswordRules: [
                        pw => !!pw || 'Confirm password must be specified',
                        pw => this.newPassword == pw || "Passwords must match",
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
                        gender => this.genders.includes(gender) || 'You must choose a gender'
                    ],
                    countryRules:[
                        country => !!country || "You must select a country."
                    ],
                    cityRules: [
                        city => !!city || "You must select a city."
                    ]
                },

            }
        },
        methods: {
            changePass(){
                client({
                    method: 'POST',
                    url: 'profile/change-password',
                    data: {
                        oldPassword: this.oldPassword,
                        password: this.newPassword,
                        confirmPassword: this.confirmNewPassword
                    }
                }).then((response) => {
                    this.passChangeSuccessMessage = 'Successfully changed password. For security reasons, you need to relog.';
                    setTimeout( () => {
                        this.passChangeSuccessMessage = '';
                        this.$router.push({path: '/login'});
                    }, 3000);
                }, (error) => {
                    this.passChangeErrorMessage = 'Wrong current password.';
                    setTimeout( () => {
                        this.passChangeErrorMessage = '';
                    }, 2000);
                })
            },
            fetchUserBasicInfo(){
                client({
                    method: 'GET',
                    url: 'profile/user-information'
                }).then((response) => {
                    let data = response.data;
                    this.firstName = data.firstName;
                    this.lastName = data.lastName;
                    this.gender = data.gender;
                    this.phoneNumber = data.telephone;
                });
            },
            fetchUserLocationInfo(){
                client({
                    method: 'GET',
                    url: 'profile/user-address'
                }).then( (response) => {
                    let data = response.data;
                    this.addressLine = data.addressLine;
                    this.selectedCountry = data.city.country.id;
                    this.selectedCity = data.city.id;
                });
            }
        }
    }
</script>


<style scoped>

.supplier-basic-info{
    height:100%;
    width:100%;
}

</style>