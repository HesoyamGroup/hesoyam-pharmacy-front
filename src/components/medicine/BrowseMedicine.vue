<template>
    <div class="browse-medicine-container">
            <v-container class="container">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title> Medicine search </v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-container>
                            <v-form v-model="search.form.isFormValid"> 
                                <v-row>
                                    
                                        <!-- Search part -->
                                        <v-col cols="1" justify="center">
                                            <v-subheader class="font-weight-black px-0 search-header" >
                                                Search
                                            </v-subheader>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="search.form.name" label="Medicine name:" prepend-icon="mdi-pill"> </v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-select :items="search.medicineTypes" v-model="search.form.selectedMedicineType" label="Medicine type" prepend-icon="mdi-medical-bag"> </v-select>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="search.form.minRating" label="Minimum rating" type="number" min="0" v-bind:max="search.form.maxRating" step="0.5" prepend-icon="mdi-star" :rules="search.form.rules.minRatingRules"> </v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="search.form.maxRating" label="Maximum rating:" type="number" v-bind:min="search.form.minRating" max="5" step="0.5" prepend-icon="mdi-star" :rules="search.form.rules.maxRatingRules"> </v-text-field>
                                        </v-col>

                                        <v-col cols="2" align="center">
                                            <v-btn color="gray" @click="resetSearchForm()">Reset</v-btn>

                                            <v-btn color="primary" class="ml-2" @click="searchQueryClicked()" :disabled="!search.form.isFormValid">Search</v-btn>
                                        </v-col>
            
                                </v-row>
                            </v-form>
                            <v-divider class="divider" inset horizontal></v-divider>
                            <v-row>
                                <!-- View part -->
                                <v-container>
                                        <v-data-table :items="medicines" hide-default-footer disable-pagination>

                                            <template v-slot:header="header">
                                                <th>
                                                    Medicine name
                                                </th>
                                                <th>
                                                    Medicine type
                                                </th>

                                                <th>
                                                    Manufacturer name
                                                </th>

                                                <th>
                                                    Prescription mode
                                                </th>

                                                <th>
                                                    Rating
                                                </th>

                                                <th>
                                                    Med. Spec
                                                </th>

                                                <th>
                                                    Find medicine
                                                </th>
                                            </template>
                                            <template v-slot:item="row">
                                                <tr>
                                                    <td>
                                                        <v-layout justify-center>
                                                            {{row.item.name}}
                                                        </v-layout>
                                                    </td>
                                                    <td>
                                                        <v-layout justify-center>
                                                            {{row.item.medicineType}}
                                                        </v-layout>
                                                    </td>
                                                    <td>
                                                        <v-layout justify-center>
                                                            {{row.item.manufacturerName}}
                                                        </v-layout>
                                                    </td>
                                                     <td>
                                                        <v-layout justify-center>
                                                            {{row.item.prescriptionMode}}
                                                        </v-layout>
                                                    </td>
                                                    <td>
                                                        <v-layout justify-center>
                                                            {{row.item.rating}}
                                                        </v-layout>
                                                    </td>
                                                    
                                                    <td>
                                                        <v-layout justify-center>
                                                            <v-btn icon color="primary" large @click="getMedicineSpecificationClicked(row.item)">
                                                                <v-icon>mdi-file-document-outline</v-icon>
                                                            </v-btn>
                                                        </v-layout>
                                                    </td>

                                                    <td>
                                                        <v-layout justify-center>
                                                            <v-btn color="primary" large @click="getPharmaciesWithMedicine(row.item)">
                                                                Find it!
                                                            </v-btn>
                                                        </v-layout>
                                                    </td>
                                                </tr>
                                            </template>


                                            <template v-slot:footer="footer">
                                                <v-container class="footer" >
                                                    <v-row justify="center">
                                                        <v-btn :disabled="!canGoBackPagination" @click="decPage()">Prev</v-btn>
                                                        <v-btn :disabled="!hasMorePagination" @click="incPage()">Next</v-btn>
                                                    </v-row>
                                                </v-container>
                                            </template>
                                        </v-data-table>
                                </v-container>
                            </v-row>
                        </v-container>     
                    </v-card-text>
                </v-card>
            </v-container>

            <v-dialog v-model="medicineSpecificationDialog" max-width="600">
                <v-card>
                    <v-toolbar color="primary">
                        <v-toolbar-title>Medicine specification for 
                        <span v-if="selectedMedicine">{{this.selectedMedicine.name}}
                        ( <span v-if="medicineSpecification">{{medicineSpecification.dosage.quantity}} {{medicineSpecification.dosage.unit}}</span> )</span></v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-container v-if="selectedMedicine">
                            <v-row>
                                <v-subheader class="font-weight-black">
                                    Notes
                                </v-subheader>
                            </v-row>
                            <v-row justify="start" align="start" style="min-height: 5rem">
                                
                                <v-col>
                                       <span v-if="selectedMedicine.notes">
                                            {{selectedMedicine.notes}}
                                       </span>

                                       <span v-else>
                                            No notes for this medicine.
                                       </span>
                                       
                                </v-col>       
                            </v-row>


                            <v-row>
                                <v-col>
                                    <v-list v-if="medicineSpecification">
                                        <v-subheader class="font-weight-black">Contraindications</v-subheader>
                                        <v-list-item  v-for="(item, index) in medicineSpecification.contraindications" v-bind:key="index">
                                            <v-list-item-content>
                                                <v-list-item-title>{{item}}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-col>

                                <v-col>
                                    <v-list v-if="medicineSpecification">
                                        <v-subheader class="font-weight-black">Composition items</v-subheader>
                                        <v-list-item  v-for="(item, index) in medicineSpecification.compositionItems" v-bind:key="index">
                                            <v-list-item-content>
                                                <v-list-item-title>{{item}}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-list v-if="medicineSpecification">
                                            <v-subheader class="font-weight-black">Replacement medicines</v-subheader>

                                            <v-list-item  v-for="(item, index) in medicineSpecification.replacementMedicines" v-bind:key="index">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{item}}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>

                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="medicineSpecificationDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>



             <v-dialog v-model="locateMedicineDialog" max-width="600">
                <v-card>
                    <v-toolbar color="primary">
                        <v-toolbar-title>Pharmacies with: 
                        <span v-if="selectedMedicine">{{this.selectedMedicine.name}}
                        </span></v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-list dense>
                            <v-subheader class="font-weight-black">Pharmacies</v-subheader>
                            <v-subheader v-if="medicineLocations.length == 0">No pharmacies with selected medicine.</v-subheader>
                            <v-list-item-group color="primary" >
                            <v-list-item  v-for="(item, index) in medicineLocations" v-bind:key="index" @click="visitPharmacy(item)">
                                <v-list-item-content>
                                        <v-row>
                                            <v-col>
                                                {{item.name}}
                                            </v-col>
                                            <v-col>
                                                <div v-if="item.price.hasDiscount" class="text-decoration-line-through red--text mr-1">{{item.price.currentPrice}}</div>
                                                <div v-if="item.price.hasDiscount" class="green--text" >{{item.price.discountedPrice}}</div>
                                                <div v-if="!item.price.hasDiscount" >{{item.price.currentPrice}}</div>
                                            </v-col>
                                            <v-col>
                                                <span>{{item.address.addressLine}}</span>, <span>{{item.address.city.cityName}}</span>
                                            </v-col>
                                        </v-row>
                                </v-list-item-content>
                            </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-dialog>
    </div>
