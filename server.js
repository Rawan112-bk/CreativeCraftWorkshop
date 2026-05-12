// ================= CREATIVE CRAFT WORKSHOP BACKEND =================

const express = require('express');
const mysql = require('mysql2');
const { check, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = 3000;

// Static routing: serve HTML, CSS, JS and media files
app.use('/', express.static(path.join(__dirname, 'html ')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/Media', express.static(path.join(__dirname, 'Media')));

// HTML form routing: parse form body from POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ================= DATABASE CONNECTION SETTINGS =================
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "creativecraft"
};
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  console.log("Database connected successfully");
}); 

function openConnection() {
    return mysql.createConnection(dbConfig);
}

// ================= VALIDATION RULES =================
function contactValidation() {
    return [
        check('fname').isLength({ min: 2, max: 20 }).withMessage('First name must be between 2 and 20 characters.').isAlpha().withMessage('First name must contain letters only.').trim().escape(),
        check('lname').isLength({ min: 2, max: 20 }).withMessage('Last name must be between 2 and 20 characters.').isAlpha().withMessage('Last name must contain letters only.').trim().escape(),
        check('email').isEmail().withMessage('Email format is invalid.').normalizeEmail(),
        check('mobile').matches(/^05[0-9]{8}$/).withMessage('Mobile number must start with 05 and contain 10 digits.').trim().escape(),
        check('birthdate').notEmpty().withMessage('Birth date is required.').trim().escape(),
        check('gender').isIn(['male', 'female']).withMessage('Gender must be selected from the provided list.').trim().escape(),
        check('language').isIn(['arabic', 'english', 'french']).withMessage('Language must be selected from the provided list.').trim().escape(),
        check('message').isLength({ min: 10, max: 200 }).withMessage('Message must be between 10 and 200 characters.').trim().escape()
    ];
}

function registrationValidation() {
    return [
        check('workshopDisplay').isIn(['candle', 'pottery', 'painting']).withMessage('Workshop must be selected from the workshops page.').trim().escape(),
        check('fullname').isLength({ min: 5, max: 40 }).withMessage('Full name must be between 5 and 40 characters.').matches(/^[A-Za-z ]+$/).withMessage('Full name must contain letters and spaces only.').trim().escape(),
        check('registeremail').isEmail().withMessage('Email format is invalid.').normalizeEmail(),
        check('registermobile').matches(/^05[0-9]{8}$/).withMessage('Mobile number must start with 05 and contain 10 digits.').trim().escape(),
        check('gender').isIn(['male', 'female']).withMessage('Gender must be selected from the provided list.').trim().escape(),
        check('workshopdate').notEmpty().withMessage('Preferred date is required.').trim().escape(),
        check('workshoptime').notEmpty().withMessage('Preferred time is required.').trim().escape(),
        check('notes').optional({ checkFalsy: true }).isLength({ min: 5, max: 200 }).withMessage('Notes must be between 5 and 200 characters.').trim().escape()
    ];
}

function printErrors(errors, returnLink) {
    let html = pageHeader('Validation Errors');
    html += '<h1>Sorry, we found validation errors with your submission</h1><ul>';
    errors.array().forEach(error => {
        html += `<li>${error.msg}</li>`;
    });
    html += `</ul><p><a href="${returnLink}">Click here</a> to return.</p>`;
    html += pageFooter();
    return html;
}

// ================= INSERT FUNCTIONS =================
function addContact(data, response) {
    const db = openConnection();

    db.connect(function (err) {
        if (err) {
            response.send(databaseError(err));
            return;
        }

        const sql = `INSERT INTO contact_messages
            (fname, lname, email, mobile, birthdate, gender, language, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [data.fname, data.lname, data.email, data.mobile, data.birthdate, data.gender, data.language, data.message];

        db.query(sql, values, function (err) {
            db.end();
            if (err) {
                response.send(databaseError(err));
            } else {
                response.json({
                 success: true,
                message: "Contact message saved successfully"
});
            }
        });
    });
}

function addRegistration(data, response) {
    const db = openConnection();

    db.connect(function (err) {
        if (err) {
            response.send(databaseError(err));
            return;
        }

        const sql = `INSERT INTO workshop_registrations
            (workshop, fullname, email, mobile, gender, workshop_date, workshop_time, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [data.workshopDisplay, data.fullname, data.registeremail, data.registermobile, data.gender, data.workshopdate, data.workshoptime, data.notes || ''];

        db.query(sql, values, function (err) {
            db.end();
            if (err) {
                response.send(databaseError(err));
            } else {
                response.json({
                      success: true,
                    message: "Workshop registration saved successfully"
});
            }
        });
    });
}

// ================= POST ROUTES =================
app.post('/contact', contactValidation(), function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
        error: errors.array().map(error => error.msg).join("<br>")
        });
    } else {
        addContact(request.body, response);
    }
});

