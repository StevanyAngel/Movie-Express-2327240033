import express from "express";
import * as movieController from "../controllers/movieController.js";
import * as userController from "../controllers/userController.js";
import { authenticateTokenMiddleware } from "../middlewares/authenticateTokenMiddleware.js";

const api = express.Router();

api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);

// Protected Routes (Movies)
// api.get("/movie", movieController.listMovie);
// api.post("/movie", movieController.addListMovie);
// api.put("/movie/:id", movieController.updateDataMovie);
// api.delete("/movie/:id", movieController.deleteMovie);

api.get("/movie", authenticateTokenMiddleware, movieController.listMovie);
api.get("/movie/:id", authenticateTokenMiddleware, movieController.getMovieById);
api.post("/movie", authenticateTokenMiddleware, movieController.addListMovie);
api.put("/movie/:id", authenticateTokenMiddleware, movieController.updateDataMovie);
api.delete("/movie/:id", authenticateTokenMiddleware, movieController.deleteMovie);

export default api;
