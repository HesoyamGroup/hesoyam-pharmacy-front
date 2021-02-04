<template>
    <div class="storage-view">
        <v-container fluid fill-height>
            <v-row class="fill-height">
                <v-col>
                    <v-card :elevation="5" height="100%">
                        <v-toolbar dark color="primary" >
                            <v-toolbar-title>My storage</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon color="green accent-3" large @click="addMedicineDialog()">
                                <v-icon>mdi-hospital</v-icon>
                            </v-btn>
                        </v-toolbar>


                        <v-card-text>
                            <v-data-table :items="items" hide-default-footer disable-pagination>
                                <template v-slot:header="header">
                                    <th>
                                        Medicine name
                                    </th>

                                    <th>
                                        Currently in stock
                                    </th>

                                    <th>
                                        Reserved
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Edit stock
                                    </th>

                                    <th>
                                        Delete
                                    </th>
                                </template>

                                <template v-slot:item="row">
                                    <tr>
                                        <td>
                                            <v-layout justify-center>
                                                {{row.item.medicine.name}}
                                            </v-layout>
                                        </td>

                                        <td>
                                            <v-layout justify-center>
                                                {{row.item.stock}}
                                            </v-layout>
                                        </td>
                                        <td>
                                            <v-layout justify-center>
                                                {{row.item.reserved}}
                                            </v-layout>
                                        </td>
                                        <td>
                                            <v-layout justify-center>
                                                {{row.item.medicine.medicineType}}
                                            </v-layout>
                                        </td>

                                        <td>
                                            <v-layout justify-center>
                                                <v-btn icon @click="editMedicineStock(row.item)">
                                                    <v-icon>mdi-wrench</v-icon>
                                                </v-btn>
                                            </v-layout>
                                        </td>

                                        <td>
                                            <v-layout justify-center>
                                                <v-btn :disabled="row.item.reserved > 0" color="primary" @click="deleteInventoryItem(row.item)">
                                                    Delete
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
                        </v-card-text>
                    </v-card>                   
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="editStock" max-width="500px" persistent>
            <v-form v-model="isFormValid">
                <v-card>
                    <v-toolbar>
                        <v-toolbar-title>
                            Edit stock information for <span v-if="editedMedicine">{{editedMedicine.medicine.name}} </span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container v-if="editedMedicine">
                            <v-text-field disabled label="Medicine name" :value="editedMedicine.medicine.name"></v-text-field>
                            <v-text-field disabled label="Medicine type" :value="editedMedicine.medicine.medicineType"></v-text-field>
                            <v-text-field label="New stock value" v-model="editedMedicine.stock" type="number" :min="editedMedicine.reserved" :rules="rules.minStock"> </v-text-field>
                        </v-container>
                    </v-card-text>


                    <v-card-actions>
                        <v-spacer> </v-spacer>
                        <v-btn :disabled="disableUserInteraction" color="gray" @click="cancelEdit()">
                            Cancel
                        </v-btn>

                        <v-btn :disabled="disableUserInteraction || !isFormValid" color="primary" @click="submitChanges()">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-dialog v-model="addItem" max-width="500px" max-height="700px">
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>
                        Add new medicines to inventory
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-data-table :items="medicinesToAdd" hide-default-footer disable-pagination>
                        <template v-slot:header="header">
                            <th>
                                Medicine name
                            </th>

                            <th>
                                Add
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
                                        <v-btn icon color="green accent-3" @click="addMedicine(row.item)">
                                            <v-icon>mdi-plus-circle</v-icon>
                                        </v-btn>
                                    </v-layout>
                                </td>
                            </tr>
                        </template>


                        <template v-slot:footer="footer">
                            <v-container class="footer" >
                                <v-row justify="center">
                                    <v-btn :disabled="!canGoBackMedicinePagination" @click="decMedicinePage()">Prev</v-btn>
                                    <v-btn :disabled="!hasMoreMedicinePagination" @click="incMedicinePage()">Next</v-btn>
                                </v-row>
                            </v-container>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="addMedicineError">An error occured while trying to add medicine. </v-snackbar>


    </div>

