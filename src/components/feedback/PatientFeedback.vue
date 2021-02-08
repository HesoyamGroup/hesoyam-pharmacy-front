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
                        item-key="dermatologistId">
                        </v-data-table>
                        <v-card-actions class="justify-center"
                        v-if='selectedDermatologist.length > 0'>
                            <v-btn
                            color="primary"
                            v-if='selectedDermatologist[0].yourRating == 0.0'
                            @click='addFeedbackDermatologistDialog'>
                            Add Feedback
                            </v-btn>
                        </v-card-actions>
                        
                    </v-card>
                </v-tab-item>
                <!-- Pharmacists -->
                <v-tab-item>
                    
                </v-tab-item>
                <!-- Medicine -->
                <v-tab-item>
                    
                </v-tab-item>
                <!-- Pharmacies -->
                <v-tab-item>
                    
                </v-tab-item>
            </v-tabs>
        </v-card>
        <v-dialog v-model='dermatologistFeedbackDialog' max-width="50%">
            <v-card shaped>
                <v-toolbar dark color='primary'>
                    <v-toolbar-title>Feedback</v-toolbar-title>
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
                    {text:'Dermatologist', value:'dermatologistFullName'},
                    {text:'Average Rating', value:'averageRating'},
                ],
                searchDermatologists: '',
                dermatologistFeedbackDialog: false,
                ratingDermatologist: 1,
                commentDermatologist: '',
            }
        },
        mounted(){
            this.getCheckups()
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
            addFeedbackDermatologistDialog: function()
            {
                this.dermatologistFeedbackDialog = true;
                this.ratingDermatologist = 1;
                this.commentDermatologist = '';
            },
            addFeedbackDermatologist: function()
            {
                console.log(this.ratingDermatologist);
                console.log(this.commentDermatologist);
                client({
                    method:'POST',
                    url: 'feedback/dermatologist',
                    data:{
                        "dermatologistId": this.selectedDermatologist[0].dermatologistId,
                        "dermatologistFullName": "",
                        "averageRating": 0,
                        "yourRating": this.ratingDermatologist,
                        "yourComment": this.commentDermatologist
                    }
                })
                .then((response) => {
                    this.selectedDermatologist[0].averageRating = response.data;
                })
            }
        }
    }
</script>