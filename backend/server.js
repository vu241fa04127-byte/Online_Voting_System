const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Online Voting System is Running");
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});
