import { googlePaymentDataRequest } from './googlePayConfig';

export const canMakeGooglePayPayment = () => {
  if (window.PaymentRequest) {
    const request = createPaymentRequest();
    // canMakePayment() PaymentRequest object determines if we can make a payment before calling show().
    // It returns a Promise resolves to true if the user agent supports any of the payment methods
    // supplied to the constructor, and false if none are supported -
    // could be useful for showing different buttons
    request.canMakePayment()
    .then(result => {
      console.log(result)
      if (result) {
        console.log('canMakePayment success!', result)
        // Display PaymentRequest dialog on interaction with the existing checkout button
        document.getElementById('googlePayBtn').addEventListener('click', onBuyClicked);
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
    .catch(function(err) {
      console.log('show() error! ' + err.name + ' error: ' + err.message);
    });
  }
}

// Returns a PaymentRequest promise
function createPaymentRequest() {
  // Add support for the Google Pay API.
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
