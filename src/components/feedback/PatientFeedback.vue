<template>
<div class='patient-feedback'>
    <v-container fluid fill-height class='spacing-playground pa-6 justify-center'>
        <v-card class='elevation-12 ma-4 flex-grow-1' max-width="50%" shaped >
            <v-toolbar
            dark
            color="primary"
            shaped>
                <v-toolbar-title>Feedback</v-toolbar-title>
            </v-toolbar>
            <v-tabs
            grow>
                <v-tab>
                    Dermatologists
                </v-tab>
                <v-tab>
                    Pharmacists
                </v-tab>
                <v-tab>
                    Medicine
                </v-tab>
                <v-tab>
                    Pharmacies
                </v-tab>
                <!-- Dermatologists -->
                <v-tab-item>
                    <v-card>
                        <v-card-title>
                            <v-text-field
                                v-model="searchDermatologists"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-data-table
                        v-model='selectedDermatologist'
                        :items='dermatologistsList'
                        :headers='dermatologistsHeaders'
                        :search="searchDermatologists"
                        :single-select='singleSelect'
                        show-select
                        return-object
                        item-key="employeeId">
                        </v-data-table>
                        <v-card-actions class="justify-center"
                        v-if='selectedDermatologist.length > 0'>
                            <v-btn
                            color="primary"
                            @click='addFeedbackDermatologistDialog'>
                            Add Feedback
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>
                </v-tab-item>

                <!-- Pharmacists -->
                <v-tab-item>
                    <v-card>
                        <v-card-title>
                            <v-text-field
                                v-model="searchPharmacists"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-data-table
                        v-model='selectedPharmacist'
                        :items='pharmacistsList'
                        :headers='pharmacistsHeaders'
                        :search="searchPharmacists"
                        :single-select='singleSelect'
                        show-select
                        return-object
                        item-key="employeeId">
                        </v-data-table>
                        <v-card-actions class="justify-center"
                        v-if='selectedPharmacist.length > 0'>
                            <v-btn
                            color="primary"
                            @click='addFeedbackPharmacistDialog'>
                            Add Feedback
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>    
                </v-tab-item>
                <!-- Medicine -->
                <v-tab-item>
                    <v-card>
                        <v-card-title>
                            <v-text-field
                                v-model="searchMedicine"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-data-table
                        v-model='selectedMedicine'
                        :items='medicineList'
                        :headers='medicineHeaders'
                        :search="searchMedicine"
                        :single-select='singleSelect'
                        show-select
                        return-object
                        item-key="id">
                        </v-data-table>
                        <v-card-actions class="justify-center"
                        v-if='selectedMedicine.length > 0'>
                            <v-btn
                            color="primary"
                            @click='addFeedbackMedicineDialog'>
                            Add Feedback
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>    
                </v-tab-item>
                <!-- Pharmacies -->
                <v-tab-item>
                    <v-card>
                        <v-card-title>
                            <v-text-field
                                v-model="searchPharmacy"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-data-table
                        v-model='selectedPharmacy'
                        :items='pharmacyList'
                        :headers='pharmacyHeaders'
                        :search="searchPharmacy"
                        :single-select='singleSelect'
                        show-select
                        return-object
                        item-key="pharmacyId">
                        </v-data-table>
                        <v-card-actions class="justify-center"
                        v-if='selectedPharmacy.length > 0'>
                            <v-btn
                            color="primary"
                            @click='addFeedbackPharmacyDialog'>
                            Add Feedback
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>   
                </v-tab-item>
            </v-tabs>
        </v-card>.

        <!-- Dermatologist dialog -->
        <v-dialog v-model='dermatologistFeedbackDialog' max-width="50%">
            <v-card shaped>
                <v-toolbar dark color='primary'>
                    <v-toolbar-title>Dermatologist Feedback</v-toolbar-title>
                </v-toolbar>
                <v-row class="justify-center">
                    <v-rating
                    class='ma-4'
                    length="5"
                    size="58"
                    value="1"
                    v-model='ratingDermatologist'
                    ></v-rating>
                </v-row>
                <v-row class="justify-center">
                    <v-textarea
                    class='ma-4'
                    outlined
                    rows="5"
                    row-height="15"
                    no-resize
                    label="Your Comment"
                    v-model='commentDermatologist'
                    ></v-textarea>
                </v-row>
                <v-card-actions class='justify-center'>
                    <v-btn
                    color="primary"
                    @click='addFeedbackDermatologist'>
                    Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Pharmacist dialog -->
        <v-dialog v-model='pharmacistFeedbackDialog' max-width="50%">
            <v-card shaped>
                <v-toolbar dark color='primary'>
                    <v-toolbar-title>Pharmacist Feedback</v-toolbar-title>
                </v-toolbar>
                <v-row class="justify-center">
                    <v-rating
                    class='ma-4'
                    length="5"
                    size="58"
                    value="1"
                    v-model='ratingPharmacist'
                    ></v-rating>
                </v-row>
                <v-row class="justify-center">
                    <v-textarea
                    class='ma-4'
                    outlined
                    rows="5"
                    row-height="15"
                    no-resize
                    label="Your Comment"
                    v-model='commentPharmacist'
                    ></v-textarea>
                </v-row>
                <v-card-actions class='justify-center'>
                    <v-btn
                    color="primary"
                    @click='addFeedbackPharmacist'>
                    Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Medicine dialog -->
        <v-dialog v-model='medicineFeedbackDialog' max-width="50%">
            <v-card shaped>
                <v-toolbar dark color='primary'>
                    <v-toolbar-title>Medicine Feedback</v-toolbar-title>
                </v-toolbar>
                <v-row class="justify-center">
                    <v-rating
                    class='ma-4'
                    length="5"
                    size="58"
                    value="1"
                    v-model='ratingMedicine'
                    ></v-rating>
                </v-row>
                <v-row class="justify-center">
                    <v-textarea
                    class='ma-4'
                    outlined
                    rows="5"
                    row-height="15"
                    no-resize
                    label="Your Comment"
                    v-model='commentMedicine'
                    ></v-textarea>
                </v-row>
                <v-card-actions class='justify-center'>
                    <v-btn
                    color="primary"
                    @click='addFeedbackMedicine'>
                    Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Pharmacy dialog -->
        <v-dialog v-model='pharmacyFeedbackDialog' max-width="50%">
            <v-card shaped>
                <v-toolbar dark color='primary'>
                    <v-toolbar-title>Pharmacy Feedback</v-toolbar-title>
                </v-toolbar>
                <v-row class="justify-center">
                    <v-rating
                    class='ma-4'
                    length="5"
                    size="58"
                    value="1"
                    v-model='ratingPharmacy'
                    ></v-rating>
                </v-row>
                <v-row class="justify-center">
                    <v-textarea
                    class='ma-4'
                    outlined
                    rows="5"
                    row-height="15"
                    no-resize
                    label="Your Comment"
                    v-model='commentPharmacy'
                    ></v-textarea>
                </v-row>
                <v-card-actions class='justify-center'>
                    <v-btn
                    color="primary"
                    @click='addFeedbackPharmacy'>
                    Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</div>
