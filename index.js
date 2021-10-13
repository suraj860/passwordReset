require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./mongo");
const userRoutes = require("./user_routes");
const service = require("./reset_service");

const jwt = require("jsonwebtoken");

const cors = require("cors");

async function connection() {
  await db.connect();
  app.use(cors());
  app.use(express.json());

  //different routes for resetting the password
  app.use("/user", userRoutes);

  app.post("/reset", service.reset);

  app.post("/new_password", service.new_password);

  //use in case if you want to check athourisation
  app.use((req, res, next) => {
    const token = req.headers["auth-token"];
    if (token) {
      try {
        req.user = jwt.verify(token, "admin123");
        console.log(req.user);
      } catch (err) {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  });

  app.listen(port, () => {
    console.log(`suraj your server is running at ${port}`);
  });
}
connection();
