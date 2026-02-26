const helloController = async (ctx) => {
    ctx.body = {
        success: true,
        message: "Hello from Firebase with KoaJS!",
    };
};

module.exports = { helloController };
