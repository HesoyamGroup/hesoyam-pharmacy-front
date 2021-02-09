<template>
    <div class="admin-medicine">   
        <v-container fill-height>
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>
                                Administrate medicine
                            </v-toolbar-title>
                            <v-spacer> </v-spacer>
                            <v-layout justify-end>
                                <v-btn @click="showAllMedicine()">View all</v-btn>
                            </v-layout>
                        </v-toolbar>

                        <v-card-text>
                            <v-form  v-model="form.isFormValid">
                                <v-container>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-row rows="2">
                                                <v-col>
                                                    <v-text-field v-model="form.medicineName" :rules="form.rules.medicineNameRules" label="Medicine name" prepend-icon="mdi-pill"> </v-text-field>
                                                </v-col>

                                            </v-row>

                                            <v-row> 
                                                <v-textarea v-model="form.medicineNotes" :rules="form.rules.medicineNotesRules" label="Medicine notes" prepend-icon="mdi-alert" no-resize> </v-textarea>
                                            </v-row>


                                            <v-row rows="1">
                                                <v-col cols="5">
                                                    <v-text-field v-model="form.medicineSpecification.quantity" :rules="form.rules.medicineSpecificationRules.quantityRules" type="number" label="Quantity" prepend-icon="mdi-needle" min="0"></v-text-field>
                                                </v-col>

                                                <v-col cols="3">
                                                    <v-select  v-model="form.medicineSpecification.selectedCompositionType" :rules="form.rules.medicineSpecificationRules.compositionTypeRules" :items="form.medicineSpecification.compositionTypes" prepend-icon="mdi-unity"> </v-select>
                                                </v-col>

                                                <v-col cols="4">
                                                    <v-text-field v-model="form.loyaltyPoints" :rules="form.rules.loyaltyPointsRules" type="number" label="Loyalty points" min="0" step="1"> </v-text-field>
                                                </v-col>
                                            </v-row>


                                            <v-row>
                                                <v-col cols="4">
                                                    <v-select v-model="form.selectedMedicineType" :items="form.medicineTypes" :rules="form.rules.medicineTypeRules" prepend-icon="mdi-medical-bag" label="Medicine type"> </v-select>
                                                </v-col>

                                                <v-col cols="4">
                                                    <v-checkbox v-model="form.requiresPrescription" label="Prescription" prepend-icon="mdi-prescription"></v-checkbox>
                                                </v-col>

                                                <v-col cols="4">
                                                    <v-select v-model="form.manufacter" item-text="name" item-value="id" label="Manufacturer" :rules="form.rules.manufacturerRules" :items="form.possibleManufacters" prepend-icon="mdi-ambulance"> </v-select>
                                                </v-col>
                                            </v-row>
                                            
                                        </v-col>

                                        <v-col >
                                            <!--Contraindications-->
                                            <v-list>
                                                <v-list-item-group v-model="form.medicineSpecification.selectedContraindications" multiple color="primary">
                                                    <v-subheader>Contraindications</v-subheader>

                                                    <v-list-item v-for="(item, i) in form.medicineSpecification.possibleContraindications" :key="i" >
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-emoticon-sick</v-icon>
                                                    </v-list-item-icon>

                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="item.name"></v-list-item-title>
                                                    </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>


                                        <v-col >
                                            <v-list>
                                                <v-list-item-group v-model="form.medicineSpecification.selectedMedicineReplacements" multiple color="primary">
                                                    <v-subheader>Replacement medicines</v-subheader>

                                                    <v-list-item v-for="(item, i) in form.medicines" :key="i" >
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-pill</v-icon>
                                                    </v-list-item-icon>

                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="item.name"></v-list-item-title>
                                                    </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>

                                        <v-col>
                                            <v-list>
                                                <v-list-item-group v-model="form.medicineSpecification.selectedCompositionItems" multiple color="primary">
                                                    <v-subheader>Ingredients</v-subheader>

                                                    <v-list-item v-for="(item, i) in form.medicineSpecification.possibleCompositionItems" :key="i" >
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-cannabis</v-icon>
                                                    </v-list-item-icon>

                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="item.name"></v-list-item-title>
                                                    </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>
                                    </v-row>

                                    <v-row rows="2">
                                        <v-spacer> </v-spacer>

                                        <v-btn @click="sendCreateMedicineRequest()" class="confirm-button" color="primary" :disabled="!form.isFormValid">Add medicine</v-btn>
                                    </v-row>
                                </v-container>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="showError" color="red">{{error}}</v-snackbar>
        <v-snackbar v-model="showSuccess" color="green">{{successMessage}}</v-snackbar>
        <v-dialog max-width="1600" v-model="adminMedicine">
            <MedicineAdminControl :refresh="refresh"/>
        </v-dialog>
    </div>

