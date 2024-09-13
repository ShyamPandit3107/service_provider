import express from "express";
import router from "./router";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use("/api", router);
app.listen(PORT, () => {
  console.log("Server is started  on localhost:" + PORT);
});
