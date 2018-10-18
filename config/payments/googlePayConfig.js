export const googlePaymentDataRequest = {
  environment: 'TEST', // Configure to be TEST or PRODUCTION
  apiVersion: 2,
  apiVersionMinor: 0,
  merchantInfo: {
    // A merchant ID is available after approval by Google.
    // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
    merchantId: '01234567890123456789-TESTID',
    merchantName: 'Example Merchant'
  },
  // NOTE: these will need to be biller specific and calculated from the selected biller options on the payment page
  allowedPaymentMethods: [{
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
      allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"]
    },
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      // Check with your payment gateway on the parameters to pass.
      // @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway}
      parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
      }
    }
  }]
};
