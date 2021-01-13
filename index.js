const authentication = require('./authentication');
const newOrderTrigger = require('./triggers/new_order.js');
const getOrderSearch = require('./searches/get_order.js');
const findOrderSearch = require('./searches/find_order.js');

module.exports = {
  platformVersion: require('zapier-platform-core').version,
  searches: {
    [getOrderSearch.key]: getOrderSearch,
    [findOrderSearch.key]: findOrderSearch,
  },
  authentication: authentication,
  version: require('./package.json').version,
  triggers: { [newOrderTrigger.key]: newOrderTrigger },
};