</template>


<script>
    import {client} from '@/client/axiosClient.js';
    export default{
        name: 'storage-view',
        mounted(){
            this.refreshMyInventoryItems();
        },
        props: ['update'],
        data(){
            return {
                items: [],
                page: 1,
                maxPerPage: 8, //set on backend, since we are not returning pageable object, dumb pagination
                editedMedicine: null,
                backupedMedicine: {},
                editStock: false,
                addItem: false,
                disableUserInteraction: false,
                rules: {
                    minStock: [
                        minStock => !!minStock || 'Stock must be set.',
                        minStock => ( (this.editedMedicine == null || this.editedMedicine == {}) || minStock >= this.editedMedicine.reserved) || 'Min stock cannot go below reserved value',
                    ]
                },
                isFormValid: true,
                medicinesToAdd: [],
                medicinePage: 1,
                maxPerMedicinePage: 8,
                addMedicineError: false
            }
        },
        methods: {
            addMedicine(med){
                this.addMedicineError = false;
                client({
                    method: 'POST',
                    url: 'storage/my/add',
                    data: {
                        medicine: {
                            id: med.id
                        }
                    }
                }).then((response) => {
                    this.addItem = false;
                    this.refreshUnadded();
                    this.refreshMyInventoryItems();
                }, (error) => {
                    this.addMedicineError = true;
                    setTimeout(() => this.addMedicineError = false, 3000);
                });
            },
            refreshUnadded(){
                client({
                    method: 'GET',
                    url: `storage/my/unadded?page=${this.medicinePage}`
                }).then ((response) => {
                    this.medicinesToAdd = response.data;
                }, (error) => {
                    console.log('An error occured during retrieving unadded medicine.');
                })
            },
            refreshMyInventoryItems(){
                client({
                    method: 'GET',
                    url: `/storage/my?page=${this.page}`
                }).then( (response) => {
                    this.items = response.data;
                }, (error) => {
                    console.log('An error occured during retrieving of your storage');
                });
            },
            addMedicineDialog(){
                this.addItem = true;
                this.refreshUnadded();
            },
            editMedicineStock(medicine){
                this.editStock = true;
                Object.assign(this.backupedMedicine, medicine);
                this.editedMedicine = medicine;
            },
            cancelEdit(){
                this.editStock = false;
                Object.assign(this.editedMedicine, this.backupedMedicine);
            },
            deleteInventoryItem(item){
                client({
                    method: 'DELETE',
                    url: `/storage/my/delete/${item.id}`
                }).then( (response) => {
                    this.items = this.items.filter((it) => it.id != item.id);
                }, (error) => {
                    console.log('An error occured while trying to delete an item.');
                });
            },
            submitChanges(){
                this.disableUserInteraction = true;
                client({
                    method: 'POST',
                    url: '/storage/my/update',
                    data:{
                        itemId: this.editedMedicine.id,
                        newQuantity: this.editedMedicine.stock
                    }
                }).then( (response) => {
                    this.disableUserInteraction = false;
                    this.editStock = false;
                }, (error) => {

                });
            },
            incMedicinePage(){
                this.medicinePage += 1;
                this.refreshUnadded();
            },
            decMedicinePage(){
                this.medicinePage -= 1;
                this.refreshUnadded();
            },  
            incPage(){
                this.page += 1;
                this.refreshMyInventoryItems();
            },
            decPage(){
                this.page -= 1;
                this.refreshMyInventoryItems();
            }
        },
        computed:{
            hasMoreMedicinePagination(){
                return this.medicinesToAdd.length >= this.maxPerMedicinePage;
            },
            canGoBackMedicinePagination(){
                return this.medicinePage > 1;
            },
            hasMorePagination(){
                return this.items.length >= this.maxPerPage;
            },
            canGoBackPagination(){
                return this.page > 1;
            }
        },
        watch: {
            'update': function(){
                this.refreshMyInventoryItems();
            }
        }
    }
</script>

<style>
    .storage-view{
        height:100%;
        width:100%;
    }
</style>