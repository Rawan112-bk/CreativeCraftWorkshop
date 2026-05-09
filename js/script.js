// ================= CONTACT FORM =================

const contactForm = document.querySelector("#contactForm");
const msg = document.querySelector("#msg");

if (contactForm) {

    contactForm.addEventListener('submit', e => {

        e.preventDefault();

        let messages = [];

        //  HTML validation
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
        }

        //  JavaScript validation
        messages = isFilled("fname", messages, "First name is missing");
        messages = isName("fname", messages, "First name must contain letters only");

        messages = isFilled("lname", messages, "Last name is missing");
        messages = isName("lname", messages, "Last name must contain letters only");

        messages = isFilled("email", messages, "Email is missing");
        messages = isEmail("email", messages, "Email format is wrong");

        messages = isFilled("mobile", messages, "Mobile is missing");
        messages = isMobile("mobile", messages, "Mobile must contain 10 numbers");

        messages = isFilled("birthdate", messages, "Birth date is missing");

        const languageList = ['arabic', 'english', 'french'];
        messages = isWhiteListed("language", languageList, messages, "Language selection is invalid");

        messages = isFilled("message", messages, "Message is missing");
        messages = isLength("message", 10, messages, "Message must be at least 10 characters");


        if (messages.length > 0) {
            msg.style.color = "red";
            msg.innerHTML = "Issues found [" + messages.length + "]:<br>" + messages.join("<br>");
        } else {
            msg.style.color = "green";
            msg.innerHTML = "Form submitted successfully";
        }

    });

    // Reset message
    contactForm.querySelector('button[type="reset"]')
        ?.addEventListener('click', () => msg.innerHTML = "");
}


// ================= REGISTER FORM =================

const registerForm = document.querySelector("#registerForm");
const registerMsg = document.querySelector("#registerMsg");

if (registerForm) {

    registerForm.addEventListener('submit', e => {

        e.preventDefault();

        let messages = [];

        // HTML validation
        if (!registerForm.checkValidity()) {
            registerForm.reportValidity();
        }

        // JavaScript validation
        messages = isFilled("fullname", messages, "Full name is missing");
        messages = isName("fullname", messages, "Full name must contain letters only");

        messages = isFilled("registeremail", messages, "Email is missing");
        messages = isEmail("registeremail", messages, "Email format is wrong");

        messages = isFilled("registermobile", messages, "Mobile is missing");
        messages = isMobile("registermobile", messages, "Mobile must contain 10 numbers");

        messages = isFilled("workshopdate", messages, "Date is missing");
        messages = isFilled("workshoptime", messages, "Time is missing");


        if (messages.length > 0) {
            registerMsg.style.color = "red";
            registerMsg.innerHTML = "Issues found [" + messages.length + "]:<br>" + messages.join("<br>");
        } else {
            registerMsg.style.color = "green";
            registerMsg.innerHTML = "Booking submitted successfully";
        }

    });

    // Reset message
    registerForm.querySelector('button[type="reset"]')
        ?.addEventListener('click', () => registerMsg.innerHTML = "");
}


// ================= BACK BUTTON =================

const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "workshops.html";
    });
}


// ================= AUTO WORKSHOP DISPLAY =================

const params = new URLSearchParams(window.location.search);
const type = params.get("type");

if (type) {

    const workshopDisplay = document.getElementById("workshopDisplay");
    const bookingTitle = document.getElementById("bookingTitle");

    if (workshopDisplay) {
        workshopDisplay.value = type;
    }

    if (bookingTitle) {

        if (type === "candle") {
            bookingTitle.innerText = "Candle Making Booking";
        } else if (type === "pottery") {
            bookingTitle.innerText = "Pottery Workshop Booking";
        } else if (type === "painting") {
            bookingTitle.innerText = "Painting Workshop Booking";
        } else {
            bookingTitle.innerText = "Workshop Booking";
        }
    }
}


// ================= VALIDATION FUNCTIONS =================

function getValue(name) {
    const el = document.getElementsByName(name)[0];
    return el ? el.value.trim() : "";
}

function isFilled(name, messages, msg) {
    if (getValue(name).length < 1) messages.push(msg);
    return messages;
}

function isEmail(name, messages, msg) {
    if (!getValue(name).match(/^[^@]+@[^@]+\.[^@]+$/)) messages.push(msg);
    return messages;
}

function isMobile(name, messages, msg) {
    if (!getValue(name).match(/^05[0-9]{8}$/)) messages.push(msg);
    return messages;
}

function isName(name, messages, msg) {
    if (!getValue(name).match(/^[A-Za-z ]+$/)) messages.push(msg);
    return messages;
}

function isWhiteListed(name, list, messages, msg) {
    if (!list.includes(getValue(name))) messages.push(msg);
    return messages;
}

function isLength(name, min, messages, msg) {
    if (getValue(name).length < min) messages.push(msg);
    return messages;
}
