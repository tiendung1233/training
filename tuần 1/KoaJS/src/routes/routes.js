const Router = require('koa-router');

// Prefix all routes with /books
const router = new Router({
    prefix: '/api'
});

const books = [
    { id: 101, name: 'Fight Club', author: 'Chuck Palahniuk' },
    { id: 102, name: 'Sharp Objects', author: 'Gillian Flynn' },
    { id: 103, name: 'Frankenstein', author: 'Mary Shelley' },
    { id: 104, name: 'Into The Willd', author: 'Jon Krakauer' }
];

// Routes will go here
router.get('/books', (ctx) => {
    ctx.body = {
        data: books
    };
});

router.get('/books/:id', (ctx) => {
    try {
        const { id } = ctx.params;
        const getCurrentBook = books.find(book => book.id === parseInt(id));
        if (getCurrentBook) {
            return ctx.body = {
                data: getCurrentBook
            }
        }

        ctx.status = 404;
        return ctx.body = {
            status: 'error!',
            message: 'Book Not Found with that id!'
        };
    } catch (e) {
        return ctx.body = {
            success: false,
            error: e.message
        }
    }
});


module.exports = router;