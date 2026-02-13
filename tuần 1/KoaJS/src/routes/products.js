const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const { validate, productSchema } = require('../middleware/validation');

const router = new Router({ prefix: '/api' });
const productsFilePath = path.join(__dirname, '../../products.json');

const getProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

router.get('/products', async (ctx) => {
    let products = getProducts();
    const { limit, sort } = ctx.query;

    if (sort) {
        if (sort === 'asc') {
            products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sort === 'desc') {
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    if (limit) {
        products = products.slice(0, parseInt(limit));
    }

    ctx.body = products;
});

router.get('/product/:id', async (ctx) => {
    const products = getProducts();
    const product = products.find((p) => p.id === parseInt(ctx.params.id));

    if (!product) {
        ctx.status = 404;
        ctx.body = { message: 'Product not found' };
        return;
    }

    const { fields } = ctx.query;
    if (fields) {
        const fieldsArray = fields.split(',');
        const filteredProduct = {};
        fieldsArray.forEach((field) => {
            if (product[field] !== undefined) {
                filteredProduct[field] = product[field];
            }
        });
        ctx.body = filteredProduct;
    } else {
        ctx.body = product;
    }
});

router.post('/products', validate(productSchema), async (ctx) => {
    const products = getProducts();
    const newProduct = ctx.request.body;
    newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    newProduct.createdAt = new Date().toISOString();

    products.push(newProduct);
    saveProducts(products);

    ctx.status = 201;
    ctx.body = newProduct;
});

router.put('/product/:id', validate(productSchema), async (ctx) => {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === parseInt(ctx.params.id));

    if (index === -1) {
        ctx.status = 404;
        ctx.body = { message: 'Product not found' };
        return;
    }

    const updatedProduct = {
        ...products[index],
        ...ctx.request.body,
        id: products[index].id,
        createdAt: products[index].createdAt
    };

    products[index] = updatedProduct;
    saveProducts(products);

    ctx.body = updatedProduct;
});

router.delete('/product/:id', async (ctx) => {
    let products = getProducts();
    const initialLength = products.length;
    products = products.filter((p) => p.id !== parseInt(ctx.params.id));

    if (products.length === initialLength) {
        ctx.status = 404;
        ctx.body = { message: 'Product not found' };
        return;
    }

    saveProducts(products);
    ctx.body = { message: 'Product deleted successfully' };
});

module.exports = router;
