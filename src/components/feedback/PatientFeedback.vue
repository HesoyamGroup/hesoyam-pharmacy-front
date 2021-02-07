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
                    Fuck you1
                </v-tab-item>
                <v-tab-item>
                    Fuck you2
                </v-tab-item>
                <v-tab-item>
                    Fuck you3
                </v-tab-item>
                <v-tab-item>
                    Fuck you4
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-container>
</div>
</template>

<script>

    export default {
        name:'PatientFeedback',
        data(){
            return{

            }
        }
    }
</script>