const express = require('express');
const router = express.Router();


const auth_MID = require('../middelware/auth_MID');


const auth_C = require('../controller/auth_C');



router.post('/register', auth_MID.valuesToAdd, auth_MID.encrypPass, auth_C.register);


router.post('/login', auth_MID.valuesToLogin, auth_C.login);


router.get('/logout', auth_C.logout);

module.exports = router;