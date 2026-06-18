const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://sanjana:12345@cluster0.r4uolfu.mongodb.net/Practice?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
    const existingUser = await User.findOne({
    email: req.body.email
    });
    if(existingUser){
    return res.json({
        message: "Email Already Exists"
    });
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    await user.save();
    res.json({
        message: "User Registered"
    });
});

app.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if(!user){
        return res.json({
            message: "User Not Found"
        });
    }
    const isMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if(!isMatch){
        return res.json({
            message: "Invalid Password"
        });
    }
    const token = jwt.sign(
    {
        email: user.email
    },
    "mysecretkey"
    );
    res.json({
    message: "Login Successful",
    token: token
    });
});

app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Welcome User",
        user: req.user
    });
});

function verifyToken(req, res, next){
    const token = req.headers.authorization;
    if(!token){
        return res.json({
            message: "Access Denied"
        });
    }
    jwt.verify(
        token,
        "mysecretkey",
        (err, decoded) => {
            if(err){
                return res.json({
                    message: "Invalid Token"
                });
            }
            req.user = decoded;
            next();
        }
    );
}

app.listen(5000, () => {
    console.log("Server Running");
});