const express = require("express");
const connectToDb = require("./database.js");
const cors = require("cors");
const router = require("./routes/routers.js");

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
  // origin: "https://rasavakya-frontend.vercel.app",
  origin : "*",
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Backend is running");
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
