const Router = require("@koa/router");
const {syncShopInstall} = require("../controllers/shopController");
const {
  getSettings, updateSettings,
} = require("../controllers/settingController");
const {getNotifications} = require("../controllers/notificationController");
const {handleOrderCreated} = require("../controllers/webhookController");
const {getClientData} = require("../controllers/clientController");

const router = new Router();

router.post("/install", syncShopInstall);
router.get("/api/settings", getSettings);
router.put("/api/settings", updateSettings);
router.get("/api/notifications", getNotifications);
router.post("/webhook/orders-create", handleOrderCreated);

// Public client API for storefront
router.get("/api/client/:shopId", getClientData);

module.exports = router;