</template>



<script>
    import {client} from '@/client/axiosClient.js';

    export default {
        name: 'browse-medicine',
        mounted(){
            this.submitSearchQuery();
        },
        data(){
            return {
                search:{
                    medicineTypes: [
                        'POWDER',
                        'PILL',
                        'CAPSULE',
                        'OINTMENT',
                        'GEL',
                        'SYRUP',
                        'SOLUTION',
                    ],
                    form: {
                        isValidForm: false,
                        selectedMedicineType: null,
                        name: '',
                        minRating: "0",
                        maxRating: "5",
                        rules: {
                            minRatingRules: [
                                rating => (!isNaN(parseFloat(rating)) && rating >= 0 && rating <= 5) || 'Min rating is 1-5 number.',
                                rating => (rating <= this.search.form.minRating) || 'Min rating must be less or equal then max rating'
                            ],
                            maxRatingRules: [
                                rating => (!isNaN(parseFloat(rating)) && rating >= 0 && rating <= 5) || 'Max rating is 1-5 number.',
                                rating => (rating >= this.search.form.minRating) || 'Max rating must be equal or bigger then min rating'
                            ]
                        }
                    }
                    
                },
                selectedMedicine: null,
                medicineSpecificationDialog: false,
                locateMedicineDialog: false,
                medicineSpecification: null,
                medicineLocations: [],
                medicines: [],
                page: 1,
                maxPerPage: 10, //set on backend, since we are not returning pageable object, dumb pagination
            }
        },
        methods: {
            visitPharmacy(item){
                setTimeout(() => { this.$router.push({path: `/pharmacy/${item.id}`})}, 200);
            },
            getMedicineSpecificationClicked(medicine){
                this.selectedMedicine = medicine;
                this.medicineSpecificationDialog = true;
                
                client({
                    method: 'GET',
                    url: `/medicine-spec/id/${this.selectedMedicine.medicineSpecificationId}`
                }).then((response) => {
                    this.medicineSpecification = response.data;
                }, (error) => {
                    console.log('An error occured during medicine specification retrieval.');
                });
            },
            getPharmaciesWithMedicine(medicine){
                this.selectedMedicine = medicine;
                this.locateMedicineDialog = true;

                client({
                    method: 'GET',
                    url: `/pharmacy/medicine-${this.selectedMedicine.id}`
                }).then( (response) => {
                    let response_data = response.data;
                    for(let item of response_data){
                        item.price = {
                            currentPrice: 0,
                            discountedPrice: 0,
                            hasDiscount: false
                        };
                    }
                    this.medicineLocations = response_data;
                    for(let item of this.medicineLocations){
                        client({
                            method: 'GET',
                            url: `medicine/price/${item.id}/${this.selectedMedicine.id}`
                        }).then((response) => {
                            item.price=response.data;
                        });
                    }
                    
                    
                }, (error) => {
                    console.log('An error occured during pharmacy retrievals.');
                })
            },
            resetSearchForm(){
                let form = this.search.form;
                form.name = '';
                form.selectedMedicineType = null;
                form.minRating = 0;
                form.maxRating = 5;
                this.submitSearchQuery();
            },
            searchQueryClicked(){
                this.page = 1;
                this.submitSearchQuery();
            },
            submitSearchQuery(){
                //send api request and load.
                client({
                    method: 'GET',
                    url: 'medicine/search?'+this.getQueryParams()
                }).then((response) => {
                    this.medicines = response.data;
                }, (error) => { 
                    console.log('An error occured during medicine retrieval.');
                })
            },
            getQueryParams(){
                let queryParams = [];
                let form = this.search.form;
                if(form.name){
                    queryParams.push(`name=${form.name}`);
                }
                if(form.selectedMedicineType){
                    queryParams.push(`medicineType=${form.selectedMedicineType}`);
                }
                
                if(form.minRating){
                    queryParams.push(`minRating=${form.minRating}`);
                }

                if(form.maxRating){
                    queryParams.push(`maxRating=${form.maxRating}`);
                }

                if(this.page > 1){
                    queryParams.push(`page=${this.page}`);
                }
                
                return queryParams.join('&');
            },
            incPage(){
                this.page += 1;
                this.submitSearchQuery();
            },
            decPage(){
                this.page -= 1;
                this.submitSearchQuery();
            }
        },
        computed:{
            hasMorePagination(){
                return this.medicines.length >= this.maxPerPage;
            },
            canGoBackPagination(){
                return this.page > 1;
            }
        }
    }
</script>

<style scoped>
    .container{
        width:100%;
        min-height: 30rem;
    }
    .search-header{
        font-size: 1.2rem;
    }
</style>