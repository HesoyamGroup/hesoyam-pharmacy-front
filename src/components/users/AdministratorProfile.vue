<template>
    <div>
        <v-card class='ma-5 flex-grow-1 ml-auto mr-auto' max-width="600" flat>
            <v-card-title>
                <div>Profile Information</div>
                <v-spacer></v-spacer>
                <v-btn class='ma-2' @click="infoOverlay = !infoOverlay">Edit Info</v-btn>
                <v-btn class='ma-2' @click="showPasswordCard = !showPasswordCard">Change Password</v-btn>
            </v-card-title>

            <v-card-text>
                    <v-text-field
                        label='First Name'
                        readonly
                        v-model = userDTO.firstName>
                    </v-text-field>
                    <v-text-field
                        label="Last Name"
                        readonly
                        v-model = userDTO.lastName>
                    </v-text-field>
                    <v-text-field
                        label="Gender"
                        readonly
                        v-model = userDTO.gender>
                    </v-text-field>
                    <v-text-field
                        label="Email"
                        readonly
                        v-model = userDTO.email>
                    </v-text-field>
                    <v-text-field
                        label="Phone Number"
                        readonly
                        v-model = userDTO.telephone>                               >
                    </v-text-field>
                    <v-text-field
                        label='City'
                        v-model = address.city.cityName
                        readonly>
                    </v-text-field>
                    <v-text-field
                        label='Address'
                        v-model = address.addressLine
                        readonly>
                    </v-text-field>
            </v-card-text>
        </v-card>

        <!-- edit information dialog -->
        <v-dialog v-model='infoOverlay' max-width="500">
            <v-card class='elevation-12 flex-grow-1'>
                <v-card-title>Edit Information</v-card-title>
                <v-card-text>
                    <v-form v-model='form.isInfoFormValid'>
                        <v-text-field
                            class='mt-4'
                            label='First Name'
                            :rules="rules.firstNameRules"
                            v-model = form.userEdit.firstName>
                        </v-text-field>
                        <v-text-field
                            label="Last Name:"
                            :rules="rules.lastNameRules"
                            v-model = form.userEdit.lastName>
                        </v-text-field>
                        <v-select
                            v-model="form.userEdit.gender"
                            :items="genders"
                            label="Gender:"
                            return-object>
                        </v-select>
                        <v-text-field
                            label="Phone Number:"
                            :rules="rules.phoneNumberRules"
                            v-model = form.userEdit.telephone>
                        </v-text-field>
                        <div class="text-center">
                                        <v-btn 
                                        v-if='form.isInfoFormValid' 
                                        rounded 
                                        color="success" 
                                        dark 
                                        @click="saveUser"
                                        class='mr-6'>
                                            Save
                                        </v-btn>
                                        <v-btn 
                                        rounded 
                                        color="error" 
                                        dark 
                                        @click="cancelUserEdit">
                                            Cancel
                                        </v-btn>
                                    </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- change password dialog -->
        <v-dialog v-model='showPasswordCard' max-width="500">
            <v-form v-model='isFormValid'>
                <v-card>
                    <v-card-title>Change Password</v-card-title>
                    <v-card-text>
                        <v-text-field
                            class='mt-4'
                            label="Enter New Password"
                            :rules="rules.passwordRules" 
                            v-model="newPassword"
                            type="password">
                        </v-text-field>
                        <v-text-field
                            label="Confirm Password"
                            :rules='rules.confirmPasswordRules'
                            v-model="confirmNewPassword"
                            type="password"
                        >
                        </v-text-field>
                        <v-text-field
                            label='Enter Old Password'
                            :rules='rules.passwordRules'
                            v-model="oldPassword"
                            type="password"
                            >
                        </v-text-field>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn  
                            color="success"
                            v-if='isFormValid' 
                            dark
                            @click="changePassword"
                            class='mr-6'>
                                Save
                            </v-btn>
                            <v-btn  
                            color="error" 
                            dark 
                            class="ml-6"
                            @click="resetPasswordForm">
                                Cancel
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';
export default {
    name: 'AdministratorProfile',
    data: function(){
        return{
            infoOverlay: false,
            showPasswordCard: false, 
            //User Information and Editing
            userDTO:{
                firstName: '',
                lastName: '',
                gender: '',
                email: '',
                telephone: ''
            },
            form:{
                userEdit:{
                    firstName: '',
                    lastName: '',
                    gender: '',
                    telephone: ''
                },
                isInfoFormValid: true,
            },
            genders: ['MALE', 'FEMALE', 'OTHER', 'DONT_SAY'],
            //Password changing
            newPassword: '',
            confirmNewPassword: '',
            oldPassword: '',
            showPasswordCard: false,
            isFormValid: false,
            address:{
                    city:{
                        cityName:''}
                },

            //Rules
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
                    pw => this.newPassword === pw || "Passwords must match",
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
                    gender => this.form.genders.includes(gender) || 'You must choose a gender'
                ]
            }
        }
    },
    mounted(){
        this.fetchUserInfo();
        this.fetchUserAddress();
    },
    methods:{
        fetchUserInfo(){
            client({
                method: 'GET',
                url: '/profile/user-information'
            })
            .then( (response) => {
                this.userDTO = Object.assign(this.userDTO, response.data);
                this.form.userEdit = Object.assign(this.form.userEdit, response.data);
            }, (error) => {});
        },
        fetchUserAddress(){
            client({
                method:'GET',
                url: '/profile/user-address'
            })
            .then((response) => {
                this.address = response.data;
            }, (error) => {});
        },
        //Update basic information about user
        saveUser(){
            client({
                method: 'POST',
                url: 'profile/change-user-basic-info',
                data:{
                    firstName: this.form.userEdit.firstName,
                    lastName: this.form.userEdit.lastName,
                    gender: this.form.userEdit.gender,
                    telephone: this.form.userEdit.telephone
                }
            })
            .then((response)=>{
                this.userDTO = Object.assign(this.userDTO, this.form.userEdit);
                this.infoOverlay = !this.infoOverlay;
            }, (error)=>{});
        },
        cancelUserEdit(){
            this.infoOverlay = !this.infoOverlay;
            this.form.userEdit = Object.assign(this.form.userEdit, this.userDTO);
        },
        //Change password
        changePassword(){
            client({
                method: 'POST',
                url: 'profile/change-password',
                data:{
                    password: this.newPassword,
                    confirmPassword: this.confirmNewPassword,
                    oldPassword: this.oldPassword
                }
            })
            .then((response) => {
                alert('Password is changed successfully!');
            },(error)=>{}); 
        },
        resetPasswordForm(){
            this.newPassword='';
            this.confirmNewPassword='';
            this.oldPassword='';
            this.showPasswordCard=false;
        },
    }

}
</script>