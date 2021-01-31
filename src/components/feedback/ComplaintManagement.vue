<template>
    <div fluid class="complaint-management">
        <v-container  fill-height>
            <v-row>
                <v-card>

                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Complaint management</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-data-table :headers="complaints.header" :items="complaints.items" :items-per-page="5"> 
                                        <template v-slot:item="row">

                                            <th>

                                            </th>
                                            <tr>
                                                <td>{{row.item.patientFirstName}} {{row.item.patientLastName}}</td>
                                                <td>{{row.item.patientEmail}}</td>
                                                <td>{{row.item.gender}}</td>
                                                <td>{{row.item.entityName}}</td>

                                                <td> 
                                                    <v-btn color="primary" @click="selectComplaint(row.item)"   elevation="2" icon>
                                                        <v-icon>mdi-select</v-icon>
                                                     </v-btn>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-col>

                                <v-divider inset vertical></v-divider>

                                <v-col>
                                    <v-container>
                                        <v-row>
                                            <v-col>
                                                <v-row rows="2" class="font-weight-black" justify="center">
                                                    Complainant information
                                                </v-row>

                                                <v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-subheader class="font-weight-medium">
                                                                Complainant first name:
                                                            </v-subheader>
                                                        </v-col>

                                                        <v-col>
                                                            <span v-if="complaints.selected">  
                                                                {{complaints.selected.patientFirstName}}
                                                            </span>

                                                            <span v-else>
                                                                Please select a complaint
                                                            </span>
                                                        </v-col>
                                                    </v-row>



                                                    <v-row>
                                                        <v-col>
                                                            <v-subheader class="font-weight-medium">
                                                                Complainant last name:
                                                            </v-subheader>
                                                        </v-col>

                                                        <v-col>
                                                            <span v-if="complaints.selected">  
                                                                {{complaints.selected.patientLastName}}
                                                            </span>

                                                            <span v-else>
                                                                Please select a complaint
                                                            </span>
                                                        </v-col>
                                                    </v-row>


                                                    <v-row>
                                                        <v-col>
                                                            <v-subheader class="font-weight-medium">
                                                                Complainant email:
                                                            </v-subheader>
                                                        </v-col>

                                                        <v-col>
                                                            <span v-if="complaints.selected">  
                                                                {{complaints.selected.gender}}
                                                            </span>

                                                            <span v-else>
                                                                Please select a complaint
                                                            </span>
                                                        </v-col>
                                                    </v-row>

                                                    <v-row>
                                                        <v-col>
                                                            <v-subheader class="font-weight-medium">
                                                                Complainant gender
                                                            </v-subheader>
                                                        </v-col>

                                                        <v-col>
                                                            <span v-if="complaints.selected">  
                                                                {{complaints.selected.patientGender}}
                                                            </span>

                                                            <span v-else>
                                                                Please select a complaint
                                                            </span>
                                                        </v-col>
                                                    </v-row>
                                                </v-row>
                                            </v-col>


                                            <v-col>
                                                <!--Complainee data-->
                                                <v-row rows="2" class="font-weight-black" justify="center">
                                                    Complainee information
                                                </v-row>

                                                <v-row>
                                                    <v-col>
                                                        <v-subheader class="font-weight-medium">
                                                            Complainee information
                                                        </v-subheader>
                                                    </v-col>

                                                    <v-col>
                                                        <span v-if="complaints.selected">  
                                                            {{complaints.selected.entityName}}
                                                        </span>

                                                        <span v-else>
                                                            Please select a complaint
                                                        </span>
                                                    </v-col>
                                                </v-row>



                                                <v-row justify="center">
                                                    <v-dialog
                                                        v-model="complaints.showDialog"
                                                        width="600px"
                                                        >
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-btn
                                                            color="primary"
                                                            dark
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            :disabled="!complaints.selected"
                                                            >
                                                            Show complaint
                                                            </v-btn>
                                                        </template>
                                                        <v-card>
                                                            <v-card-title>
                                                            <span class="headline">Complaint text</span>
                                                            </v-card-title>
                                                            <v-card-text>
                                                                <span v-if="complaints.selected">
                                                                    {{complaints.selected.complaintBody}}
                                                                </span>
                                                                
                                                            </v-card-text>
                                                            <v-card-actions>
                                                            <v-spacer></v-spacer>
                                                            <v-btn
                                                                color="primary"
                                                                text
                                                                @click="complaints.showDialog = false"
                                                            >
                                                                Ok
                                                            </v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                        </v-dialog>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    
                                </v-col>

                                <v-divider inset vertical></v-divider>

                                <v-col>
                                    <v-row rows="1">
                                        <v-subheader class="font-weight-black" justify="center">
                                            <span>
                                                Reply 
                                                <span v-if="complaints.selected">  
                                                    {{complaints.selected.patientFirstName}} {{complaints.selected.patientLastName}}
                                                </span>
                                            </span>
                                        </v-subheader>
                                    </v-row>

                                    <v-row>
                                        <v-textarea v-model="complaints.text" no-resize :rules="complaints.rules.replyRules">

                                        </v-textarea>
                                    </v-row>

                                    <v-row rows="2" justify="end">
                                        <v-btn @click="reply()" :disabled="!complaints.selected" color="primary"> 
                                            Send reply.
                                        </v-btn>
                                    </v-row>


                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card> 
            </v-row>

        </v-container>
    </div>
</template>




<script>
    import {client} from '@/client/axiosClient';

    export default{
        name: 'complaint-management',
        mounted(){
            client({
                method: 'GET',
                url:'/complaint/unanswered'
            }).then( (response) => {
                this.complaints.items = response.data;
            }, (error) => {
                console.log('Error occured during unanswered complaints retrieval.');
            });
        },
        data(){
            return {
                complaints: {
                    showDialog: false,
                    selected: null,
                    items: [],
                    text: '',
                    headers: [
                        {
                            text: 'Complainant',
                        },
                        {
                            text: 'Complainant email'
                        },
                        { 
                            text: 'Complainant gender',
                        },
                        {
                            text: 'Complainee',
                        },
                        {
                            text: "Select"
                        }
                    ],
                    rules: {
                        replyRules: [
                            reply => !!reply || 'Reply must be provided.',
                            reply => (reply.length >= 5 && reply.length <= 400)|| 'Reply length should be between 5 and 400 characters.'
                        ]
                    }
                }
            }
        },
        methods:{
            reply: function(){
                client({
                    method: 'POST',
                    url: '/complaint/reply',
                    data: this.getReplyData()
                }).then((response) => {
                    this.removeSelectedComplaint(this.complaints.selected);
                    this.complaints.text = '';
                }, (error) => {
                    
                });
            },
            getReplyData: function(){
                return {
                    complaintId: this.complaints.selected.id,
                    text: this.complaints.text
                }
            },
            selectComplaint: function(complaint){
                this.complaints.selected = complaint;
            },
            removeSelectedComplaint: function(){
                var complaint = this.complaints.selected;
                var newComplaintList = []
                for(var comp_it of this.complaints.items){
                    if(comp_it.id != complaint.id){
                        newComplaintList.push(comp_it);
                    }
                }
                this.complaints.selected = null;
                this.complaints.items = newComplaintList;
            }
        }
    }

</script>



<style scoped>

</style>