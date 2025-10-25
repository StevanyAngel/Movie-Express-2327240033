import express from "express";

const app = express();
app.use(express.json());
app.use("/api", api);

//app.get("/", (req, res) => {
//  res.status(200).json({
//    message: "OK",
//  });
//});

app.listen("3000", () => {
  console.log("App berjalan di : http://localhost:3000");
});
