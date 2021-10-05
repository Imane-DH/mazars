if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const paysRouter = require("./routes/payss");
const secteurRouter = require("./routes/secteurs");
const investissementRouter = require("./routes/investissements");
const filiereRouter = require("./routes/filieres");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    parameterLimit: 100000,
    extended: false,
  })
);
app.use(
  bodyParser.json({
    limit: "5mb",
  })
);
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/payss", paysRouter);
app.use("/secteurs", secteurRouter);
app.use("/filieres", filiereRouter);
app.use("/investissements", investissementRouter);

app.listen(process.env.PORT || 3000);
