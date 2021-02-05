<template>
    <div fluid class="supplier-basic-info">
        <v-container  fill-height>
            <v-row>
                <v-card>

                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Change basic info</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>

                    </v-card-text>

                </v-card>
            </v-row>
        </v-container>
    </div>

</template>



<script>
    import {client} from '@/client/axiosClient.js';
    export default {
        mounted(){
            client({
                method: 'GET',
                url: '/profile/user-information'
            }).then((response) => {
                this.my_data = response.data;
            });
        },
        data(){
            return {
                my_data: null,
                rules: {
                    passwordRules: [
                        pw => !!pw || 'Password is required.',
                        pw => /^.{8,64}$/.test(pw) || 'Password should have between 8 and 64 characters.',
                    ],
                    confirmPasswordRules: [
                        pw => this.newPassword === pw || "Passwords must match",
                    ],
                    firstNameRules: [
                        fn => !!fn || 'First name is required.',
                        fn => /^[a-z A-Z\.-]{3,75}$/.test(fn) || "First name should have between 2 and 75 characters."
                    ],
                    lastNameRules: [
                        fn => !!fn || 'Last name is required.',
                        fn => /^[a-z A-Z\.-]{3,100}$/.test(fn) || "Last name should have between 3 and 100 characters."
                    ],
                    phoneNumberRules: [
                        num => !!num || 'Phone number is mandatory.',
                        value => (/^\d{10}$/.test(value) || /^(\d{3}[- .]?){2}\d{4}$/.test(value) 
                        || /^((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value)
                        || /^(\+\d{1,3}( )?)?((\(\d{3}\))|\d{3})[- .]?\d{3}[- .]?\d{4}$/.test(value)) || 'Phone number format is not valid.'
                    ],
                    addressLineRules: [
                        add => !!add || 'Address line is mandatory',
                        add => /^.{3,150}$/.test(add) || 'Address line should have between 3 and 15 characters'
                    ],
                    genderRules: [
                        gender => this.form.genders.includes(gender) || 'You must choose a gender'
                    ]
                },

            }
        }
    }
</script>


<style scoped>

</style>