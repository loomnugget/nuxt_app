import { applePayMethod, googlePayMethod, samsungPayMethod, basicCardPayMethod, paymentDetails } from './paymentRequestConfig';

const paymentMethods = [applePayMethod, googlePayMethod, samsungPayMethod, basicCardPayMethod];

// Is the payment method supported on the device?
// Used for demo purposes, not actual implementation
export const canMakePayment = () => {
  const request = new PaymentRequest([paymentMethods], paymentDetails);

  return request.canMakePayment()
  .then(result => {
    console.log('result', result)
    return result
  })
  .catch(err => {
    console.log('The promise from `paymentRequest.canMakePayment()` was rejected.');
    console.log(`The error message received was: '${err.message}'`);
    console.log(err);
    return err;
  });
}

// Call this function when the branded Apple Pay button is clicked
export const handleApplePay = () => {
  // Check if the Payment Request API is available and fallback if not.
  if (!window.PaymentRequest) return;

  // PaymentRequest returns a promise that resolves to true or false
  const request = new PaymentRequest ([paymentMethods], paymentDetails);
  // After constructing the payment request, ask if the customer can make a
  // payment with apple pay. calling canMakePayment() on the request object
  // returns a promise that resolves to true or false
  if(request.canMakePayment()) {
    // show() should be called on button click - returns a promise that resolves to a
    // PaymentResponse once your customer authorizes payment.
    request.show().then(paymentResponse => {
      console.warn('paymentResponse', paymentResponse)
    })
    .catch(error => {
      console.error('error', error)
    })
  } else {
    console.error('Your browser does not support the payment request API.')
  }

  // Soon after you call show(), Safari dispatches the merchantvalidation event
  // to your PaymentRequest object. The event defines a validationURL attribute
  // representing the Apple URL your server contacts to receive a payment session
  request.onmerchantvalidation = function (event) {
    // Have your server fetch a payment session from event.validationURL.
    // fetchPaymentSession is a placeholder function for where we would call the server
    const sessionPromise = fetchPaymentSession(event.validationURL);
    // Complete must be called
    event.complete(sessionPromise);
  }
  .then(response => {
    const status = processResponse(response);
    response.complete(status);
  })
  .catch(error => {
    console.log(`Error processing payment: ${error}`)
  })
}
