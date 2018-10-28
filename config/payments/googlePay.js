import { googlePaymentDataRequest } from './googlePayConfig';

export const canMakeGooglePayPayment = () => {
  if (window.PaymentRequest) {
    // canMakePayment() PaymentRequest object determines if we can make a payment before calling show().
    // It returns a Promise resolves to true if the user agent supports any of the payment methods
    // supplied to the constructor, and false if none are supported - useful for showing different buttons
    const request = createPaymentRequest();
    request.canMakePayment()
    .then(result => {
      if (result) {
        // show relevant button
      }
    })
    .catch(err => {
      console.log('canMakePayment() error! ' + err.name + ' error: ' + err.message)
    });
  } else console.log('PaymentRequest API not available.');
}

export const showPaymentSheet = () => {
  if (window.PaymentRequest) {
    createPaymentRequest()
    .show()
    .then(response => {
      response.complete('success'); // Dismiss payment dialog.
      const jsonResponse = JSON.stringify(response.toJSON(), null, 2);

      console.log('Success Response', jsonResponse)
    })
    .catch(err => {
      console.log('show() error! ' + err.name + ' error: ' + err.message);
    });
  }
}

// Returns a PaymentRequest promise
function createPaymentRequest() {
  const methodData = [
    {
      supportedMethods: 'https://google.com/pay', // Supported in Chrome for Android only
      data: googlePaymentDataRequest
    },
    {
      supportedMethods: 'basic-card' // Supported on desktop
    }
  ];

  const details = {
    total: {label: 'Test Purchase', amount: {currency: 'USD', value: '1.00'}}
  };

  const options = {
    requestPayerEmail: true,
    requestPayerName: true
  };

  return new PaymentRequest(methodData, details, options);
}
