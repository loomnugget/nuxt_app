// https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest
const applePayMethod = {
  supportedMethods: 'https://apple.com/apple-pay',
  data: {
    version: 3, // The Apple Pay version supported on your website.
    merchantIdentifier: "doxo_merchant.com.example" // The merchant identifier you registered with Apple for use with Apple Pay.
  },
};

const googlePayMethod = {
  supportedMethods: 'https://google.com/pay',
  // Config specific to Google Pay
  data: { }
}

const samsungPayMethod = {
  supportedMethods: "https://samsung.com/pay",  // Double-check the actual identifier.
  data: {/* payment-method-specific-data */},
}

const basicCardPayMethod = {
  supportedMethods: "basic-card",  // Double-check the actual identifier.
  data: {/* payment-method-specific-data */},
}

// Example payment details from the payment context
const paymentDetails = {
  total: {
    label: "My Merchant",
    amount: { value: "27.50", currency: "USD" }
  }
};

// Any additional data we would need to collect for transaction
// NOTE: not required
const paymentOptions = {
  requestPayerName: true,
  requestPayerEmail: true,
  requestPayerPhone: true
};

// Is the payment method supported on the device?
export const canMakePayment = () => {
  const allMethods = [applePayMethod, googlePayMethod, samsungPayMethod];

  const request = new PaymentRequest([basicCardPayMethod], paymentDetails);

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

export const handleApplePay = () => {
  // Consider falling back to Apple Pay JS if Payment Request is not available.
  if (!window.PaymentRequest) return;
  const allMethods = [applePayMethod, googlePayMethod, samsungPayMethod];

  const request = new PaymentRequest([basicCardPayMethod], paymentDetails);

  // return request.canMakePayment()
  // const request = new PaymentRequest([applePayMethod, googlePayMethod, samsungPayMethod], paymentDetails);
  // After constructing the payment request, ask if the customer can make a payment with apple pay
  // Returns a promise that resolves to true or false

  // Call show() on button click - returns a promise that resolves to a PaymentResponse once your customer authorizes payment.
  request.show().then(paymentResponse => {
    console.warn('paymentResponse', paymentResponse)
  })
  .catch(error => {
    console.warn('error', error)
  })

  // Soon after you call show(), Safari dispatches the merchantvalidation event to your PaymentRequest object.
  // The event defines a validationURL attribute representing the Apple URL your
  // server contacts to receive a payment session

  // request.onmerchantvalidation = function (event) {
  //   // Have your server fetch a payment session from event.validationURL.
  //   // fetchPaymentSession is a placeholder function for where we would call the server
  //   const sessionPromise = fetchPaymentSession(event.validationURL);
  //   // Complete must be called
  //   event.complete(sessionPromise);
  // }
  // .then(() => {
  //   const response = request.show();
  //   const status = processResponse(response);
  //   response.complete(status);
  // })
  // .catch((e) => {
  //   // handle errors
  // })
}
