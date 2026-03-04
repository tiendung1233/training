const {db} = require("../config/firebase");

/**
 * GET /api/settings?shopId=xxx
 * Retrieve settings for a specific shop
 * @param {object} ctx - Koa context
 */
const getSettings = async (ctx) => {
  try {
    const {shopId} = ctx.query;

    if (!shopId) {
      ctx.status = 400;
      ctx.body = {success: false, message: "Missing shopId parameter"};
      return;
    }

    const settingDoc = await db.collection("settings").doc(shopId).get();

    if (!settingDoc.exists) {
      ctx.status = 404;
      ctx.body = {success: false, message: "Settings not found for this shop"};
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: settingDoc.data(),
    };
  } catch (error) {
    console.error("Get settings error:", error);
    ctx.status = 500;
    ctx.body = {success: false, message: "Internal Server Error"};
  }
};

/**
 * PUT /api/settings
 * Update settings for a specific shop
 * @param {object} ctx - Koa context
 */
const updateSettings = async (ctx) => {
  try {
    const {shopId, ...settingsData} = ctx.request.body;

    if (!shopId) {
      ctx.status = 400;
      ctx.body = {success: false, message: "Missing shopId in request body"};
      return;
    }

    const updatePayload = {
      ...settingsData,
      shopId,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("settings").doc(shopId)
        .set(updatePayload, {merge: true});

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Settings updated successfully",
      data: updatePayload,
    };
  } catch (error) {
    console.error("Update settings error:", error);
    ctx.status = 500;
    ctx.body = {success: false, message: "Internal Server Error"};
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
