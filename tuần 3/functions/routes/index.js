const Router = require("@koa/router");
const { helloController } = require("../controllers/helloController");
const {
    getAllTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
} = require("../controllers/todoController");

const router = new Router();

router.get("/hello", helloController);

// Todo CRUD routes
router.get("/todos", getAllTodos);
router.get("/todos/:id", getTodo);
router.post("/todos", createTodo);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

module.exports = router;
