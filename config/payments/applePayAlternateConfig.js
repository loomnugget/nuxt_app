// https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778020-onpaymentauthorized
// called when the user has authorized the Apple Pay payment with Touch ID, Face ID, or passcode.
// The onpaymentauthorized function must complete the payment and respond by calling completePayment
// before the 30 second timeout, after which a message appears stating that the payment could not be completed.
// This callback is how we actually get the token to transfer the funds
// This callback is the same as the paymentRequest API
export const onPaymentAuthorized = request => {
  request.onpaymentauthorized = function(event) {
    $.post('/your-payment-processing-url', data)

    .then(response => {
      // Result param: the result of the payment authorization, including its status and list of errors
      const result = response.successful ? ApplePaySession.STATUS_SUCCESS : ApplePaySession.STATUS_FAILURE;
     session.completePayment(result)
   });
  }
}

export const oldSchoolBtnDetect = () => {
  var userAgent = window.navigator.userAgent;
  var isSafari = !!userAgent.match(/Version\/[\d\.]+.*Safari/)
  if (isSafari) self.$applePayBtn.removeClass('hidden');
}

// Example of starting an apple pay session
var request = {
  countryCode: 'US',
  currencyCode: 'USD',
  supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
  merchantCapabilities: ['supports3DS'],
  total: { label: 'Your Merchant Name', amount: '10.00' },
}
var session = new ApplePaySession(3, request);
