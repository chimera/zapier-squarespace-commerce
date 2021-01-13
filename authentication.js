module.exports = {
  test: {
    body: {},
    url: 'https://api.squarespace.com/1.0/commerce/orders/',
    removeMissingValuesFrom: {},
    headers: { Authorization: 'Bearer {{bundle.authData.api_key}}' },
    params: {},
    method: 'GET',
  },
  fields: [
    {
      computed: false,
      required: true,
      label: 'Squarespace API Key',
      helpText:
        'Find or create your key at: /config/settings/advanced/squarespace-api-keys',
      key: 'api_key',
      type: 'password',
    },
  ],
  type: 'custom',
  customConfig: {},
};
