import express from "express";
import { addContact, getContacts, getContactById, updateContact, deleteContact } from "../controllers/contacts.mjs";
import { authenticateUser } from "../middleware/auth.mjs";

const contactRouter = express.Router();

contactRouter.post("/", authenticateUser, addContact);
contactRouter.get("/", authenticateUser, getContacts);
contactRouter.get("/:id", authenticateUser, getContactById);
contactRouter.put("/:id", authenticateUser, updateContact);
contactRouter.delete("/:id", authenticateUser, deleteContact);

export default contactRouter;
