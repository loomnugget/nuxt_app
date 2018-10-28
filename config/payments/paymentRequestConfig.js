// https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest
export const applePayMethod = {
  supportedMethods: 'https://apple.com/apple-pay',
  data: {
    version: 3, // The Apple Pay version supported on your website.
    merchantIdentifier: "merchant.com.example" // The merchant identifier you registered with Apple for use with Apple Pay.
  },
};

export const googlePayMethod = {
  supportedMethods: 'https://google.com/pay',
  // Config specific to Google Pay
  data: { }
}

export const samsungPayMethod = {
  supportedMethods: "https://samsung.com/pay",  // Double-check the actual identifier.
  data: {/* payment-method-specific-data */},
}

export const basicCardPayMethod = {
  supportedMethods: "basic-card",  // Double-check the actual identifier.
  data: {/* payment-method-specific-data */},
}

// Example payment details from the payment context
export const paymentDetails = {
  total: {
    label: "My Merchant",
    amount: { value: "27.50", currency: "USD" }
  }
};

// Any additional data we would need to collect for transaction
// NOTE: not required
export const paymentOptions = {
  requestPayerName: true,
  requestPayerEmail: true,
  requestPayerPhone: true
};