app.post('/register', registrationValidation(), function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
        error: errors.array().map(error => error.msg).join("<br>")
        });
    } else {
        addRegistration(request.body, response);
    }
});

// ================= SELECT ROUTES =================
app.get('/contact-data', function (request, response) {
    const db = openConnection();
    db.connect(function (err) {
        if (err) {
            response.send(databaseError(err));
            return;
        }

        const sql = 'SELECT * FROM contact_messages ORDER BY id DESC';
        db.query(sql, function (err, rows) {
            db.end();
            if (err) {
                response.send(databaseError(err));
                return;
            }

            let html = pageHeader('Contact Messages');
            if (request.query.success) html += '<h1>Thank you, we got your message!</h1>';
            html += '<h2>Saved Contact Messages</h2>';
            html += '<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Gender</th><th>Language</th><th>Message</th><th>Date</th></tr>';
            rows.forEach(row => {
                html += `<tr><td>${row.id}</td><td>${row.fname} ${row.lname}</td><td>${row.email}</td><td>${row.mobile}</td><td>${row.gender}</td><td>${row.language}</td><td>${row.message}</td><td>${row.created_at}</td></tr>`;
            });
            html += '</table><p><a href="/contact.html">Back to Contact Form</a></p>';
            html += pageFooter();
            response.send(html);
        });
    });
});

app.get('/registration-data', function (request, response) {
    const db = openConnection();
    db.connect(function (err) {
        if (err) {
            response.send(databaseError(err));
            return;
        }

        const sql = 'SELECT * FROM workshop_registrations ORDER BY id DESC';
        db.query(sql, function (err, rows) {
            db.end();
            if (err) {
                response.send(databaseError(err));
                return;
            }

            let html = pageHeader('Workshop Registrations');
            if (request.query.success) html += '<h1>Thank you, your registration has been saved!</h1>';
            html += '<h2>Saved Workshop Registrations</h2>';
            html += '<table><tr><th>ID</th><th>Workshop</th><th>Name</th><th>Email</th><th>Mobile</th><th>Gender</th><th>Date</th><th>Time</th><th>Notes</th></tr>';
            rows.forEach(row => {
                html += `<tr><td>${row.id}</td><td>${row.workshop}</td><td>${row.fullname}</td><td>${row.email}</td><td>${row.mobile}</td><td>${row.gender}</td><td>${row.workshop_date}</td><td>${row.workshop_time}</td><td>${row.notes}</td></tr>`;
            });
            html += '</table><p><a href="/workshops.html">Back to Workshops</a></p>';
            html += pageFooter();
            response.send(html);
        });
    });
});

// ================= PAGE HELPERS =================
function pageHeader(title) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>body{padding:30px}.data-page{max-width:1200px;margin:auto}table{width:100%;border-collapse:collapse;background:white}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f4f4f4}a{color:#7b4b2a;font-weight:bold}</style>
    </head><body><main class="data-page">`;
}

function pageFooter() {
    return '</main></body></html>';
}

function databaseError(err) {
    return pageHeader('Database Error') + `<h1>Database Error</h1><p>${err.message}</p><p>Check that MySQL/MAMP is running and that you imported database.sql.</p><p><a href="/index.html">Back Home</a></p>` + pageFooter();
}

// ================= START SERVER =================
app.listen(PORT, function () {
    console.log('Server is running on http://localhost:' + PORT);
});
