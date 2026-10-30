
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const API_URL = "https://panelstore.shop/api/v1/index.php";
const API_KEY = process.env.RESELLER_API_KEY;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "LEGIT PANELS API"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    server: "LEGIT PANELS"
  });
});

// Admin order
app.post("/api/admin/order", async (req, res) => {
  try {
    if (!ADMIN_TOKEN || req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "API not configured" });
    }

    const quantity = Number(req.body.quantity || 1);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const result = await axios.post(API_URL, {
      key: API_KEY,
      action: "order",
      pid: 343,
      quantity,
      custom_notes: String(req.body.note || "").slice(0, 100)
    });

    if (result.data.status !== "success") {
      return res.status(400).json({
        error: result.data.message || "Reseller order failed"
      });
    }

    res.json({
      status: "success",
      product: "PHANTOM",
      duration: "1 Hour",
      quantity,
      license_key: result.data.license_key
    });

  } catch (error) {
    console.error("Reseller error:", error.message);
    res.status(502).json({ error: "Reseller API unavailable" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("LEGIT PANELS backend running");
});
