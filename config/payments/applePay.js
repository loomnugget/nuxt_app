// Apple Pay requirements
// 1. Must show the button if the user is on a supported device,
//    even if they  don't have an active card enrolled
// 2. Must always show the payment sheet when the 'Pay' button is clicked

// Creating certificates: Demo here: https://github.com/datatrans/apple-pay-web-sample
// 1. Generate domain specific certificates
// 2. Convert session certificate and key to PEM format and store them in rails
// 3. Domain verification file path: .well-known/apple-developer-merchantid-domain-association.txt

// For development
// 1. Generate SSL certificate

// Example certificates
const APPLE_PAY_CERTIFICATE_PATH = './certificates/applePayCert.pem';
const SSL_CERTIFICATE_PATH = './certificates/cert.pem';
const SSL_KEY_PATH = './certificates/key.pem';
const MERCHANT_IDENTIFIER = 'merchant.com.example';
const MERCHANT_DOMAIN = 'example.com';

// TODO: replace merchantID with actual data
const applePayMethod = {
  supportedMethods: 'https://apple.com/apple-pay',
  data: {
    version: 3, // The Apple Pay version supported on your website.
    merchantIdentifier: 'merchant.com.example',
    merchantCapabilities: ['supportsCredit', 'supportsDebit'],
    supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
    countryCode: 'US',
    currencyCode: 'USD'
  },
};

// TODO: replace total and display items with actual data
// NOTE: We can also add modifiers that respond to the payment method
// that the user selects with the payment sheet and update prices based
// on the type of card seleected.
const paymentDetails = {
  total: {
    label: 'Total',
    amount: { value: '27.50', currency: 'USD' }
  },
  displayItems: [
    {
      label: 'Payment to Test Provider',
      amount: { value: '20.00', currency: 'USD' }
    },
    {
      label: 'Delivery Fee',
      amount: { value: '7.50', currency: 'USD' }
    }
  ]
};

// Need to check if the apple pay session is supported (valid device + secure context)
// and the paymentRequestAPI is supported. This should be called any place apple Pay buttons
// using the Payment Request API are supported as well as before initializing payment sheet
export const showApplePayButton = () => {
  const applePaySupported = !!window.ApplePaySession && window.ApplePaySession.canMakePayments();
  const paymentRequestAPISupported = !!window.PaymentRequest;
  const fullySupported = applePaySupported && paymentRequestAPISupported;

  return fullySupported;
}

export const handleClickPayButtonSteps = () => {
 // 1. check for support and show appropriate errors
 // 2. create a new PaymentRequest with merchant data and payment details
 // 3. Check if the user has an active card - request.canMakePayment();
 // 4. Set up request.onmerchantvalidation callback (required by apple) to initialize the Apple Pay session
 // 5. Call show() - this is the PaymentRequest JS API's version of session.begin() which starts the Apple Pay session
 // 6. When safari returns the PaymentResponse object, handle the outcome and if valid, process the token
 // 7. Handle success or fail when the response comes back from our server after processing
}

export const handleApplePay = () => {
  const fullySupported = showApplePayButton()

  // Handle errors that may occur if the Payment Request API is not supported
  if (fullySupported) {
    const request = new PaymentRequest([applePayMethod], paymentDetails);

    // In Safari, when Apple Pay is one of the payment methods, canMakePayment()
    // resolves to true only if your customer has an active card enrolled in Apple Pay.
    // PaymentRequest API's canMakePayment() is the same as ApplePaySession.canMakePaymentsWithActiveCard() in applePayJS API
    // behaves in Apple Pay JS.
    const hasActiveCard = request.canMakePayment();

    // Begin Apple Pay Session docs: https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/requesting_an_apple_pay_payment_session
    // Apple Pay session example: https://github.com/tomdale/apple-pay-merchant-session-server
    // This callback will be called by Apple after show() is called by our
    // client when the user clicks the 'Pay' button and payment sheet is displayed
    // Soon after you call show(), Safari dispatches the merchantvalidation event
    // to your PaymentRequest object. The event defines a validationURL attribute
    // representing the Apple URL your server contacts to receive a payment session
    request.onmerchantvalidation = function (event) {
      // Example object to be sent to Apple's servers from our endpoint defined below
      // Our server has to call this Apple Server endpoint using the validation URL from the client
      // https://<validation URL>/paymentSession
      // Apple expects a POST request in JSON format including the data below
      // Request params: merchantIdentifier, displayName, initiative, initiativeContext
      const options = {
        url: endpointURL, // From the params sent by the client (event.validationUrl)
        cert: merchIdentityCert,
        key: merchIdentityCert,
        method: 'post',
        body:{
          merchantIdentifier: 'merchantId',
          displayName: 'merchantName',
          initiative: 'web',
          // initiativeContext: fully qualified domain name associated with your
          // Apple Pay Merchant Identity Certificate
          initiativeContext: 'user.mysite.com'
        },
        json: true
      }
      // In response to the POST request, your server receives an Apple Pay session object.
      // The session expires after five minutes.
      $.ajax({
        method: 'POST',
        url: 'SESSION_INSTANTIATION_ENDPOINT',
        body: event.validationURL,
        dataType: 'json'
      })
      // NOTE: this is pseudocode only, this doesn't actually work!
      // event.complete param = Apple Pay Session object (merchantSession)
      // returned from apple Pay server - our server needs to return this for the client to use
      .then(merchantSession => {
        event.complete(merchantSession);
      })
      .catch(error => {
        // TODO: handle session validation errors
      })
    }

    // show() should be called on button click - returns a promise that resolves to a
    // PaymentResponse once your customer authorizes payment.
    // Payment response includes any options requested in paymentOptions,
    // paymentMethod id, and details (which include the ApplePay token)
    request.show()
    .then(paymentResponse => {
      // The user filled in the required fields and completed the flow
      // Get the details from `paymentResponse` and complete the transaction.
      // For Apple Pay - the details include the token and any extra data we requested

      // NOTE: after the promise returned from show() is called, the UI shows a spinner
      // while we process the payment. calling paymentResponse.complete() will close the UI
      console.warn('paymentResponse', paymentResponse)

      $.ajax({
        method: 'POST',
        url: 'PAYMENT_PROCESSING_ENDPOINT',
        body: paymentResponse.toJSON(),
        dataType: 'json'
      })

      // we should return apple status code SUCCESS or FAILURE
      // TODO: handle failure scenario
      .then(status => {
        // this is pseudo code
        if (status === 'success') {
          // if successful, the browser closes the UI
          return paymentResponse.complete('success');
        } else {
          // if failed, the browser shows an error in the modal
          return paymentResponse.complete('fail');
        }
        paymentResponse.complete(status);
      })
    })
    .catch(error => {
      // The API threw an error or the user closed the UI
      console.error('error', error)
    })
  } else {
   console.error('Your browser does not support the payment request API.')
  }
}
