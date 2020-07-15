const express = require('express');
const app = express();
var { router } = require('./routes/index');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.use(router);
app.listen(port,function(){
    console.log('Server Started on port ' + port + ' at ' + new Date());
});
