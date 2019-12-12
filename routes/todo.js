const router = require('express-promise-router')();
const {validateBody, schemas} = require('../app/helpers/routerHelper');
const TodoController = require('../app/controllers/todo');
const {auth} = require('../app/helpers/auth');

router.route("/create")
    .post(auth,validateBody(schemas.todo),TodoController.create);

router.route("/")
    .get(auth,TodoController.getAll);


router.route("/:id")
    .get(auth,TodoController.get);

router.route("/:id")
    .patch(auth,TodoController.update);

router.route("/:id")
    .delete(auth,TodoController.delete);

module.exports = router;
