<template>
<div class="profile-component">
    <v-container fluid fill-height class="spacing-playground pa-6">
                <v-row>
                    <v-col cols="4" class="d-flex">
                        <v-card class='elevation-12 ma-4 mb-1 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Profile Information</v-toolbar-title>
                            </v-toolbar>
                            <div class="text-center">
                                <v-btn 
                                class='ma-2'
                                rounded 
                                color="primary" 
                                dark 
                                @click="infoOverlay = !infoOverlay">
                                    Edit Info
                                </v-btn>
                                    
                                <v-btn
                                class='ma-2'
                                rounded
                                color='primary'
                                dark
                                @click="showPasswordCard = !showPasswordCard">
                                    Change Password
                                </v-btn>

                                <v-btn
                                class='ma-2'
                                rounded
                                color='primary'
                                dark
                                @click="showAddressCard = !showAddressCard">
                                    Change Address
                                </v-btn>
                            </div>
                            <v-card-text>
                                    <v-text-field
                                        label='First Name:'
                                        outlined
                                        readonly
                                        v-model = userDTO.firstName>
                                    </v-text-field>
                                    <v-text-field
                                        label="Last Name:"
                                        outlined
                                        readonly
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
                                        readonly
                                        outlined
                                        v-model = userDTO.telephone>                               >
                                    </v-text-field>
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
                                        <v-btn
                                        class='ma-2'
                                        rounded
                                        color='primary'
                                        dark
                                        @click='allergiesDialog = !allergiesDialog'>
                                            My Allergies
                                        </v-btn>
                                    </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    
                    
                    <v-col v-if='false' class="d-flex">
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
                    <v-col cols='4'>
                        <v-card class='elevation-12 ma-4 mb-1 flex-grow-1' shaped>
                            <v-toolbar dark color='primary'>
                                <v-toolbar-title>Reserved Medicine</v-toolbar-title>
                            </v-toolbar>
                            <v-card-title>
                                    <v-text-field
                                        v-model="searchMedicine"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                        outlined
                                    ></v-text-field>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                            <v-card-actions class='justify-center'>
                                <v-btn
                                color='primary'
                                class='ma-1'
                                rounded
                                @click='getAllMedicine'>
                                    All
                                </v-btn>
                                <v-btn
                                color='primary'
                                class='ma-1'
                                rounded
                                @click="getCreatedMedicine">
                                    Created
                                </v-btn>
                                <v-btn
                                color='primary'
                                class='ma-1'
                                rounded
                                @click="getCancelledMedicine">
                                    Cancelled
                                </v-btn>
                                <v-btn
                                color='primary'
                                class='ma-1'
                                rounded
                                @click="getCompletedMedicine">
                                    Completed
                                </v-btn>
                            </v-card-actions>
                            <v-data-table
                            :headers='medicineHeaders'
                            :items='medicineList'
                            :items-per-page="5"
                            :search="searchMedicine"
                            no-data-text="You have no reserved medicine!">
                            </v-data-table>
                            <v-card-actions class='justify-center'>
                                <v-btn
                                color='error    '
                                class='ma-1'
                                rounded
                                @click="showCancelDialog = !showCancelDialog">
                                    Cancel Reservation
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- edit information dialog -->
                <v-dialog v-model='infoOverlay' max-width="20%">
                    <v-card class='elevation-12 flex-grow-1' shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Edit Information</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model='form.isInfoFormValid'>
                                    <v-text-field
                                        class='mt-4'
                                        label='First Name:'
                                        outlined
                                        :rules="rules.firstNameRules"
                                        v-model = form.userEdit.firstName>
                                    </v-text-field>
                                    <v-text-field
                                        label="Last Name:"
                                        outlined
                                        :rules="rules.lastNameRules"
                                        v-model = form.userEdit.lastName>
                                    </v-text-field>
                                    <v-select
                                        v-model="form.userEdit.gender"
                                        :items="genders"
                                        label="Gender:"
                                        outlined
                                        return-object>
                                    </v-select>
                                    <v-text-field
                                        label="Phone Number:"
                                        outlined
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
                
                <!-- change address dialog -->
                <v-dialog v-model='showAddressCard' max-width="20%">
                    <v-card shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Change Address</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-select
                                    class='mt-4'
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
                                    :rules="rules.addressLineRules"
                                    outlined>
                                </v-text-field>
                                <div class="text-center">
                                    <v-btn 
                                    v-if='this.selectedCity != null && this.selectedCountry != null && this.addressLine.length >=3' 
                                    rounded 
                                    color="success" 
                                    dark 
                                    @click="saveAddress"
                                    class='mr-6'>
                                        Save
                                    </v-btn>
                                    <v-btn 
                                    rounded 
                                    color='error' 
                                    dark 
                                    @click='cancelAddressSave'
                                    class='ml-6'>
                                        Cancel
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                </v-dialog>

                <!-- change password dialog -->
                <v-dialog v-model='showPasswordCard' max-width="20%">
                    <v-form v-model='isFormValid'>
                        <v-card shaped>
                            <v-toolbar dark color = 'primary'>
                                <v-toolbar-title>Change Password</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-text-field
                                    class='mt-4'
                                    label="Enter New Password:"
                                    :rules="rules.passwordRules"
                                    outlined 
                                    v-model="newPassword"
                                    type="password">
                                </v-text-field>
                                <v-text-field
                                    label="Confirm Password:"
                                    :rules='rules.confirmPasswordRules'
                                    outlined
                                    v-model="confirmNewPassword"
                                    type="password"
                                >
                                </v-text-field>
                                <v-text-field
                                    label='Enter Old Password:'
                                    :rules='rules.passwordRules'
                                    outlined
                                    v-model="oldPassword"
                                    type="password"
                                    >
                                </v-text-field>
                                <div class="text-center">
                                        <v-btn 
                                        rounded 
                                        color="success"
                                        v-if='isFormValid' 
                                        dark
                                        @click="changePassword"
                                        class='mr-6'>
                                            Save
                                        </v-btn>
                                        <v-btn 
                                        rounded 
                                        color="error" 
                                        dark 
                                        class="ml-6"
                                        @click="resetPasswordForm">
                                            Cancel
                                        </v-btn>
                                    </div>
                            </v-card-text>
                        </v-card>
                    </v-form>
                </v-dialog>

                <!-- medicine reservation dialog -->
                <v-dialog v-model="showCancelDialog" max-width="33%">
                    <v-card shaped>
                            <v-toolbar dark color='primary'>
                                <v-toolbar-title>Reserved Medicine</v-toolbar-title>
                            </v-toolbar>
                            <v-card-title>
                                    <v-text-field
                                        v-model="searchMedicineCancelDialog"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                    ></v-text-field>
                                </v-card-title>
                            <v-data-table
                            :headers='medicineHeaders'
                            :items='cancelableMedicine'
                            :items-per-page="5"
                            :search="searchMedicineCancelDialog"
                            show-select
                            :single-select='singleSelectCancellation'
                            v-model='selectedCancelReservationList'
                            no-data-text="You have no reserved medicine!"
                            return-object>
                            </v-data-table>
                            <v-card-actions class='justify-center'>
                                <v-btn
                                v-if='selectedCancelReservationList.length > 0'
                                color='error'
                                class='ma-1'
                                rounded
                                @click="cancelReservation">
                                    Cancel Reservation
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                </v-dialog>

                <!-- allergies dialog -->
                <v-dialog v-model='allergiesDialog' max-width="20%">
                    <v-card shaped>
                        <v-toolbar dark color = 'primary'>
                            <v-toolbar-title>Allergies</v-toolbar-title>
                        </v-toolbar>
                        <v-card-actions class='justify-center'>
                            <v-btn
                            color='success'>
                                Add Allergy
                            </v-btn>
                            <v-btn
                            color='error'>
                                Delete Allergy
                            </v-btn>
                        </v-card-actions>
                        <v-data-table
                        :headers="headersAllergies"
                        :items="allergies"
                        :items-per-page="5"
                        no-data-text="Luckily, You have no Allergies!">
                        </v-data-table>
                        <v-card-actions class='justify-center'>
                            <v-btn
                            color="error"
                            @click='allergiesDialog = !allergiesDialog'>
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
    </v-container>
    
