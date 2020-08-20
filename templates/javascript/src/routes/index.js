var express = require('express');
var router = express.Router();

const validations = require('../helpers/validations');
require('./CHANGE THAT')(router, validations);

module.exports = router;