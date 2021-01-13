const perform = (z, bundle) => {
  var lastModified = bundle.inputData.modifiedDate;

  if (lastModified === '') {
    lastModified = new Date().toISOString();
  }

  var modifiedAfter = new Date(lastModified);
  modifiedAfter.setDate(modifiedAfter.getDate() - 1);
  var modifiedBefore = new Date(lastModified);
  modifiedBefore.setDate(modifiedBefore.getDate() + 1);

  const options = {
    url: 'https://api.squarespace.com/1.0/commerce/orders',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {
      // find an order near the given modified date
      modifiedAfter: modifiedAfter.toISOString(),
      modifiedBefore: modifiedBefore.toISOString(),
      // cursor={c}
      // fulfillmentStatus={d}
    },
    body: {},
  };
  // z.console.log("hi");

  return z.request(options).then((response) => {
    response.throwForStatus();
    var results = z.JSON.parse(response.content);
    results = results['result'];

    var out = [];

    // loop through each order
    if (results) {
      results.forEach(function (order, orderIndex) {
        if (
          parseInt(order['orderNumber']) === parseInt(bundle.inputData.orderNum)
        ) {
          out = [parseOrder(order)];
        }
      });
    }

    return out;
  });

  function parseOrder(order) {
    // orders can have multiple unrelated line items: loop through them too.
    if (order['lineItems']) {
      order['lineItems'].forEach(function (lineItem, lineItemIndex) {
        // add line item total
        lineItem['lineItemTotal'] =
          lineItem['unitPricePaid']['value'] * lineItem['quantity'];

        // extract class date, name, phone, and notes if they exist
        classDate = null;
        customerName = null;
        customerPhone = null;
        customerEmail = null;
        isMember = null;
        refundPolicy = null;
        additionalInfoArray = [];

        lineItem['variantOptions'].forEach(function (variant) {
          if (variant['optionName'] == 'Date/Time') {
            classDate = variant['value'];
          }
        });
        // add class date to line item
        lineItem['dateTime'] = classDate;

        if (lineItem['customizations']) {
          lineItem['customizations'].forEach(function (customization) {
            if (
              customization['value'] !== '' &&
              customization['value'] !== ' '
            ) {
              if (customization['label'] == 'Name') {
                customerName = customization['value'];
              }
              if (customization['label'] == 'Phone Number') {
                customerPhone = customization['value'];
              }
              if (customization['label'] == 'E-mail') {
                customerEmail = customization['value'];
              }
              if (
                customization['label'] == 'Are you currently a Chimera member?'
              ) {
                isMember = customization['value'];
              }
              if (customization['label'] == 'Refund Policy') {
                refundPolicy = customization['value'];
              }
            }
          });
        }

        // add name, phone, and member info to line item
        lineItem['customerName'] = customerName;
        lineItem['customerPhone'] = customerPhone;
        lineItem['customerEmail'] = customerEmail;
        lineItem['isMember'] = isMember;
        lineItem['refundPolicy'] = refundPolicy;
      });
    }
    // get additional info
    noteInfo = null;
    attendeeName = null;
    if (order['formSubmission']) {
      order['formSubmission'].forEach(function (submissionInfo) {
        if (submissionInfo['value'] !== '' && submissionInfo['value'] !== ' ') {
          if (submissionInfo['label'] == 'Note / Additional Info') {
            additionalInfoArray.push(submissionInfo['value']);
          }
          if (
            submissionInfo['label'] ==
            'If purchasing more than one class or item, please tell us who it is for:'
          ) {
            additionalInfoArray.push(
              'Purchased for: ' + submissionInfo['value']
            );
          }
        }
      });
    }
    order['notes'] = noteInfo;
    order['attendee'] = attendeeName;

    return order;
  }
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        required: false,
        list: false,
        label: 'Order Number',
        helpText: 'i.e. 123, not 123a45ba67c',
        key: 'orderNum',
        type: 'string',
        altersDynamicFields: false,
      },
      {
        required: false,
        list: false,
        label: 'Last Modified Date',
        helpText:
          'Squarespace search is based on date; if you have the last modification date of the order, it will speed things up.',
        key: 'modifiedDate',
        type: 'datetime',
        altersDynamicFields: false,
      },
    ],
    sample: {
      shippingAddress: {
        city: null,
        countryCode: null,
        firstName: 'Nicteha',
        lastName: 'Cohen',
        address2: null,
        phone: null,
        state: null,
        address1: null,
        postalCode: null,
      },
      grandTotal: { currency: 'USD', value: '225.00' },
      modifiedOn: '2019-09-10T23:09:08.036Z',
      orderNumber: '244',
      id: '5d782d140bef427987a3a143',
      fulfillments: [],
      subtotal: { currency: 'USD', value: '225.00' },
      discountTotal: { currency: 'USD', value: '0.00' },
      shippingTotal: { currency: 'USD', value: '0.00' },
      lineItems: [
        {
          sku: 'SQ8890496',
          refundPolicy: null,
          customerName: 'Nicteha Cohen',
          lineItemTotal: 225,
          imageUrl:
            'https://static1.squarespace.com/static/55261710e4b09e5532148e16/5c11caf4575d1f0e01f2420d/5c4f9833c2241b20c1a24e1b/1550124647110/jewelry+101+pic.jpg?format=300w',
          customizations: [
            { value: 'Nicteha Cohen', label: 'Name' },
            { value: 'walkaboutlily@gmail.com', label: 'E-mail' },
            { value: 'No', label: 'Are you currently a Chimera member?' },
            { value: '707-889-6888', label: 'Phone Number' },
            { value: 'I Agree', label: 'Refund Policy & Class Minimum' },
          ],
          customerEmail: 'walkaboutlily@gmail.com',
          unitPricePaid: { currency: 'USD', value: '225.00' },
          dateTime: 'September 21st & 22nd 9:30-4:30p 2 Day Class',
          customerPhone: '707-889-6888',
          productId: '5c4f9831758d465be908871c',
          variantId: 'a7e183ba-3eec-463f-a243-60a7f7260fe9',
          isMember: 'No',
          id: '5d782c8b18823353c46cbe75',
          productName: 'Jewelry 101: Introduction to Jewelry Making',
          variantOptions: [
            {
              optionName: 'Date/Time',
              value: 'September 21st & 22nd 9:30-4:30p 2 Day Class',
            },
          ],
          quantity: 1,
        },
      ],
      taxTotal: { currency: 'USD', value: '0.00' },
      attendee: null,
      fulfillmentStatus: 'PENDING',
      customerEmail: 'walkaboutlily@gmail.com',
      billingAddress: {
        city: 'Sebastopol',
        countryCode: 'US',
        firstName: 'Nicteha',
        lastName: 'Cohen',
        address2: null,
        phone: '7078896888',
        state: 'CA',
        address1: '6490 Lone Pine Road',
        postalCode: '95472',
      },
      internalNotes: [],
      refundedTotal: { currency: 'USD', value: '0.00' },
      shippingLines: [],
      createdOn: '2019-09-10T23:09:05.788Z',
      testmode: false,
      formSubmission: [
        { value: '', label: 'Note / Additional Info' },
        {
          value: ' ',
          label:
            'If purchasing more than one class or item, please tell us who it is for:',
        },
      ],
      notes: null,
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
      { key: 'modifiedOn' },
      { key: 'orderNumber' },
      { key: 'id' },
      { key: 'subtotal__currency' },
      { key: 'subtotal__value' },
      { key: 'discountTotal__currency' },
      { key: 'discountTotal__value' },
      { key: 'shippingTotal__currency' },
      { key: 'shippingTotal__value' },
      { key: 'lineItems[]sku' },
      { key: 'lineItems[]refundPolicy' },
      { key: 'lineItems[]customerName' },
      { key: 'lineItems[]lineItemTotal' },
      { key: 'lineItems[]imageUrl' },
      { key: 'lineItems[]customizations[]value' },
      { key: 'lineItems[]customizations[]label' },
      { key: 'lineItems[]customerEmail' },
      { key: 'lineItems[]unitPricePaid__currency' },
      { key: 'lineItems[]unitPricePaid__value' },
      { key: 'lineItems[]dateTime' },
      { key: 'lineItems[]customerPhone' },
      { key: 'lineItems[]productId' },
      { key: 'lineItems[]variantId' },
      { key: 'lineItems[]isMember' },
      { key: 'lineItems[]id' },
      { key: 'lineItems[]productName' },
      { key: 'lineItems[]variantOptions[]optionName' },
      { key: 'lineItems[]variantOptions[]value' },
      { key: 'lineItems[]quantity' },
      { key: 'taxTotal__currency' },
      { key: 'taxTotal__value' },
      { key: 'attendee' },
      { key: 'fulfillmentStatus' },
      { key: 'customerEmail' },
      { key: 'billingAddress__city' },
      { key: 'billingAddress__countryCode' },
      { key: 'billingAddress__firstName' },
      { key: 'billingAddress__lastName' },
      { key: 'billingAddress__address2' },
      { key: 'billingAddress__phone' },
      { key: 'billingAddress__state' },
      { key: 'billingAddress__address1' },
      { key: 'billingAddress__postalCode' },
      { key: 'refundedTotal__currency' },
      { key: 'refundedTotal__value' },
      { key: 'createdOn' },
      { key: 'testmode' },
      { key: 'formSubmission[]value' },
      { key: 'formSubmission[]label' },
      { key: 'notes' },
    ],
  },
  noun: 'Order',
  display: {
    hidden: false,
    important: true,
    description: 'Finds an order by its number (i.e. 123)',
    label: 'Find Order by Number',
  },
  key: 'find_order',
};
