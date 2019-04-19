let cmd = require('node-cmd');

module.exports = (command) => {
  return new Promise((resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      };
    });
  });
};
