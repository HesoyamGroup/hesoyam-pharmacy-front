<template>
<div>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >

              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>

            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>

            </v-card-text>
            <v-card-actions>
              <v-btn plain color="indigo lighten-1"
              @click="openAppointment(selectedEvent)"
              v-if="available(selectedEvent) && !selectedEvent.disabled">
                Start
              </v-btn>
              <v-btn plain color="error"
              @click="didntShowUp(selectedEvent)"
              v-if="available(selectedEvent) && !selectedEvent.disabled">
                Didn't show up
              </v-btn>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>

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

import {client} from '@/client/axiosClient';

  export default {
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      snackbar: null,
      vertical: false,
      snackbarText: null,
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      role: null,
    }),
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },

      openAppointment: function(selectedEvent){
        var link = '';
        if(localStorage.getItem('user_role') === 'ROLE_PHARMACIST')
          link = '/counseling-report'
        else
          link = '/checkup-report'
        
        const encoded = encodeURI(link + '?patientEmail=' + selectedEvent.patientEmail + '&from=' + selectedEvent.start + '&pharmacy=' + 
        selectedEvent.pharmacy);
        this.$router.push(encoded);
      },
      
      didntShowUp: function(selectedEvent){
        var x = (new Date()).getTimezoneOffset() * 60000; 
        client({
          method: 'POST',
          url: 'appointment/patient-didnt-show',
          data:{
            patientEmail: selectedEvent.patientEmail,
            from: (new Date(new Date(selectedEvent.start) - x)).toISOString().slice(0,-1)
          }
        })
        .then((response) => {
          this.snackbar = true;
          this.snackbarText = response.data;
          this.selectedOpen = false;
        })
        selectedEvent.disabled = true;
      },

      available: function(selectedEvent){
        if(new Date(selectedEvent.start) >= new Date() && selectedEvent.status === 'TAKEN')
          return true;
        else
          return false;
      },

      updateRange ({ start, end }) {
        const events = []
        var fromServer = []

        const min = new Date(`${start.date}T00:00:00`).toISOString();
        const max = new Date(`${end.date}T23:59:59`).toISOString();
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = this.rnd(days, days + 20)

        // for (let i = 0; i < eventCount; i++) {
        //   const allDay = this.rnd(0, 3) === 0
        //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        //   const second = new Date(first.getTime() + secondTimestamp)
        this.role = localStorage.getItem('user_role');
        
        var link = '';

        if(this.role === 'ROLE_PHARMACIST'){
          link = 'appointment/appointments-for-pharmacist/' + min + "!" + max; 
        } else {
          link = 'appointment/appointments-for-dermatologist/' + min + "!" + max;
        }

          client({
            method: 'GET',
            url: link,
          })
          .then((response) => {
            fromServer = response.data;
            for(var event of response.data){
              events.push({
                patientEmail: event.patientEmail,
                name: event.patientFirstName + ' ' + event.patientLastName,
                start: this.convertToDate(event.from),
                end: this.convertToDate(event.to),
                color: 'indigo',
                timed: null,
                details: event.pharmacyName,
                status: event.appointmentStatus,
                disabled: false,
                pharmacy: event.pharmacyId,
              })
            }
            this.events = events;
          })
      

    },

        // this.events = events
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },

      convertToDate(dateElements){
        const delimiter = "-";
        return dateElements[0] + delimiter + dateElements[1] + delimiter + dateElements[2] + " " + dateElements[3]
          + ":" + dateElements[4]; 
      }
    
    }
  }
</script>