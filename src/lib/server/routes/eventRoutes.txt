import express from "express";
const eventRouter = express.Router();
import * as eventController from "../controllers/eventController.js";
import bodyParser from "body-parser";
eventRouter.use(bodyParser.json());
eventRouter.use(bodyParser.urlencoded({ extended: false }));

eventRouter.post("/add", eventController.createEvent);

eventRouter.get("/list", eventController.listEvents);

eventRouter.get("/my-events", eventController.listmyEvents);

eventRouter.patch("/edit/:id", eventController.editEvent);

export default eventRouter;
