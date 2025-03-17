import Contact from "../models/Contact.mjs";

// Add a new contact
export const addContact = async (req, res) => {
    try {
        const { fullname, email, phone, gender } = req.body;
        const userId = req.userId;

        if (!fullname || !email || !phone || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const contact = new Contact({ fullname, email, phone, gender, user: userId });
        await contact.save();

        return res.status(201).json({ message: "Contact added successfully", contact });
    } catch (error) {
        console.error("Error adding contact:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all contacts of the logged-in user
export const getContacts = async (req, res) => {
    try {
        const userId = req.userId;
        const contacts = await Contact.find({ user: userId });

        return res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single contact by ID (only if it belongs to the logged-in user)
export const getContactById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const contact = await Contact.findOne({ _id: id, user: userId });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        return res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update a contact
export const updateContact = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { fullname, email, phone, gender } = req.body;

        const contact = await Contact.findOneAndUpdate(
            { _id: id, user: userId },
            { fullname, email, phone, gender },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: "Contact not found or unauthorized" });
        }

        return res.status(200).json({ message: "Contact updated successfully", contact });
    } catch (error) {
        console.error("Error updating contact:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a contact
export const deleteContact = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const contact = await Contact.findOneAndDelete({ _id: id, user: userId });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found or unauthorized" });
        }

        return res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};