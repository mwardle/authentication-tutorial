const UIDGenerator = require('uid-generator');

const uidgen = new UIDGenerator(256);

module.exports = uidgen.generateSync.bind(uidgen);
