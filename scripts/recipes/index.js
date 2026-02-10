const kurashiru = require("./providers/kurashiru");

const providers = [kurashiru];

function getProvider(url) {
  return providers.find((provider) => provider.canHandle(url));
}

module.exports = {
  getProvider
};
