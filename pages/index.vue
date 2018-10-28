<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title class="headline">Apple Pay Demo</v-card-title>
        <v-card-actions>
          <button class="apple-pay-button" @click="canMakePayment"></button>
        </v-card-actions>
      </v-card>

      <v-alert :value="errorPresent" type="error">
        {{ error }}
      </v-alert>
    </v-flex>
  </v-layout>
</template>


<script>
import { handleApplePay } from '~/config/payments/applePay'

export default {
  data () {
    return {
      errorPresent: true,
      error: 'Test error.'
    }
  },
  methods: {
    canMakePayment () {
      return handleApplePay()
    }
  }
}
</script>

<style>
.apple-pay-button {
  -webkit-appearance: -apple-pay-button;
  -apple-pay-button-type: plain;
  -apple-pay-button-style: black;
  height: 39px;
  width: 229px;
}
</style>
