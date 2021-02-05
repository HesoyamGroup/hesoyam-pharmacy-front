<template>
    <v-card class="ma-3" flat>
        <v-card-title>Promotions</v-card-title>
        <v-card>
            <v-card-title>
                <v-text-field v-model="newTitle" label="New title" :rules="[titleRule]" counter></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-textarea v-model="newDescription" label="Description" :rules="[descriptionRule]" counter auto-grow></v-textarea>

                <v-menu
                    v-model="showMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="dateRangeText"
                            label="Dates"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>

                    <v-date-picker v-model="newDates" :allowed-dates="isUpcomingDate" range></v-date-picker>
                </v-menu>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="addPromotion()" :disabled="!newPromotionValid" color="green" :dark="newPromotionValid">Add</v-btn>
            </v-card-actions>
        </v-card>

        <template v-if="promotions.length > 0">
            <v-card-subtitle>All promotions</v-card-subtitle>
            <v-card v-for="promotion in promotions" :key="promotion.id" class="mb-2">
                <v-card-title>{{promotion.title}}</v-card-title>
                <v-card-subtitle>by {{promotion.administrator.firstName}} {{promotion.administrator.lastName}}</v-card-subtitle>
                <v-card-text>{{promotion.description}}</v-card-text>
                <v-card-subtitle>
                    <v-chip :color="promotionColor(promotion)" dark><v-icon>mdi-calendar</v-icon></v-chip>
                    {{getDateRangeText(promotion.range)}}
                </v-card-subtitle>
            </v-card>
        </template>
        <v-card-subtitle v-else>There are no promotions in pharmacy.</v-card-subtitle>
    </v-card>
    
</template>

<script>
import {client} from '@/client/axiosClient'
import * as DateFormatter from '@/utils/DateFormatter'

export default {
    name: 'PromotionsPage',
    data: function(){
        return {
            newTitle: '',
            newDescription: '',
            newDates: [],

            titleMaxLength : 100,
            descriptionMaxLength: 350,

            promotions: [],

            showMenu: false,
        }
    },
    mounted(){
        this.fetchPromotions();
    },
    methods:{
        fetchPromotions(){
            client({
                method: 'GET',
                url: '/promotion'
            }).then((response) => {
                this.promotions = response.data;
                for(let p of this.promotions){
                    this.fixDate(p);
                }
            }, (error) => {});
        },
        titleRule(value){
            return value.length <= this.titleMaxLength ? true : 'Max ' + this.titleMaxLength + ' characters';
        },
        descriptionRule(value){
            return value.length <= this.descriptionMaxLength ? true : 'Max ' + this.descriptionMaxLength + ' characters'; 
        },
        getDateRangeText(range){
            return range.from + ' ~ ' + range.to;
        },
        addPromotion(){
            client({
                method: 'POST',
                url: '/promotion',
                data:{
                    title: this.newTitle,
                    description: this.newDescription,
                    range: {
                        from: new Date(this.newDates[0]).toISOString(),
                        to: new Date(this.newDates[1]).toISOString()
                    }
                }
            }).then((response) => {
                let promotion = response.data;
                this.fixDate(promotion);
                this.promotions.push(promotion);
                this.clearFields();
            }, (error) => {
                alert('Error adding promotion');
            })
        },
        isUpcomingDate(value){
            let now = new Date(Date.now());
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return new Date(value) >= today;
        },
        promotionColor(promotion){
            let toDate = new Date(promotion.range.to);
            let now = new Date(Date.now());
            if(new Date(promotion.range.to) >= Date.now())
                return 'green';
            else
                return 'red';
        },
        clearFields(){
            this.newDates = [];
            this.newDescription = '';
            this.newTitle = '';
        },
        fixDate(promotion){
            promotion.range.from = DateFormatter.toJavascriptDate(promotion.range.from);
            promotion.range.to = DateFormatter.toJavascriptDate(promotion.range.to);
        }
    },
    computed:{
        dateRangeText(){
            return this.newDates.join(' ~ ');
        },
        newPromotionValid(){
            return this.newDates.length == 2 && 
                this.newDescription != '' && this.newDescription.length <= this.descriptionMaxLength && 
                this.newTitle != '' && this.newTitle.length <= this.titleMaxLength;
        }
    }
}
</script>