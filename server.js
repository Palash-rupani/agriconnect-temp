const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Example route
app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
