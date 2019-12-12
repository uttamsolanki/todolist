const router = require('express-promise-router')();
const {validateBody, schemas} = require('../app/helpers/routerHelper');
const catController = require('../app/controllers/category');
const {auth} = require('../app/helpers/auth');

router.route("/create")
    .post(auth,validateBody(schemas.cat),catController.create);

router.route("/")
    .get(auth,catController.getAll);

router.route("/:id")
    .get(auth,catController.get);

router.route("/:id")
    .patch(auth,catController.update);

router.route("/:id")
    .delete(auth,catController.delete);

module.exports = router;
