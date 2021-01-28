<template>
<div id="main-container">
        <v-row justify="center" v-if="navigation === 'personal'" class="form-card">
            <v-col
            cols="12"
            sm="10"
            md="8"
            lg="6"
            >
            <v-card ref="form" id='personal-card'>
                <v-card-text>
                <v-btn plain @click="togglePersonalEditing()" color="indigo">Edit information</v-btn>
                <v-text-field
                    ref="name"
                    v-model="name"
                    :rules="[() => !!name || 'This field is required']"
                    :error-messages="errorMessages"
                    label="First Name"
                    placeholder="John"
                    required
                    prepend-icon="mdi-account"
                    :disabled="personalEditingDisabled"
                ></v-text-field>
                <v-text-field
                    ref="surname"
                    v-model="surname"
                    :rules="[() => !!name || 'This field is required']"
                    :error-messages="errorMessages"
                    label="Last Name"
                    placeholder="Doe"
                    required
                    prepend-icon="mdi-account"
                    :disabled="personalEditingDisabled"
                ></v-text-field>
                <v-text-field
                  ref="phone"
                  v-model="phone"
                  :rules="[() => !!phone || 'This field is required!',
                  () => /^.{0,1}\d{10,15}$/.test(phone) || 'Phone number format is not valid.']"
                  :error-messages="errorMessages"
                  label="Phone number"
                  placeholder="Phone number"
                  required
                  prepend-icon="mdi-phone"
                  :disabled="personalEditingDisabled"
                ></v-text-field>
                
                <v-autocomplete
                    ref="country"
                    v-model="country"
                    :rules="[() => !!country || 'This field is required']"
                    :items="countries"
                    label="Country"
                    placeholder="Select..."
                    required
                    prepend-icon="mdi-map-marker"
                    :disabled="personalEditingDisabled"
                ></v-autocomplete>

                <v-autocomplete
                    ref="city"
                    v-model="city"
                    :items="cities"
                    :rules="[() => !!city || 'This field is required', addressCheck]"
                    label="City"
                    placeholder="Select..."
                    required
                    prepend-icon="mdi-city"
                    :disabled="personalEditingDisabled"
                ></v-autocomplete>

                <v-text-field
                    ref="address"
                    v-model="address"
                    :rules="[
                    () => !!address || 'This field is required',
                    () => !!address && address.length <= 25 || 'Address must be less than 25 characters',
                    addressCheck
                    ]"
                    label="Address Line"
                    placeholder="Snowy Rock Pl"
                    counter="25"
                    required
                    prepend-icon="mdi-home-city"
                    :disabled="personalEditingDisabled"
                ></v-text-field>
                </v-card-text>
                <v-divider class="mt-12"></v-divider>
                <v-card-actions>
                <v-btn text @click="resetPersonalForm">
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-slide-x-reverse-transition>
                    <v-tooltip
                    v-if="formHasErrors"
                    left
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        icon
                        class="my-0"
                        v-bind="attrs"
                        @click="resetForm"
                        v-on="on"
                        >
                        <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <span>Refresh form</span>
                    </v-tooltip>
                </v-slide-x-reverse-transition>
                <v-btn
                    color="primary"
                    text
                    @click="submit"
                >
                    Submit
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-col>
        </v-row>
        
        
        <v-row justify="center" v-else>
            <v-col
            cols="12"
            sm="10"
            md="8"
            lg="6"
            >
            <v-card ref="form" id='personal-card' class="form-card">
                <v-card-text>
                <v-btn plain @click="toggleEditing()" color="indigo">Edit information</v-btn>
                <v-text-field :disabled="accountEditingEnabled" v-model="email" :rules="rules.emailRules" name="email" label="Email address" type="text" prepend-icon="mdi-email"> </v-text-field>
                <v-text-field :disabled="accountEditingEnabled && !oldPasswordEditingEnabled" v-model="oldPassword" :rules="rules.passwordRules" name="oldPassword" label="Enter Old Password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                <v-btn plain @click="testPassword()" v-if="!accountEditingEnabled && !oldPasswordEditingEnabled" color="indigo">Test password</v-btn>
                <v-btn plain @click="lockPassword()" v-if="!accountEditingEnabled && oldPasswordEditingEnabled">Cancel editing password</v-btn>
                <v-text-field :disabled="passwordEditingEnabled" v-model="newPassword" :rules="rules.passwordRules" name="newPassword" label="Enter New Password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                <template v-slot:progress>
                <v-progress-linear
                  v-if="custom"
                  :value="progress"
                  :color="color"
                  absolute
                  height="7"
                ></v-progress-linear>
                </template>
                <v-text-field :disabled="passwordEditingEnabled" v-model="confirmPassword" :rules="rules.confirmPasswordRules" name="confirmPassword" label="Confirm password" type="password" prepend-icon="mdi-lock"> </v-text-field>
                </v-card-text>
                <v-divider class="mt-12"></v-divider>
                <v-card-actions>
                <v-btn text @click="resetAccountForm()">
                    Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-slide-x-reverse-transition>
                    <v-tooltip
                    v-if="formHasErrors"
                    left
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        icon
                        class="my-0"
                        v-bind="attrs"
                        @click="resetForm"
                        v-on="on"
                        >
                        <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <span>Refresh form</span>
                    </v-tooltip>
                </v-slide-x-reverse-transition>
                <v-btn
                    color="primary"
                    text
                    @click="submit"
                >
                    Submit
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-col>
        </v-row>


    <v-bottom-navigation v-model="navigation" id="bottom-nav" shift hide-on-scroll fixed class="bottom-nav">
        <v-btn value="account">
        <span>Account</span>

        <v-icon color='indigo lighten-2'>mdi-account</v-icon>
        </v-btn>

        <v-btn value="personal">
        <span>Personal</span>

        <v-icon color='indigo lighten-2'>mdi-heart</v-icon>
        </v-btn>

    </v-bottom-navigation>

    <v-snackbar
      v-model="snackbar"
      :vertical="vertical"
      light
      timeout="2000"
    >
      {{snackbarText}}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="indigo"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>



