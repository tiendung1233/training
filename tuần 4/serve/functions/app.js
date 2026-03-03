const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const cors = require("@koa/cors");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = new Koa();

// Middleware
app.use(errorHandler());
app.use(cors());
app.use(logger());

// Firebase Functions pre-parses the body, so we bridge it to Koa
app.use(async (ctx, next) => {
    if (ctx.req.body) {
        ctx.request.body = ctx.req.body;
    }
    await next();
});

app.use(bodyParser());

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
