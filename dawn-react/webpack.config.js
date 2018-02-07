const pkg = require('./package');

module.exports = function (webpackConf) {
  let cmd = process.env.DN_CMD;
  console.log('DN_CMD', cmd);
  if (cmd == 'build') {
    //todo:
  }
}