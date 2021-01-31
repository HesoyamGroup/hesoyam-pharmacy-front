<template>
    <div class="loyalty-management">
        <v-container fill-height>
            <v-card class="container">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Loyalty system management </v-toolbar-title>
                </v-toolbar>

                <v-card-text >
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-data-table :items="memberships" :items-per-page="5">    
                                    <template v-slot:header="row">
                                        <th>
                                            ID
                                        </th>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            Discount
                                        </th>
                                        <th>
                                            Minimum points
                                        </th>

                                        <th>
                                            Edit
                                        </th>

                                        <th>
                                            <v-btn icon :disabled="config.edit">
                                                <v-icon color="green" large>mdi-plus-box-outline</v-icon>
                                            </v-btn>
                                        </th>
                                    </template>
                                    
                                    <template v-slot:item="row">
                                        <tr>
                                            <td>{{row.item.id}}</td>
                                            <td>{{row.item.name}}</td>
                                            <td>{{row.item.discount}}%</td>
                                            <td>{{row.item.minPoints}}</td>
                                            <td>
                                                
                                                <v-btn color="primary" icon @click="selectMembership(row.item)" :disabled="config.edit">
                                                     <v-icon>mdi-wrench</v-icon>
                                                 </v-btn>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </v-col>

                            <v-divider class="divider" inset vertical></v-divider>

                            

                            <v-col>
                                <v-container>
                                    <v-row rows="1" justify="center">
                                        <v-subheader class="font-weight-black">
                                            Create loyalty account membership.
                                        </v-subheader>
                                    </v-row>

                                    <v-form v-model="membership.form.isValid">
                                        <v-row>
                                            <v-text-field v-model="membership.form.name" label="Membership name: " prepend-icon="mdi-rename-box" :rules="membership.rules.membershipNameRules"> </v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field v-model="membership.form.discount" label="Discount" type="number" min="0" max="100" prepend-icon="mdi-sale" append-icon="mdi-percent" :rules="membership.rules.discountRules"> </v-text-field>
                                        </v-row>

                                        <v-row>
                                            <v-text-field v-model="membership.form.minPoints" label="Minimum points" type="number" min="0" prepend-icon="mdi-sale" append-icon="mdi-percent" :rules="membership.rules.minPointsRules"> </v-text-field>
                                        </v-row>

                                        <v-row>
                                            <v-select v-model="membership.form.loyaltyProgramConfig" :items="config.configs" label="Select configuration" outlined :rules="membership.rules.selectedLoyaltyProgramConfigRules">
                                                    <template slot="selection" slot-scope="data">
                                                        {{ data.item.id }}
                                                    </template>

                                                    <template slot="item" slot-scope="data">
                                                        {{ data.item.id }}
                                                    </template>
                                            </v-select>
                                        </v-row>
                                        
                                        <v-row>
                                            <v-subheader class="red--text" v-if="membership.error">
                                                Name must be unique and membership min points must be unique..
                                        </v-subheader>
                                        </v-row>
                                        <v-row justify="end">
                                            <v-btn :disabled="!membership.form.isValid" color="primary" @click="createMembership()">Create</v-btn>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-col>

                            <v-divider class="divider" inset vertical></v-divider>

                            </v-col cols="3">
                                <v-row>
                                    <v-container>
                                        <v-row>
                                            <v-select v-model="config.selected" :items="config.configs" label="Possible configs" outlined>
                                                <template slot="selection" slot-scope="data">
                                                    {{ data.item.id }}
                                                </template>

                                                <template slot="item" slot-scope="data">
                                                    {{ data.item.id }}
                                                </template>
                                            </v-select>
                                        </v-row>
                                        <v-row>
                                            <v-text-field v-if="config.selected" v-model="config.selected.checkUpPoints" :disabled="!config.edit" label="Checkup points" prepend-icon="plus-circle-multiple-outline" type="number" min="0" :rules="config.rules.pointRules">
                                            </v-text-field>
                                            <v-subheader v-else>
                                                Select a loyalty program config to see data.
                                            </v-subheader>
                                        </v-row>

                                        <v-row>
                                            <v-text-field v-if="config.selected" v-model="config.selected.counselingPoints" :disabled="!config.edit" label="Counseling points" prepend-icon="plus-circle-multiple-outline" type="number" min="0" :rules="config.rules.pointRules"></v-text-field>
                                        </v-row>

                                        <v-row>
                                            <v-subheader v-if="config.disableInteraction">
                                                Saving in progress...
                                            </v-subheader>

                                            <v-subheader v-if="config.errorOccured" class="red--text">
                                                {{config.error}}
                                            </v-subheader>

                                             <v-subheader v-if="config.success" class="green--text">
                                                Successfully edited config.
                                            </v-subheader>
                                        </v-row>
                                        <v-row>

                                            
                                            <v-btn :disabled="!config.edit || config.disableInteraction" @click="cancelEdit()">
                                                Cancel
                                            </v-btn>
                                            <v-btn  v-if="!config.edit" :disabled="!config.selected" color="primary" @click="startEdit()">
                                                Edit
                                            </v-btn>
                                            <v-btn  v-if="config.edit" :disabled="config.disableInteraction" color="primary" @click="updateConfig()">
                                                Save
                                            </v-btn>
                                        </v-row>

                                    </v-container>
                                </v-row>
                            </v-col>

                            
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-container>


        <!--Dialog for editing a membership-->
        <v-dialog v-model="membership.dialog" max-width="600px" persistent
            >
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>Edit membership</v-toolbar-title>
                </v-toolbar>
                <v-card-title>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="membership.edited">

                        <v-row>
                            <v-text-field :disabled="!membership.edit" label="Membership name" v-model="membership.edited.name" :rules="membership.rules.membershipNameRules"> </v-text-field>
                        </v-row>

                        <v-row>
                            <v-text-field :disabled="!membership.edit" v-model="membership.edited.discount" label="Discount percent" type="number" min="0" max="100" :rules="membership.rules.discountRules"> </v-text-field>
                        </v-row>

                        <v-row>
                            <v-text-field :disabled="!membership.edit" v-model="membership.edited.minPoints" label="Minimum points" type="number" min="0" :rules="membership.rules.minPointsRules"> </v-text-field>
                        </v-row>

                        <v-row>
                            <v-subheader class="red--text" v-if="membership.editError">
                                Name must be unique and membership min points must be unique.
                            </v-subheader>
                        </v-row>
                    </v-container>

                </v-card-text>



                <v-card-actions>
                    <v-spacer>
                    </v-spacer>
                    <v-btn v-if="!membership.edit" @click="exitDialog()">
                        Exit
                    </v-btn>
                    <v-btn v-if="membership.edit" :disabled="!membership.edit || membership.disableInteraction" @click="cancelEditMembership()">
                        Cancel
                    </v-btn>
                    <v-btn  v-if="!membership.edit" :disabled="!membership.edited" color="primary" @click="startEditMembership()">
                        Edit
                    </v-btn>
                    <v-btn  v-if="membership.edit" :disabled="membership.disableInteraction" color="primary" @click="updateMembership()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>    


    

