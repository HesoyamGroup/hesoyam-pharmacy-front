<template>
     <div class="change-pass-container">
        <v-container fluid fill-height>
            <v-row class="fill-height">
                <v-col>
                    <v-form v-model="formValid">
                        <v-card :elevation="5" height="100%">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>First login password change </v-toolbar-title>
                            </v-toolbar>
                        
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-text-field disabled v-model="email" prepend-icon="mdi-email"> </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field disabled v-model="currentPassword" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="newPassword" :rules="passwordRules" label="New password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="confirmNewPassword" :rules="confirmPasswordRules" label="Confirm new password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer> </v-spacer>
                                <v-btn color="gray" @click="closeDialog()"> Cancel </v-btn>
                                <v-btn color="primary" :disabled="!formValid" @click="submitDialog()">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<script>
    import {client} from '@/client/axiosClient.js';

    export default{
        name: 'required-change-pass',
        props:['currentPassword', 'email'],
        data(){
            return {
                formValid: false,
                newPassword: '',
                confirmNewPassword: '',
                passwordRules: [
                    pw => !!pw || 'Password is required.',
                    pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                ],
                confirmPasswordRules: [
                    pw => this.newPassword === pw || "Passwords must match",
                ],
            }
        },
        methods:{
            submitDialog(){
                client({
                    method: 'POST',
                    url: '/auth/change-pass',
                    data: {
                        email: this.email,
                        oldPassword: this.currentPassword,
                        newPassword: this.newPassword,
                        confirmNewPassword: this.confirmNewPassword
                    }
                }).then((response) => {
                    this.$emit('updatePass', this.newPassword);
                    this.closeDialog();
                });
                
                
            },
            closeDialog(){
                this.formValid = false;
                this.newPassword = '';
                this.confirmNewPassword = '';
                this.$emit('closeChangePass');
            }
        }
    }
</script>


<style scoped>

</style>