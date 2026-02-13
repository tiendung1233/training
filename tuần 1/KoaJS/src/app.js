const Koa = require('koa');
const koaBody = require('koa-body');
const productsRoutes = require('./routes/products');

const app = new Koa();

app.use(koaBody());
app.use(productsRoutes.routes());
app.use(productsRoutes.allowedMethods());

const port = 3000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});