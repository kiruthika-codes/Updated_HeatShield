// =====================================================
// HEATSHIELD LOGIN
// =====================================================


const loginForm =
    document.getElementById("loginForm");


const loginMessage =
    document.getElementById("loginMessage");


const passwordInput =
    document.getElementById("password");


const togglePassword =
    document.getElementById("togglePassword");


const guestButton =
    document.getElementById("guestButton");


const forgotPassword =
    document.getElementById("forgotPassword");


// =====================================================
// SHOW / HIDE PASSWORD
// =====================================================

togglePassword.addEventListener(
    "click",
    () => {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "Hide";

        }

        else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "Show";

        }

    }
);


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            passwordInput.value;


        const remember =
            document
                .getElementById("rememberMe")
                .checked;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;

        }


        if (password.length < 4) {

            showMessage(
                "Password must contain at least 4 characters.",
                "error"
            );

            return;

        }


        // ---------------------------------------------
        // SAVE LOGIN STATE
        // ---------------------------------------------

        localStorage.setItem(
            "heatShieldLoggedIn",
            "true"
        );


        localStorage.setItem(
            "heatShieldUser",
            email
        );


        localStorage.setItem(
            "heatShieldRemember",
            remember
        );


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        showMessage(
            "Login successful. Opening HeatShield...",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "index.html";

            },
            700
        );

    }
);


// =====================================================
// GUEST LOGIN
// =====================================================

guestButton.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "heatShieldLoggedIn",
            "true"
        );


        localStorage.setItem(
            "heatShieldUser",
            "Guest"
        );


        localStorage.setItem(
            "heatShieldGuest",
            "true"
        );


        showMessage(
            "Entering HeatShield as Guest...",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "index.html";

            },
            600
        );

    }
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

forgotPassword.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        alert(
            "Password recovery will be available in the next version."
        );

    }
);


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;


    if (type === "success") {

        loginMessage.style.color =
            "#68c391";

    }

    else {

        loginMessage.style.color =
            "#ff8170";

    }

}