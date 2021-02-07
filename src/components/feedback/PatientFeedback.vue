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
                            v-if='selectedDermatologist[0].yourRating == 0.0'>
                            Add Feedback
                            </v-btn>
                            <v-btn
                            color='primary'
                            v-if='selectedDermatologist[0].yourRating > 0.0'>
                            Edit Feedback
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
                    {text:'Your Rating', value:'yourRating'}
                ],
                searchDermatologists: '',
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
            }
        }
    }
</script>