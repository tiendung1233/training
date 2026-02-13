const yup = require('yup');

const validate = (schema) => async (ctx, next) => {
    try {
        await schema.validate(ctx.request.body, { abortEarly: false });
        await next();
    } catch (err) {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: 'Validation failed',
            errors: err.errors
        };
    }
};

const productSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required().positive(),
    description: yup.string().required(),
    product: yup.string().required(),
    color: yup.string().required(),
    image: yup.string().url().required()
});

module.exports = {
    validate,
    productSchema
};
