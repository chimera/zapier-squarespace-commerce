const perform = (z, bundle) => {
  const options = {
    url: `https://api.squarespace.com/1.0/commerce/orders/${bundle.inputData.orderId}`,
    method: 'GET',
    headers: {
      'X-API-KEY': bundle.authData.api_key,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
      Accept: 'application/json',
    },
    params: {
      orderId: `${bundle.inputData.orderId}`,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = z.JSON.parse(response.content);

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        required: false,
        list: false,
        label: 'Order ID',
        helpText: 'Like 123a56b678c, not like 123',
        key: 'orderId',
        type: 'string',
        altersDynamicFields: false,
      },
    ],
    sample: {
      taxTotal: { currency: 'USD', value: '0.00' },
      shippingAddress: {
        city: null,
        countryCode: null,
        firstName: 'Naomi',
        lastName: 'Hardy',
        address2: null,
        phone: null,
        state: null,
        address1: null,
        postalCode: null,
      },
      grandTotal: { currency: 'USD', value: '225.00' },
      modifiedOn: '2019-09-17T00:42:25.706Z',
      fulfillments: [],
      orderNumber: '252',
      subtotal: { currency: 'USD', value: '225.00' },
      createdOn: '2019-09-17T00:42:21.612Z',
      customerEmail: 'cosmicforces77@gmail.com',
      fulfillmentStatus: 'PENDING',
      discountTotal: { currency: 'USD', value: '0.00' },
      testmode: false,
      billingAddress: {
        city: 'Sebastopol',
        countryCode: 'US',
        firstName: 'Naomi',
        lastName: 'Hardy',
        address2: null,
        phone: '7077101740',
        state: 'CA',
        address1: '1520 Hurlbut ln.',
        postalCode: '95472',
      },
      internalNotes: [],
      formSubmission: [
        { value: '', label: 'Note / Additional Info' },
        {
          value: ' ',
          label:
            'If purchasing more than one class or item, please tell us who it is for:',
        },
      ],
      shippingTotal: { currency: 'USD', value: '0.00' },
      lineItems: [
        {
          sku: 'SQ8890496',
          imageUrl:
            'https://static1.squarespace.com/static/55261710e4b09e5532148e16/5c11caf4575d1f0e01f2420d/5c4f9833c2241b20c1a24e1b/1550124647110/jewelry+101+pic.jpg?format=300w',
          customizations: [
            { value: 'Naomi Hardy', label: 'Name' },
            { value: 'cosmicforces77@gmail.com', label: 'E-mail' },
            { value: 'No', label: 'Are you currently a Chimera member?' },
            { value: '707-710-1740', label: 'Phone Number' },
            { value: 'I Agree', label: 'Refund Policy & Class Minimum' },
          ],
          unitPricePaid: { currency: 'USD', value: '225.00' },
          productName: 'Jewelry 101: Introduction to Jewelry Making',
          variantId: 'a7e183ba-3eec-463f-a243-60a7f7260fe9',
          id: '5d802b8d47d5dc43a91a9680',
          productId: '5c4f9831758d465be908871c',
          variantOptions: [
            {
              optionName: 'Date/Time',
              value: 'September 21st & 22nd 9:30-4:30p 2 Day Class',
            },
          ],
          quantity: 1,
        },
      ],
      refundedTotal: { currency: 'USD', value: '0.00' },
      id: '5d802bf1b1596958acfbcc46',
      shippingLines: [],
      discountLines: [],
    },
    outputFields: [
      { key: 'shippingAddress__city' },
      { key: 'shippingAddress__countryCode' },
      { key: 'shippingAddress__firstName' },
      { key: 'shippingAddress__lastName' },
      { key: 'shippingAddress__address2' },
      { key: 'shippingAddress__phone' },
      { key: 'shippingAddress__state' },
      { key: 'shippingAddress__address1' },
      { key: 'shippingAddress__postalCode' },
      { key: 'grandTotal__currency' },
      { key: 'grandTotal__value' },
      { key: 'lineItems[]sku' },
      { key: 'lineItems[]imageUrl' },
      { key: 'lineItems[]customizations[]value' },
      { key: 'lineItems[]customizations[]label' },
      { key: 'lineItems[]unitPricePaid__currency' },
      { key: 'lineItems[]unitPricePaid__value' },
      { key: 'lineItems[]productName' },
      { key: 'lineItems[]variantId' },
      { key: 'lineItems[]id' },
      { key: 'lineItems[]productId' },
      { key: 'lineItems[]variantOptions[]optionName' },
      { key: 'lineItems[]variantOptions[]value' },
      { key: 'lineItems[]quantity' },
      { key: 'modifiedOn' },
      { key: 'orderNumber' },
      { key: 'subtotal__currency' },
      { key: 'subtotal__value' },
      { key: 'createdOn' },
      { key: 'customerEmail' },
      { key: 'fulfillmentStatus' },
      { key: 'discountTotal__currency' },
      { key: 'discountTotal__value' },
      { key: 'testmode' },
      { key: 'billingAddress__city' },
      { key: 'billingAddress__countryCode' },
      { key: 'billingAddress__firstName' },
      { key: 'billingAddress__lastName' },
      { key: 'billingAddress__address2' },
      { key: 'billingAddress__phone' },
      { key: 'billingAddress__state' },
      { key: 'billingAddress__address1' },
      { key: 'billingAddress__postalCode' },
      { key: 'formSubmission[]value' },
      { key: 'formSubmission[]label' },
      { key: 'shippingTotal__currency' },
      { key: 'shippingTotal__value' },
      { key: 'taxTotal__currency' },
      { key: 'taxTotal__value' },
      { key: 'refundedTotal__currency' },
      { key: 'refundedTotal__value' },
      { key: 'id' },
    ],
  },
  noun: 'Order',
  display: {
    hidden: false,
    important: true,
    description: 'Get an order from Squarespace based on ID',
    label: 'Get Order by ID',
  },
  key: 'get_order',
};
