function createMailerLib(execlib){
  return execlib.lib.q(require('./libcreator')(execlib));
}

module.exports = createMailerLib;
