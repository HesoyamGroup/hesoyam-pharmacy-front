<template>
<div class="login-component">
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar>
                </v-card>

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
                    <v-btn :disabled="!form.isFormValid" @click="sendLoginRequest" color="primary">Login</v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-container>
</div>
</template>


<script>

export default {
    name: 'Login',
    data: function(){
        return {
            form: {
                email: '',
                password: '',
                isFormValid: false
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
        sendLoginRequest: function(){
            this.axios({
                method: 'post',
                url: 'http://localhost:55555/auth/login',
                data: {
                    email: this.form.email,
                    password: this.form.password
                }
            }).then( (response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            })
        }
    }
}

</script>

<style scoped>
    .login-component{
        height: 500px;
        display:flex;
        align-items: center;
    }
</style>