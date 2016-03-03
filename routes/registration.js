/**
 * Created by barak on 3/2/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req,res,nex) {

    res.render('registration');
});




module.exports = router;