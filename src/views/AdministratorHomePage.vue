<template>
    <v-card class="ma-auto maincard" flat width="600">
        <v-card-text>
            <v-row>
                <v-col>
                    <v-card to="/profile" color="blue" dark>
                        <v-card-title>Profile</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-account</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card to="/orders" color="purple" dark>
                        <v-card-title>Orders</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-basket</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card to="/promotions" color="green" dark>
                        <v-card-title>Promotions</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-cash-100</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card to="/my-pharmacy" color="red" dark>
                        <v-card-title>My pharmacy</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-hospital-box</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card to="/pharmacists" color="pink" dark>
                        <v-card-title>Pharmacists</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-doctor</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card to="/dermatologists" color="indigo" dark>
                        <v-card-title>Dermatologists</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-doctor</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card to="/vacation-requests" color="cyan" dark>
                        <v-card-title>Vacation<br>requests</v-card-title>
                        <v-card-text>
                            <v-icon size="100">mdi-calendar</v-icon>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col></v-col>
                <v-col></v-col>
            </v-row>
        </v-card-text>
    </v-card>
    
</template>

<script>
export default {
    name: "AdministratorHomePage"
}
</script>

<style scoped>
    .maincard{
        align-self: center;
    }
    .v-btn{
        height: 100px;
        width: 100px;
    }

</style>