<template>
    <div class="eprescription-control">
        <v-container fluid fill-height>
            <v-row justify="center" class="mt-6">
                <v-card :elevation="5" height="100%" width="50%" class="justify-center">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>E-Prescription</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text >
                        <v-container>
                            <v-row rows="4">
                                <v-file-input v-model="qrCode"  accept="image/*" label="QR code upload" prepend-icon="mdi-camera"></v-file-input>
                                <v-btn @click="uploadImage()">Submit</v-btn>
                            </v-row>
                                <v-divider> </v-divider>
                            <v-row rows="8" justify="center">
                                <v-layout child-flex>
                                    <v-data-table :headers="headers" :items="filteredPharmacies"  class="mt-6">
                                        <template v-slot:item="row">
                                            <tr>
                                                <td>
                                                    <v-layout>
                                                        {{row.item.name}}
                                                    </v-layout>
                                                </td>
                                                <td>
                                                    <v-layout>
                                                        {{row.item.address.addressLine}}
                                                    </v-layout>
                                                </td>
                                                <td>
                                                    <v-layout>
                                                        {{row.item.address.city.cityName}}
                                                    </v-layout>
                                                </td>
                                                <td>
                                                    <v-layout>
                                                        <div v-if="row.item.price != row.item.discountedPrice" class="text-decoration-line-through red--text mr-1">{{row.item.price}}</div>
                                                        <div v-if="row.item.price == row.item.discountedPrice">{{row.item.price}}</div>
                                                        <div v-if="row.item.price != row.item.discountedPrice" class="green--text">  {{row.item.discountedPrice}}</div>
                                                    </v-layout>
                                                </td>

                                                <td>
                                                    <v-layout>
                                                        <v-progress-circular :rotate="-90" :size="30" :value="row.item.rating * 20" :color="getColor(row.item.rating)">
                                                            {{ row.item.rating }}
                                                        </v-progress-circular>
                                                    </v-layout>
                                                </td>
                                                <td>
                                                    <v-layout>
                                                        <v-btn icon color="primary" @click="completeEPrescription(row.item)">
                                                            <v-icon>mdi-cash-100</v-icon>
                                                        </v-btn>
                                                    </v-layout>
                                                </td>

                                                
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-layout>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>  

                
            </v-row>
        </v-container>

        <v-snackbar v-model="showError" :timeout="3000" color="red">{{error}}</v-snackbar>
        <v-snackbar v-model="showSuccess" :timeout="3000" color="green">Successfully completed. Check your email.</v-snackbar>
    </div>
</template>

<script>
    import {client} from '@/client/axiosClient.js';
    export default {
        data(){
            return {
                qrCode: null,
                headers: [
                    {
                        text: 'Name',
                        value:'name'
                    },
                    {
                        text:'Address line',
                        value:'address.addressLine'
                    },
                    {
                        text: 'City',
                        value: 'address.city.cityName'
                    },
                    {
                        text:'Price',
                        value:'price'
                    },
                    {
                        text:'Rating',
                        value:'rating'
                    },
                    {
                        text: 'Buy',
                        sortable:false
                    }
                ],
                pharmacies: [],
                error: '',
                showError: false,
                showSuccess: false
            }
        },
        methods:{
            completeEPrescription(eprescription){
                client({
                    method: 'post',
                    url: 'eprescription/complete',
                    data: {
                        pharmacyId: eprescription.id,
                        prescriptionId: eprescription.eprescriptionId
                    }
                }).then( (response) => {
                    this.pharmacies = [];
                    this.qrCode = null;
                    this.showSuccess = true;
                }, (error) => {
                    if(error.response.status == 400) this.error="It seems like pharmacy no longer can provide this medicine for you.";
                    else if(error.response.status == 404) this.error="It seems your prescription is already completed.";
                    else this.error="Hmm, unknown error. Try again..";
                    this.showError=true;
                    setTimeout( () =>{
                        this.showError = false;
                    }, 2500);
                })
            },
            uploadImage(){
                const formData = new FormData();
                formData.append('file',this.qrCode);
                this.pharmacies = [];
                client({
                    method: 'POST',
                    url: '/eprescription/upload',
                    data: formData
                }).then((response) => {
                    this.pharmacies = response.data;
                }, (error) => {
                    if(error.response.status == 400) this.error='We couldn\'t read your QR code, try again.';
                    else if(error.response.status == 404) this.error='Prescription is already completed or you uploaded wrong QR code';
                    else this.error="Hmm, unknown error. Try again..";
                    this.showError = true;
                    setTimeout( () => {
                        this.showError = false;
                    }, 2500)
                });
            },
            getColor(rating){
                if(rating >= 4) return 'green';
                else if(rating >= 2) return 'orange';
                else return 'red';
            }
        },
        computed: {
            filteredPharmacies(){
                return this.pharmacies;
            }
        }
    }
</script>


<style scoped>

</style>