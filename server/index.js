const express = require("express");
const connectToDb = require("./database.js");
const cors = require("cors");
const router = require("./routes/routers.js");

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "https://rasavakya-frontend.vercel.app"
}))
app.use(router);

app.get("/:message", (req, res) => {
  res.send(`${req.params.message}`);
});

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
