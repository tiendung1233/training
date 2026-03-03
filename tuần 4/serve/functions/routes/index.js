const Router = require("@koa/router");
const { syncShopInstall } = require("../controllers/shopController");

const router = new Router();

router.post("/install", syncShopInstall);

module.exports = router;
