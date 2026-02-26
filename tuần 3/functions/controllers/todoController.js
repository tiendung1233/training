const { db } = require("../config/firebase");

const todosCollection = db.collection("todos");

const getAllTodos = async (ctx) => {
    const snapshot = await todosCollection.orderBy("createdAt", "desc").get();
    const todos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    ctx.body = { success: true, data: todos };
};

const getTodo = async (ctx) => {
    const { id } = ctx.params;
    const doc = await todosCollection.doc(id).get();

    if (!doc.exists) {
        ctx.status = 404;
        ctx.body = { success: false, message: "Todo not found" };
        return;
    }

    ctx.body = { success: true, data: { id: doc.id, ...doc.data() } };
};

const createTodo = async (ctx) => {
    const { title } = ctx.request.body;

    if (!title) {
        ctx.status = 400;
        ctx.body = { success: false, message: "Title is required" };
        return;
    }

    const newTodo = {
        title,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    const docRef = await todosCollection.add(newTodo);
    ctx.status = 201;
    ctx.body = { success: true, data: { id: docRef.id, ...newTodo } };
};

const updateTodo = async (ctx) => {
    const { id } = ctx.params;
    const doc = await todosCollection.doc(id).get();

    if (!doc.exists) {
        ctx.status = 404;
        ctx.body = { success: false, message: "Todo not found" };
        return;
    }

    const updates = {};
    const { title, completed } = ctx.request.body;

    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;

    await todosCollection.doc(id).update(updates);

    const updated = await todosCollection.doc(id).get();
    ctx.body = { success: true, data: { id: updated.id, ...updated.data() } };
};

const deleteTodo = async (ctx) => {
    const { id } = ctx.params;
    const doc = await todosCollection.doc(id).get();

    if (!doc.exists) {
        ctx.status = 404;
        ctx.body = { success: false, message: "Todo not found" };
        return;
    }

    await todosCollection.doc(id).delete();
    ctx.body = { success: true, message: "Todo deleted successfully" };
};

module.exports = {
    getAllTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
};