</template>

<script>

    import {client} from '@/client/axiosClient';

    export default {
        name:'PatientFeedback',
        data(){
            return{
                //Single select is for all data tables
                singleSelect: true,
                //Dermatologists
                dermatologistsList: [],
                selectedDermatologist: [],
                dermatologistsHeaders: [
                    {text:'Dermatologist', value:'employeeFullName'},
                    {text:'Average Rating', value:'averageRating'},
                ],
                searchDermatologists: '',
                dermatologistFeedbackDialog: false,
                ratingDermatologist: 1,
                commentDermatologist: '',
                //Pharmacists
                pharmacistsList: [],
                selectedPharmacist: [],
                pharmacistsHeaders: [
                    {text:'Pharmacist', value:'employeeFullName'},
                    {text:'Average Rating', value:'averageRating'},
                ],
                searchPharmacists: '',
                pharmacistFeedbackDialog: false,
                ratingPharmacist: 1,
                commentPharmacist: '',
                //Medicine
                medicineList: [],
                selectedMedicine: [],
                medicineHeaders: [
                    {text:'Medicine', value:'medicineName'},
                    {text:'Average Rating', value:'averageRating'},
                ],
                searchMedicine: '',
                medicineFeedbackDialog: false,
                ratingMedicine: 1,
                commentMedicine: '',
                //Pharmacy
                pharmacyList: [],
                selectedPharmacy: [],
                pharmacyHeaders: [
                    {text:'Pharmacy', value:'pharmacyName'},
                    {text:'Average Rating', value:'averageRating'},
                ],
                searchPharmacy: '',
                pharmacyFeedbackDialog: false,
                ratingPharmacy: 1,
                commentPharmacy: '',
            }
        },
        mounted(){
            this.getCheckups()
            this.getCounselings()
            this.getMedicine()
            this.getPharmacy()
        },
        methods:{
            getCheckups: function(){
                client({
                    method: 'GET',
                    url: 'feedback/checkups'
                })
                .then((response) => {
                    this.dermatologistsList = response.data
                }, (error) => {

                })
            },
            getCounselings: function()
            {
                client({
                    method: 'GET',
                    url: 'feedback/counselings'
                })
                .then((response) => {
                    this.pharmacistsList = response.data
                }, (error) => {

                })
            },
            getMedicine: function()
            {
                client({
                    method: 'GET',
                    url: 'feedback/medicine'
                })
                .then((response) => {
                    this.medicineList = response.data
                }, (error) => {

                })
            },
            getPharmacy: function()
            {
                client({
                    method: 'GET',
                    url: 'feedback/pharmacies'
                })
                .then((response) => {
                    this.pharmacyList = response.data
                }, (error) => {

                })
            },
            addFeedbackDermatologistDialog: function()
            {
                this.dermatologistFeedbackDialog = true;
                this.ratingDermatologist = 1;
                this.commentDermatologist = '';
            },
            addFeedbackPharmacistDialog: function()
            {
                this.pharmacistFeedbackDialog = true;
                this.ratingPharmacist = 1;
                this.commentPharmacist = '';
            },
            addFeedbackMedicineDialog: function()
            {
                this.medicineFeedbackDialog = true;
                this.ratingMedicine = 1;
                this.commentMedicine = ''
            },
            addFeedbackPharmacyDialog: function()
            {
                this.pharmacyFeedbackDialog = true;
                this.ratingPharmacy = 1;
                this.commentPharmacy = ''
            },
            addFeedbackDermatologist: function()
            {
                console.log(this.ratingDermatologist);
                console.log(this.commentDermatologist);
                client({
                    method:'POST',
                    url: 'feedback/employee',
                    data:{
                        "employeeId": this.selectedDermatologist[0].employeeId,
                        "employeeFullName": "",
                        "averageRating": 0,
                        "yourRating": this.ratingDermatologist,
                        "yourComment": this.commentDermatologist
                    }
                })
                .then((response) => {
                    this.selectedDermatologist[0].averageRating = response.data;
                    this.dermatologistFeedbackDialog = false;
                    this.selectedDermatologist = [];
                })
            },
            addFeedbackPharmacist: function()
            {
                console.log(this.ratingPharmacist);
                console.log(this.commentPharmacist);
                client({
                    method:'POST',
                    url: 'feedback/employee',
                    data:{
                        "employeeId": this.selectedPharmacist[0].employeeId,
                        "employeeFullName": "",
                        "averageRating": 0,
                        "yourRating": this.ratingPharmacist,
                        "yourComment": this.commentPharmacist
                    }
                })
                .then((response) => {
                    this.selectedPharmacist[0].averageRating = response.data;
                    this.pharmacistFeedbackDialog = false;
                    this.selectedPharmacist = [];
                }, (error) =>{

                })
            },
            addFeedbackMedicine: function()
            {
                client({
                    method: 'POST',
                    url: 'feedback/medicine',
                    data:{
                        "id": this.selectedMedicine[0].id,
                        "medicineName": '',
                        "averageRating": 0,
                        "yourRating": this.ratingMedicine,
                        "comment": this.commentMedicine
                    }
                })
                .then((response) => {
                    this.selectedMedicine[0].averageRating = response.data;
                    this.medicineFeedbackDialog = false;
                    this.selectedMedicine = [];
                }, (error) =>{

                })
            },
            addFeedbackPharmacy: function()
            {
                client({
                    method: 'POST',
                    url: 'feedback/pharmacies',
                    data:{
                        'pharmacyId': this.selectedPharmacy[0].pharmacyId,
                        'pharmacyName': '',
                        'averageRating': 0,
                        'yourRating': this.ratingPharmacy,
                        'comment': this.commentPharmacy
                    }
                })
                .then((response) => {
                    this.selectedPharmacy[0].averageRating = response.data;
                    this.pharmacyFeedbackDialog = false;
                    this.selectedPharmacy = [];
                }, (error) =>{
                    
                })
            }
        }
    }
</script>