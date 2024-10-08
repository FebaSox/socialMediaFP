const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

// User registration
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await Users.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.create({ username, password: hashedPassword });

        res.json("User registered successfully");
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
});

// Get basic info by ID
router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const basicInfo = await Users.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!basicInfo) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.json(basicInfo); // This will include the bio if it was set
    } catch (error) {
        console.error("Error fetching basic info:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});


// User login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: "User Doesn't Exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong Username And Password Combination" });
        }

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );
        res.json({ token: accessToken, username: user.username, id: user.id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "An error occurred during login" });
    }
});

// Authenticated user info
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

// Get basic info by ID
router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const basicInfo = await Users.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!basicInfo) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.json(basicInfo);
    } catch (error) {
        console.error("Error fetching basic info:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Change password
router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username;

    try {
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong Password Entered!" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await Users.update({ password: hash }, { where: { username } });
        res.json("SUCCESS");
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "An error occurred while changing the password" });
    }
});

module.exports = router;
