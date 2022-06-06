const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../../config/roles_list');

const verifyRoles = require('../../middleware/verifyRoles');

const usersController = require('../../controllers/usersController');


router.route('/')                   // Only Admin can access the following routes
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);


router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);


module.exports = router;