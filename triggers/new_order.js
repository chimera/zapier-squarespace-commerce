const perform = (z, bundle) => {
  const options = {
    url: 'https://api.squarespace.com/1.0/commerce/orders/',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.api_key}`,
    },
    params: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    var result = z.JSON.parse(response.content);
    var results = result['result'];

    // loop through each order
    if (results) {
      results.forEach(function (order, orderIndex) {
        order = parseOrder(order);
      });

      return results;
    }
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
    sample: {
      taxTotal: { currency: 'USD', value: '0.00' },
      shippingAddress: {
        city: null,
        countryCode: null,
        firstName: 'Celine',
        lastName: 'Germain',
        address2: null,
        phone: null,
        state: null,
        address1: null,
        postalCode: null,
      },
      grandTotal: { currency: 'USD', value: '300.00' },
      modifiedOn: '2019-04-30T06:14:00.185Z',
      fulfillments: [],
      orderNumber: '112',
      subtotal: { currency: 'USD', value: '300.00' },
      createdOn: '2019-04-30T06:14:00.185Z',
      customerEmail: 'tideandtied@gmail.com',
      fulfillmentStatus: 'PENDING',
      discountTotal: { currency: 'USD', value: '0.00' },
      testmode: false,
      billingAddress: {
        city: 'San Francisco',
        countryCode: 'US',
        firstName: 'Celine',
        lastName: 'Germain',
        address2: null,
        phone: '(510) 548-4004',
        state: 'CA',
        address1: '2090 44th Avenue',
        postalCode: '94116',
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
          sku: 'SQ0602616',
          imageUrl:
            'https://static1.squarespace.com/static/55261710e4b09e5532148e16/5c11caf4575d1f0e01f2420d/5c64b25e15fcc03123fd1f8c/1550103143013/FullSizeRender.jpeg?format=300w',
          customizations: [
            { value: 'Celine Germain', label: 'Name' },
            { value: 'Tideandtied@gmail.com', label: 'E-mail' },
            { value: 'No', label: 'Are you currently a Chimera member?' },
            { value: '510-548-4004', label: 'Phone Number' },
            { value: 'I Agree', label: 'Refund Policy' },
          ],
          unitPricePaid: { currency: 'USD', value: '300.00' },
          productName: 'Jewelry Production Casting  ',
          id: '5cc7e7465cd26300018714c1',
          quantity: 1,
          variantOptions: [
            { optionName: 'Date/Time', value: 'May 4th-5th,2-6pm' },
          ],
          productId: '5c64b251e2c48348a4353663',
        },
      ],
      refundedTotal: { currency: 'USD', value: '0.00' },
      id: '5cc7e7a82727be25e9b5b527',
      shippingLines: [],
      discountLines: [],
    },
    canPaginate: false,
    outputFields: [
      { key: 'shippingAddress__city', label: 'Shipping Address City' },
      {
        key: 'shippingAddress__countryCode',
        label: 'Shipping Address Country Code',
      },
      {
        key: 'shippingAddress__firstName',
        label: 'Shipping Address First Name',
      },
      { key: 'shippingAddress__lastName', label: 'Shipping Address Last Name' },
      { key: 'shippingAddress__address2', label: 'Shipping Address Line 2' },
      { key: 'shippingAddress__phone', label: 'Shipping Address Phone' },
      { key: 'shippingAddress__state', label: 'Shipping Address State' },
      { key: 'shippingAddress__address1', label: 'Shipping Address Line 1' },
      {
        key: 'shippingAddress__postalCode',
        label: 'Shipping Address Postal Code',
      },
      { key: 'grandTotal__currency', label: 'Grand Total Currency' },
      { type: 'number', key: 'grandTotal__value', label: 'Grand Total' },
      { type: 'datetime', key: 'modifiedOn', label: 'Modified On' },
      { type: 'integer', key: 'orderNumber', label: 'Order Number' },
      { key: 'refundedTotal__currency', label: 'Refunded Currency' },
      { type: 'number', key: 'refundedTotal__value', label: 'Refunded Total' },
      { type: 'datetime', key: 'createdOn', label: 'Created On' },
      { key: 'customerEmail', label: 'Customer Email' },
      { key: 'fulfillmentStatus', label: 'Fulfillment Status' },
      { key: 'discountTotal__currency', label: 'Discount Currency' },
      { type: 'number', key: 'discountTotal__value', label: 'Discount' },
      { type: 'boolean', key: 'testmode', label: 'Test Mode' },
      { key: 'billingAddress__city', label: 'Billing Address City' },
      {
        key: 'billingAddress__countryCode',
        label: 'Billing Address Country Code',
      },
      { key: 'billingAddress__firstName', label: 'Billing Address First Name' },
      { key: 'billingAddress__lastName', label: 'Billing Address Last Name' },
      { key: 'billingAddress__address2', label: 'Billing Address Line 2' },
      { key: 'billingAddress__phone', label: 'Billing Address Phone' },
      { key: 'billingAddress__state', label: 'Billing Address State' },
      { key: 'billingAddress__address1', label: 'Billing Address Line 1' },
      {
        key: 'billingAddress__postalCode',
        label: 'Billing Address Postal Code',
      },
      { key: 'formSubmission[]value', label: 'Form Submission Value' },
      { key: 'formSubmission[]label', label: 'Form Submission Label' },
      { key: 'shippingTotal__currency', label: 'Shipping Currency' },
      { type: 'number', key: 'shippingTotal__value', label: 'Shipping Total' },
      { key: 'lineItems[]sku', label: 'Line Item SKU' },
      { key: 'lineItems[]imageUrl', label: 'Line Item Image URL' },
      {
        key: 'lineItems[]customizations[]value',
        label: 'Line Item Customizations Value',
      },
      {
        key: 'lineItems[]customizations[]label',
        label: 'Line Item Customizations Label',
      },
      {
        key: 'lineItems[]unitPricePaid__currency',
        label: 'Line Item Unit Price Currency',
      },
      { key: 'lineItems[]unitPricePaid__value', label: 'Line Item Unit Price' },
      { key: 'lineItems[]productName', label: 'Line Item Product Name' },
      {
        key: 'lineItems[]variantOptions[]optionName',
        label: 'Line Item Variant Option Name',
      },
      {
        key: 'lineItems[]variantOptions[]value',
        label: 'Line Item Variant Option Value',
      },
      {
        type: 'string',
        key: 'lineItems[]productId',
        label: 'Line Item Product ID',
      },
      { key: 'lineItems[]id', label: 'Line Item ID' },
      { key: 'lineItems[]quantity', label: 'Line Item Quantity' },
      { key: 'subtotal__currency', label: 'Subtotal Currency' },
      { type: 'number', key: 'subtotal__value', label: 'Subtotal' },
      { key: 'id', label: 'ID' },
      { key: 'taxTotal__currency', label: 'Tax Currency' },
      { type: 'number', key: 'taxTotal__value', label: 'Tax Total' },
    ],
  },
  noun: 'Order',
  display: {
    hidden: false,
    important: true,
    description: 'Triggers when a new order is created.',
    label: 'New Order',
  },
  key: 'new_order',
};