</template>



<script>
    import {client} from '@/client/axiosClient';
    import MedicineAdminControl from './MedicineAdminControl.vue';

    export default{
        name: 'admin-medicine',
        mounted(){
            this.loadRequiredData();
        },
        components: {
            MedicineAdminControl,
        },
        data(){
            return {
                showError: false,
                showSuccess: false,
                error: '',
                successMessage: '',
                refresh: false,
                adminMedicine: false,
                form: {
                    isFormValid: false,
                    medicines: [],
                    medicineName: '',
                    medicineNotes: '',
                    loyaltyPoints: '',
                    possibleManufacters: [],
                    manufacter: null,
                    requiresPrescription: false,
                    medicineTypes: [
                        'POWDER',
                        'PILL',
                        'CAPSULE',
                        'OINTMENT',
                        'GEL',
                        'SYRUP',
                        'SOLUTION'
                    ],
                    selectedMedicineType: null,
                    medicineSpecification: {
                        compositionTypes:[
                            "NO_UNIT",
                            "MG",
                            "G",
                            "ML"
                        ],
                        possibleContraindications: [],
                        selectedContraindications: [],
                        selectedCompositionType: null,
                        possibleCompositionItems: [],
                        selectedCompositionItems: [],
                        selectedMedicineReplacements: [],
                        quantity: null
                    },
                    rules: {
                        medicineNameRules: [
                            medName => !!medName || 'Medicine name is required.',
                            medName => /^.{3,75}$/.test(medName) || 'Medicine name should have between 3 and 75 characters.'
                        ],
                        medicineNotesRules: [
                            medNote => /^.{0,200}$/.test(medNote) || 'Medicine notes should not exceed 200 characters.',
                        ],
                        loyaltyPointsRules: [
                            loyPoint => !!loyPoint || 'Loyalty points amount must be set',
                            loyPoint => (!isNaN(parseInt(loyPoint)) && loyPoint >= 0) || 'Loyalty points must be a non-negative integer',
                        ],
                        medicineTypeRules: [
                            medType => !!medType || 'Medicine type must be selected',
                            medType => this.form.medicineTypes.includes(medType) || 'Selected medicine is not valid.'
                        ],
                        manufacturerRules: [
                            man => !!man || 'You must select a manufacturer',
                        ],
                        medicineSpecificationRules: {
                            quantityRules: [
                                quant => !!quant || 'Quantity is required.',
                                quant => (!isNaN(parseFloat(quant)) && quant > 0) || 'Quantity must be a positive number.',
                            ],
                            compositionTypeRules: [
                                type => !!type || 'Composition type must be selected.',
                                type => this.form.medicineSpecification.compositionTypes.includes(type) || 'Composition type is not valid.'
                            ]
                        }
                    }
                }
            }
        },
        methods: {
            showAllMedicine(){
                this.adminMedicine = true;
            },
            sendCreateMedicineRequest: function(){

                client({
                    method: 'POST',
                    url: '/medicine/create',
                    data: this.getMedicineRequestData()
                }).then( (response) => {
                    this.refresh = !this.refresh;
                    this.showSuccess = true;
                    this.successMessage = 'Successfully created medicine!';
                    this.loadMedicines();
                    this.resetForm();
                }, (error) => {
                    this.showError = false;
                    this.error = 'Make sure you inputed everything correctly.';
                });
            },
            resetForm(){
                    this.form.medicineName = '';
                    this.form.medicineNotes = '';
                    this.form.loyaltyPoints = '';
                    this.form.requiresPrescription = false;
                    this.form.selectedMedicineType = null;
                    this.form.medicineSpecification.selectedCompositionType = null;
                    this.form.medicineSpecification.selectedCompositionItems = [];
                    this.form.medicineSpecification.selectedMedicineReplacements = [];
                    this.form.medicineSpecification.quantity = null;
                    this.form.medicineSpecification.selectedContraindications = [];
                    this.form.manufacter = null;
            },
            getMedicineRequestData: function(){
                return {
                    name: this.form.medicineName,
                    notes: this.form.medicineNotes,
                    loyaltyPoints: this.form.loyaltyPoints,
                    medicineType: this.form.selectedMedicineType,
                    medicineSpecification: {
                        contraindications: this.getContraindications(),
                        compositionItems: this.getCompositionItems(),
                        dosage: this.getDosage(),
                        replacementMedicines: this.getReplacementMedicines()
                    },
                    manufacturer: this.getManufacturer(),
                    prescriptionMode: this.getPrescriptionMode()
                }
            },
            getContraindications: function(){
                const medicineSpecification = this.form.medicineSpecification;
                return this.getItemsOnIdsFromList(medicineSpecification.possibleContraindications, medicineSpecification.selectedContraindications);
            },
            getCompositionItems: function(){
                const medicineSpecification = this.form.medicineSpecification;
                return this.getItemsOnIdsFromList(medicineSpecification.possibleCompositionItems, medicineSpecification.selectedCompositionItems);
            },
            getDosage: function(){
                return{
                    quantity: this.form.medicineSpecification.quantity,
                    unit: this.form.medicineSpecification.selectedCompositionType
                }
            },
            getReplacementMedicines: function(){
                return this.getItemsOnIdsFromList(this.form.medicines, this.form.medicineSpecification.selectedMedicineReplacements)
            },
            getManufacturer: function(){
                for(const id in this.form.possibleManufacters){
                    if(id == (this.form.manufacter-1)){
                        return this.form.possibleManufacters[id]; 
                    }
                }
                return null;
            },
            getPrescriptionMode: function(){
                if(this.form.requiresPrescription){
                    return 'WITH_PRESCRIPTION';
                }
                
                return 'WITHOUT_PRESCRIPTION';
            },
            getItemsOnIdsFromList: function(source_list, id_list){
                var items = []
                for(const key in source_list){
                    for(const id of id_list){
                        if(key == id){
                            items.push(source_list[key]);
                        } 
                    }
                }
                return items;
            },
            loadRequiredData: function(){
                this.loadContraindications();
                this.loadManufacturers();
                this.loadMedicines();
                this.loadCompositionItems();
            },
            loadContraindications(){
                client({
                    method: 'GET',
                    url: '/contraindication/all'
                }).then( (response) => {
                    this.form.medicineSpecification.possibleContraindications = response.data;
                }, (error) => {
                    console.log('Error occured during contraindication retrieval.');
                });
            },
            loadManufacturers(){
                client({
                    method: 'GET',
                    url: '/manufacturer/all'
                }).then( (response) => {
                    this.form.possibleManufacters = response.data;
                }, (error) => {
                    console.log('Error occured during manufacters retrieval.');
                });
            },
            loadMedicines(){
                client({
                    method: 'GET',
                    url: '/medicine/all'
                }).then( (response) => {
                    this.form.medicines = response.data;
                }, (error) => {
                    console.log('Error occured during medicine retrieval.');
                });
            },
            loadCompositionItems(){
                client({
                    method: 'GET',
                    url: '/composition-item/all'
                }).then( (response) => {
                    this.form.medicineSpecification.possibleCompositionItems = response.data;
                }, (error) => {
                    console.log('Error occured during composition items retrieval.');
                });
            }

        }
    }

</script>

<style scoped>
    .v-list{
        height:20rem;
        overflow-y:auto
    }

    .confirm-button{
        width: 10rem;
    }
</style>