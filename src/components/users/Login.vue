<template>
<div class="login-component">
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form v-model="form.isFormValid">
                            <v-text-field v-model="form.email" :rules="rules.emailRules" prepend-icon="mdi-email" name="email" label="Email" type="text">
                            </v-text-field>
                            <v-text-field v-model="form.password" :rules="rules.passwordRules" prepend-icon="mdi-lock" name="password" label="Password" type="password">
                            </v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer> </v-spacer>
                        <v-subheader v-if="form.login.unsuccessful" class="red--text">{{loginError}}</v-subheader>
                        <v-subheader v-if="form.login.successful" class="green--text">Login successful. You will be redirected in a second.</v-subheader>
                        <v-btn :disabled="!form.isFormValid" @click="sendLoginRequest" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="showChangePass" persistent  max-width="500px">
            <ChangePass :email="form.email" :currentPassword="form.password"/>
        </v-dialog>
    </v-container>
</div>
</template>


<script>

import {client} from '@/client/axiosClient';
import ChangePass from './ChangePass.vue';

export default {
    name: 'Login',
     components: {
            ChangePass
     },
    data: function(){
        return {
            showChangePass: false,
            loginError: '',
            form: {
                
                email: '',
                password: '',
                isFormValid: false,
                login: {
                    successful: false,
                    unsuccessful: false
                }
            },
            rules: {
                emailRules: [
                    em => !!em || 'E-mail is required.',
                    em => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(em) || 'E-mail must be valid',
                ],
                passwordRules: [
                    pw => !!pw || 'Password is required.',
                    pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                ],
            }
        }
    },
    methods: {
        sendUpdatedLoginRequest(newPassword){
            this.form.password = newPassword;
            this.sendLoginRequest();
        },
        sendLoginRequest: function(){
            this.resetLoginStatus();
            client({
                method: 'post',
                url: 'auth/login',
                data: {
                    email: this.form.email,
                    password: this.form.password
                }
            }).then( (response) => {
                this.saveTokenDataToLocalStorage(response.data);
                this.form.login.successful = true;
                if(localStorage.user_role === 'ROLE_PHARMACIST' || localStorage.user_role === 'ROLE_DERMATOLOGIST'){
                    setTimeout(() => { this.$router.push({path: '/home-employee'})}, 2000);    
                }
                setTimeout(() => { this.$router.push({path: '/'})}, 2000);
            }, (error) => {
                if(error.response.status == '428'){
                    this.showChangePass = true;
                }else if(error.response.status=='401'){
                    this.form.login.unsuccessful = true;
                    this.loginError = 'Check your email for activation link';
                }else{
                    this.form.login.unsuccessful = true;
                    this.loginError = 'Wrong username/password';
                }
                
            })
        },
        saveTokenDataToLocalStorage: function(response){
            localStorage.user_role = response.data.role;
            localStorage.user_token = response.data.token;
            localStorage.user_token_expires = response.data.expiresIn;
        },
        resetLoginStatus: function(){
            this.form.login.successful = false;
            this.form.login.unsuccessful = false;
        }
    }
}

</script>

<style scoped>
    .login-component{
        padding: 2rem;
        display:flex;
        align-items: center;
    }
</style>