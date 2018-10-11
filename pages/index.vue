<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title class="headline">Apple Pay Demo</v-card-title>
        <v-card-actions>
          <button @click="show" style="-webkit-appearance: -apple-pay-button;"></button>
          <v-btn @click="canMakePayment">Can Make Payment</v-btn>
          <v-btn @click="show">Show</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import { canMakePayment, handleApplePay } from '~/config/payments/payments'

export default {
  methods: {
    show () {
      // Call payment show method here
      console.warn('clicked show')
      return handleApplePay()
    },
    canMakePayment () {
      console.warn('clicked canMakePayment')
      return canMakePayment()
    }
  }
}
</script>