<script>
  export default {
    data: () => ({
      countries: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', `Timor L'Este`, 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
      errorMessages: '',
      navigation: 'account',
      name: null,
      surname: null,
      address: null,
      city: null,
      cities: ['Novi Sad', 'Beograd'],
      phone: null,
      country: null,
      nameBackup: null,
      surnameBackup: null,
      addressBackup: null,
      cityBackup: null,
      phoneBackup: null,
      countryBackup: null,
      formHasErrors: false,
      editingEnabled: false,
      accountEditingEnabled: true,
      passwordEditingEnabled: true,
      oldPassword: null,
      oldPasswordEditingEnabled: false,
      activePassword: 'Test123!',
      activePasswordBackup: null,
      newPassword: null,
      confirmPassword: null,
      email: 'test123@gmail.com',
      emailBackup: null,
      snackbar: false,
      snackbarText: null,
      shouldBackup: true,
      shouldBackupPersonal: true,
      personalEditingDisabled: true,
      rules: {
                    emailRules: [
                        em => !!em || 'E-mail is required.',
                        em => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(em) || 'E-mail must be valid',
                    ],
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

    }),

    computed: {
      form () {
        return {
          name: this.name,
          surname: this.surname,
          address: this.address,
          city: this.city,
          state: this.state,
          zip: this.zip,
          email: this.email,
          newPassword: this.newPassword,
          navigation: this.navigation,
          country: this.country,
                genders: [
                        'MALE',
                        'FEMALE',
                        'OTHER',
                        'DONT_SAY'
                ],
          progress () {
            return Math.min(100, this.newPassword.length * 10)
          },
          color () {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
          },
        }
      },
    },

    watch: {
      name () {
        this.errorMessages = ''
      },
    },

    methods: {
      backupData: function(){
        this.emailBackup = this.email;
        this.activePasswordBackup = this.activePassword;
      },

      backupDataPersonal: function(){
        this.nameBackup = this.name;
        this.surnameBackup = this.surname;
        this.phoneBackup = this.phone;
        this.countryBackup = this.country;
        this.cityBackup = this.city;
        this.addressBackup = this.address;
      },

      togglePersonalEditing: function(){
        this.personalEditingDisabled = !this.personalEditingDisabled;
        if(shouldBackupPersonal)
          this.backupDataPersonal;
        this.shouldBackupPersonal = false;
      },

      addressCheck () {
        this.errorMessages = this.address && !this.name
          ? `Hey! I'm required`
          : ''

        return true
      },
      lockPassword: function(){
          this.oldPasswordEditingEnabled = false;
          this.passwordEditingEnabled = true;
          this.oldPassword = null;
      },
      testPassword: function(){
          if(this.oldPassword === this.activePassword){
              this.passwordEditingEnabled = false;
              this.oldPasswordEditingEnabled = true;
              
          } else {
              this.snackbarText = "Password is incorrect!";
              this.snackbar = true;
          }
      },
      resetAccountForm: function() {
        this.errorMessages = []
        this.formHasErrors = false

        this.resetPasswordFields();

        this.oldPassword = null;
        this.email = this.emailBackup;
        this.activePassword = this.activePasswordBackup;

        this.accountEditingEnabled = !this.accountEditingEnabled;
      },
      
      resetPersonalForm: function() {
        this.errorMessages = []
        this.formHasErrors = false

        this.name = this.nameBackup;
        this.surname = this.surnameBackup;
        this.phone = this.phoneBackup;
        this.country = this.countryBackup;
        this.city = this.cityBackup;
        this.address = this.addressBackup;

        this.personalEditingDisabled = !this.personalEditingDisabled;
      },

      resetPasswordFields: function(){
        this.newPassword = null;
        this.confirmPassword = null;
        this.oldPasswordEditingEnabled = ! this.oldPasswordEditingEnabled;
        this.passwordEditingEnabled = !this.passwordEditingEnabled;
      },

      toggleEditing: function(){
        this.accountEditingEnabled = !this.accountEditingEnabled;
        if(this.shouldBackup){
          this.backupData();
        }
        this.shouldBackup = false;
      },

      submit () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })
      },
    },
  }
</script>

<style scoped>
    .form-card{
        overflow-y: scroll;
        margin-bottom: 20%;
    }
</style>
