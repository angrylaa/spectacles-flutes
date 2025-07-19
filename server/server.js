import express from "express";

const port = 3000;
const app = express();

app.use(express.json());

app.use("/health", (req, res) => {
  res.json("Healthy!");
});

app.listen(port, () => {
  console.log("server is listening!");
});