</div>
</template>>


<script>

import {client} from '@/client/axiosClient';

export default {
        name: 'Profile',
        data(){
            return {
                //User Addres and Editing
                address:{
                    city:{
                        cityName:''}
                },
                selectedCountry: null,
                selectedCity: null,
                addressLine:'',
                countries:[],
                citiesInCountry:[],
                overlay: true,
                showAddressCard: false,
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
                    isInfoFormValid: false,
                },
                infoOverlay: false,
                genders: ['MALE', 'FEMALE', 'OTHER', 'DONT_SAY'],
                //Password changing
                newPassword: '',
                confirmNewPassword: '',
                oldPassword: '',
                showPasswordCard: false,
                isFormValid: false,
                //Allergies
                allergiesDialog: false,
                headersAllergies: [
                    {text: 'Medicine Name:', value: 'medicineName'}
                ],
                allergies: [],
                //Reserved medicine
                medicineHeaders:[
                { text: 'Medicine:', value:'iteratorMedicineReservationItem[0].medicine.name'},
                { text: 'Status:', value:'medicineReservationStatus'},
                { text: 'Pick Up Date:', value:'pickUpDate'},                
                ],
                medicineList:[],
                allMedicine: [],
                createdMedicine: [],
                cancelledMedicine: [],
                completedMedicine: [], 
                searchMedicine: '',
                //Cancellation dialog
                showCancelDialog: false,
                searchMedicineCancelDialog: '',
                cancelableMedicine: [],
                selectedCancelReservationList:[],
                singleSelectCancellation: true,
                //Loyalty Program
                value:69,
                
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
            const vm = this;
            client({
                    method: 'GET',
                    url: 'profile/user-information'
                })
                .then( (response) => {
                    vm.userDTO = Object.assign(vm.userDTO,response.data);
                    vm.form.userEdit = Object.assign(vm.form.userEdit ,response.data);
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

            client({
                method: 'GET',
                url: 'medicine-reservation/get-reservations'
            })
            .then((response) => {
                vm.medicineList = response.data;
                vm.allMedicine = response.data;
                vm.cancelableMedicine = response.data.filter(obj=>obj.medicineReservationStatus==='CREATED')
            }, (error) => {

            })

        },
        methods:{
            //Get all cities in selected country
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

            //Update address information about user
            saveAddress: function(){
                client({
                    method: 'POST',
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
                    this.selectedCity = null;
                    this.selectedCountry = null;
                    this.addressLine = '';
                    this.showAddressCard = false;
                }, (error) => {

                })

            },
            //Update basic information about user
            saveUser: function(){
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
                    console.log('ok');
                    this.userDTO = Object.assign(this.userDTO, this.form.userEdit);
                    this.infoOverlay = !this.infoOverlay;
                }, (error)=>{

                })
            },
            cancelUserEdit: function()
            {
                this.infoOverlay = !this.infoOverlay;
                this.form.userEdit = Object.assign(this.form.userEdit, this.userDTO);
            },
            //Change password
            changePassword: function()
            {
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
                    console.log('password changed');
                    
                },(error)=>{

                })
                
            },            
            cancelAddressSave: function()
            {
                this.overlay = !this.overlay;
                this.selectedCity = null;
                this.selectedCountry = null;
                this.addressLine = '';
                this.showAddressCard=false;
            },
            resetPasswordForm: function()
            {
                this.newPassword='';
                this.confirmNewPassword='';
                this.oldPassword='';
                this.showPasswordCard=false;
            },
            // Medicine reservation cancellation
            //Medicine reservation filters
            getAllMedicine: function()
            {
                this.medicineList = this.allMedicine;
            },
            getCreatedMedicine: function()
            {
                this.medicineList = this.allMedicine.filter(obj=>obj.medicineReservationStatus==='CREATED');
            },
            getCancelledMedicine: function()
            {
                this.medicineList = this.allMedicine.filter(obj=>obj.medicineReservationStatus==='CANCELLED');
            },
            getCompletedMedicine: function()
            {
                this.medicineList = this.allMedicine.filter(obj=>obj.medicineReservationStatus==='COMPLETED');
            },
            cancelReservation: function()
            {
                client({
                    method: 'POST',
                    url: 'medicine-reservation/cancel-reservation',
                    data:{
                        id: this.selectedCancelReservationList[0].id
                    }
                })
                .then((response) => {
                    for (var i in this.allMedicine) 
                    {
                        if (this.allMedicine[i].id == response.data) 
                        {
                            this.allMedicine[i].medicineReservationStatus = 'CANCELLED';
                            break;
                        }
                    }
                    this.getAllMedicine();
                    this.selectedCancelReservationList = [];
                    this.showCancelDialog = false;                 
                },(error)=>{

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