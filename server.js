const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ================= SANITIZATION ================= */
function sanitize(value) {
    if (!value) return "";
    return value
        .toString()
        .trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/* ================= VALIDATION FUNCTIONS ================= */

function isEmpty(value) {
    return !value || value.trim().length === 0;
}

function isName(value) {
    return /^[A-Za-z ]+$/.test(value);
}

function isEmail(value) {
    return /^[^@]+@[^@]+\.[^@]+$/.test(value);
}

function isMobile(value) {
    return /^05[0-9]{8}$/.test(value);
}

/* ================= CONTACT FORM BACKEND ================= */

app.post("/contact", (req, res) => {

    let fname = sanitize(req.body.fname);
    let lname = sanitize(req.body.lname);
    let email = sanitize(req.body.email);
    let mobile = sanitize(req.body.mobile);
    let birthdate = sanitize(req.body.birthdate);
    let gender = sanitize(req.body.gender);
    let language = sanitize(req.body.language);
    let message = sanitize(req.body.message);

    // ===== ENTRY CHECK =====
    if (
        isEmpty(fname) ||
        isEmpty(lname) ||
        isEmpty(email) ||
        isEmpty(mobile) ||
        isEmpty(birthdate) ||
        isEmpty(gender) ||
        isEmpty(language) ||
        isEmpty(message)
    ) {
        return res.json({ error: "All fields are required" });
    }

    // ===== TYPE + FORMAT CHECK =====
    if (!isName(fname) || !isName(lname)) {
        return res.json({ error: "Name must contain letters only" });
    }

    if (!isEmail(email)) {
        return res.json({ error: "Invalid email format" });
    }

    if (!isMobile(mobile)) {
        return res.json({ error: "Invalid mobile format (05XXXXXXXX)" });
    }

    // ===== LENGTH CHECK =====
    if (fname.length < 2 || lname.length < 2) {
        return res.json({ error: "Name must be at least 2 characters" });
    }

    if (message.length < 10) {
        return res.json({ error: "Message must be at least 10 characters" });
    }

    // ===== SUCCESS RESPONSE =====
    return res.json({
        success: "Contact form validated successfully ✔",
        data: {
            fname,
            lname,
            email,
            mobile,
            birthdate,
            gender,
            language,
            message
        }
    });
});


/* ================= REGISTER FORM BACKEND ================= */

app.post("/register", (req, res) => {

    let fullname = sanitize(req.body.fullname);
    let email = sanitize(req.body.email);
    let mobile = sanitize(req.body.mobile);
    let gender = sanitize(req.body.gender);
    let date = sanitize(req.body.date);
    let time = sanitize(req.body.time);

    // ===== ENTRY CHECK =====
    if (
        isEmpty(fullname) ||
        isEmpty(email) ||
        isEmpty(mobile) ||
        isEmpty(gender) ||
        isEmpty(date) ||
        isEmpty(time)
    ) {
        return res.json({ error: "Missing required fields" });
    }

    // ===== TYPE CHECK =====
    if (!isName(fullname)) {
        return res.json({ error: "Full name must contain letters only" });
    }

    if (!isEmail(email)) {
        return res.json({ error: "Invalid email format" });
    }

    if (!isMobile(mobile)) {
        return res.json({ error: "Invalid mobile format (05XXXXXXXX)" });
    }

    // ===== LENGTH CHECK =====
    if (fullname.length < 5) {
        return res.json({ error: "Full name must be at least 5 characters" });
    }

    // ===== SUCCESS RESPONSE =====
    return res.json({
        success: "Booking validated successfully ✔",
        data: {
            fullname,
            email,
            mobile,
            gender,
            date,
            time
        }
    });
});


app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});