// =========================
// MOBILE NAVIGATION
// =========================

const menuButton =
    document.getElementById(
        "menuButton"
    );

const navLinks =
    document.getElementById(
        "navLinks"
    );


menuButton.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "open"
        );

    }
);


// =========================
// CHECK HEAT RISK
// =========================

document.getElementById(
    "checkRiskButton"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "risk.html";

    }
);


// =========================
// HOW IT WORKS
// =========================

document.getElementById(
    "learnButton"
).addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "services"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =========================
// SCROLL BUTTON
// =========================

document.getElementById(
    "scrollButton"
).addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "services"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =========================
// SERVICE CARDS
// =========================

document
    .querySelectorAll(
        ".service-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const page =
                    card.dataset.page;

                if (page) {

                    window.location.href =
                        page;

                }

            }
        );

    });


// =========================
// LOCATION
// =========================

const locationButton =
    document.getElementById(
        "locationButton"
    );

const locationText =
    document.getElementById(
        "locationText"
    );


locationButton.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            locationText.textContent =
                "Location unavailable";

            return;

        }


        locationText.textContent =
            "Detecting...";


        navigator.geolocation
            .getCurrentPosition(

                () => {

                    locationText.textContent =
                        "Location detected ✓";

                },

                () => {

                    locationText.textContent =
                        "Allow location access";

                }

            );

    }
);


// =========================
// NAVBAR EFFECT
// =========================

const navbar =
    document.querySelector(
        ".navbar"
    );


window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 40
        ) {

            navbar.style.position =
                "fixed";

            navbar.style.background =
                "rgba(10,14,20,0.88)";

            navbar.style.backdropFilter =
                "blur(18px)";

            navbar.style.borderBottom =
                "1px solid rgba(255,255,255,0.06)";

        }

        else {

            navbar.style.position =
                "absolute";

            navbar.style.background =
                "transparent";

            navbar.style.borderBottom =
                "none";

        }

    }
);