</template>


<script>
    import {client} from '@/client/axiosClient.js';

    export default{
        name: 'loyalty-management',
        mounted(){
            client({
                method:'GET',
                url: '/loyalty/membership/all'
            }).then((response) => {
                this.memberships = response.data;
            }, (error) => {
                console.log('Error occured during memberships retrieval.');
            });

            client({
                method: 'GET',
                url: '/loyalty/membership/config/all'
            }).then( (response ) => {
                this.config.configs = response.data;
            }, (error) => {
                console.log('An error occured during config retrievals.');
            });
        },
        data(){
            return {
                memberships: [],
                membership:{
                    form: {
                        isValid: false,
                        name: '',
                        minPoints: '',
                        discount: 0,
                        loyaltyProgramConfig: null
                    },
                    editError: false,
                    dialog: false,
                    edited: null,
                    edit: false,
                    backup: null,
                    editForm: {
                        name: '',
                        discount: 0,
                        minimumPoints: 0
                    },
                    rules: {
                        discountRules: [
                            disc => !!disc || 'Discount must be specified.',
                            disc => (!isNaN(parseFloat(disc)) && disc >= 0 && disc <= 100 ) || 'Discount must be value between 0 and 100.',
                        ],
                        minPointsRules: [
                            min => !!min || 'Minimum points rule must be specified.',
                            min => (!isNaN(parseFloat(min)) && min > 0) || 'Minimum points must be a non-negative number.'
                        ],
                        membershipNameRules: [
                            name => !!name || 'Name must be specified.',
                            name => (name.length >= 2 && name.length <= 75) || 'Membership name should have between 2 and 75 characters.'
                        ],
                        selectedLoyaltyProgramConfigRules: [
                            conf => !!conf || 'Config must be selected'
                        ]
                    }
                },
                config: {
                    configs: [],
                    selected: null,
                    edit: false,
                    backup: null,
                    rules: {
                        pointRules: [
                                point => !!point || 'Points must be specified.',
                                point => (!isNaN(parseFloat(point)) && point > 0) || 'Point value must be a non-negative number.',
                        ],
                    },
                    disableInteraction: false,
                    errorOccured: false,
                    error: '',
                    success: false
                }
            }
        },
        methods: {
            createMembership: function(){
                this.membership.error = false;
                client({
                    method: 'POST',
                    url: '/loyalty/membership/create',
                    data: {
                        name:  this.membership.form.name,
                        minPoints: this.membership.form.minPoints,
                        discount: this.membership.form.discount,
                        loyaltyProgramConfig: this.membership.form.loyaltyProgramConfig
                    }
                }).then( (response) => {
                    this.memberships.push(response.data);
                    this.membership.error = false;
                    this.resetCreateMembershipForm();
                }, (error) => {
                    this.membership.error = true;
                    this.resetCreateMembershipForm();
                });
            },
            resetCreateMembershipForm: function(){
                this.membership.form.name = '';
                this.membership.form.minPoints = 0;
                this.membership.form.discount = 0;
                this.membership.form.loyaltyProgramConfig = null;
            },
            exitDialog(){
                this.membership.dialog = false;
            },
            startEditMembership: function(){
                this.membership.backup = {}
                Object.assign(this.membership.backup, this.membership.edited);
                this.membership.edit = true;
            },
            cancelEditMembership: function(){
                Object.assign(this.membership.edited, this.membership.backup);
                this.membership.edit=false;
            },
            startEdit: function(){
                this.config.backup = {}
                Object.assign(this.config.backup, this.config.selected)
                this.config.edit = true;
            },
            cancelEdit: function(){
                Object.assign(this.config.selected, this.config.backup);
                this.config.edit=false;

            },
            updateMembership(){
                    //do whatever ou need to do
                this.membership.editError = false;
                client({
                    method: 'POST',
                    url: 'loyalty/membership/update',
                    data: this.getMembershipUpdateData()
                }).then( (response) => {
                    
                    this.membership.dialog=false;
                    this.membership.edited = null;
                    this.membership.edit = false; 
                    this.membership.editError = false;
                }, (error) => {
                    this.membership.editError=true;

                    // Object.assign(this.membership.edited, this.membership.backup);
                    // this.membership.dialog=false;
                    // this.membership.edited = null;
                    // this.membership.edit = false;  
                    // this.membership.backup=null;
                });

                
            },
            getMembershipUpdateData: function(){
                let edited = this.membership.edited;
                return {
                    id: edited.id,
                    name: edited.name,
                    discount: edited.discount,
                    minPoints: edited.minPoints,
                    loyaltyProgramConfig: edited.loyaltyProgramConfig
                }
            },
            selectMembership(membership){
                this.membership.dialog = true;
                this.membership.edited = membership;
            },
            updateConfig: function(){
                this.config.disableInteraction = true;
                this.config.error = '',
                this.config.errorOccured = false;
                this.config.success = false;
                client({
                    method: 'POST',
                    url: '/loyalty/membership/config/update',
                    data: this.getUpdateConfigData()
                }).then( (response) => {
                    let newConfig = response.data;
                    let configs = this.config.configs;
                    for(let id in configs){
                        if(configs[id].id == newConfig.id){
                            configs[id] = newConfig;
                            break;
                        }
                    }

                    this.config.disableInteraction = false;
                    this.config.edit = false;
                    this.config.error = '',
                    this.config.errorOccured = false;
                    this.config.success = true;
                }, (error) => {
                    console.log('An error occured during config update.');
                    this.config.disableInteraction = true;
                    this.config.error = 'Bad request.',
                    this.config.errorOccured = true;
                    this.config.success = false;
                });
            },
            getUpdateConfigData: function(){
                return {
                    id: this.config.selected.id,
                    checkUpPoints: this.config.selected.checkUpPoints,
                    counselingPoints: this.config.selected.counselingPoints
                }
            },
            getValuesForMinimumPoints(){
                return this.memberships.map(function (membership) {
                    return membership.minPoints;
                });
            }
            
        },
        watch: {
            'membership.dialog': function(newVal){
                if(!newVal) {
                    this.membership.edited = null;
                    this.membership.backup = null;
                }
            }
        },
        computed: {
            // getValuesForMinimumPoints(){
            //     return this.memberships.map(function (membership) {
            //         return membership.minPoints;
            //     });
            // }
        }
    }
</script>


<style scoped>
    .divider{
        margin: 2rem;
    }
    .container{
        width:100%;
    }
</style>