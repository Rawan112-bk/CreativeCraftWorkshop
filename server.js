// ================= CONTACT FORM =================

const contactForm = document.querySelector("#contactForm");
const msg = document.querySelector("#msg");

if (contactForm) {

    contactForm.addEventListener('submit', e => {

        e.preventDefault();

        let messages = [];

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
        }

        messages = isFilled("fname", messages, "First name is missing");
        messages = isName("fname", messages, "First name must contain letters only");

        messages = isFilled("lname", messages, "Last name is missing");
        messages = isName("lname", messages, "Last name must contain letters only");

        messages = isFilled("email", messages, "Email is missing");
        messages = isEmail("email", messages, "Email format is wrong");

        messages = isFilled("mobile", messages, "Mobile is missing");
        messages = isMobile("mobile", messages, "Mobile must contain 10 numbers");

        messages = isFilled("birthdate", messages, "Birth date is missing");

        //  FIXED (form scoped)
        messages = isRadioSelected("gender", contactForm, messages, "Gender must be selected");

        const languageList = ['arabic', 'english', 'french'];
        messages = isWhiteListed("language", languageList, messages, "Language selection is invalid");

        messages = isFilled("message", messages, "Message is missing");
        messages = isLength("message", 10, messages, "Message must be at least 10 characters");

        if (messages.length > 0) {
            msg.style.color = "red";
            msg.innerHTML = "Issues found [" + messages.length + "]:<br>" + messages.join("<br>");
        } else {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    msg.style.color = "red";
                    msg.innerHTML = result.error;
                } else {
                    msg.style.color = "green";
                    msg.innerHTML = result.success;
                }
            })
            .catch(error => {
                msg.style.color = "red";
                msg.innerHTML = "Error: " + error.message;
            });
        }

    });

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

        if (!registerForm.checkValidity()) {
            registerForm.reportValidity();
        }

        messages = isFilled("fullname", messages, "Full name is missing");
        messages = isName("fullname", messages, "Full name must contain letters only");

        messages = isFilled("registeremail", messages, "Email is missing");
        messages = isEmail("registeremail", messages, "Email format is wrong");

        messages = isFilled("registermobile", messages, "Mobile is missing");
        messages = isMobile("registermobile", messages, "Mobile must contain 10 numbers");

        messages = isFilled("workshopdate", messages, "Date is missing");
        messages = isFilled("workshoptime", messages, "Time is missing");

        // FIXED (form scoped)
        messages = isRadioSelected("gender", registerForm, messages, "Gender must be selected");

        if (messages.length > 0) {
            registerMsg.style.color = "red";
            registerMsg.innerHTML = "Issues found [" + messages.length + "]:<br>" + messages.join("<br>");
        } else {
            const data = {
                fullname: registerForm.fullname.value,
                email: registerForm.registeremail.value,
                mobile: registerForm.registermobile.value,
                gender: registerForm.gender.value,
                date: registerForm.workshopdate.value,
                time: registerForm.workshoptime.value
            };
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    registerMsg.style.color = "red";
                    registerMsg.innerHTML = result.error;
                } else {
                    registerMsg.style.color = "green";
                    registerMsg.innerHTML = result.success;
                }
            })
            .catch(error => {
                registerMsg.style.color = "red";
                registerMsg.innerHTML = "Error: " + error.message;
            });
        }

    });

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

function getValue(name, form = document) {
    const elements = form.getElementsByName(name);

    if (!elements || elements.length === 0) return "";

    if (elements[0].type === "radio") {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "";
    }

    return elements[0].value.trim();
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

//  FIXED RADIO VALIDATION (FORM SCOPED)
function isRadioSelected(name, form, messages, msg) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    if (!checked) messages.push(msg);
    return messages;
}
