let cosmetic = require('cosmetic');

module.exports = (error) => {
  if (!error) return;
  console.log(`${cosmetic.red(`${error.name}:`)} ${error.message}`);
};
