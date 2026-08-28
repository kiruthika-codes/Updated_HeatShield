// =====================================================
// HEATSHIELD — ABOUT
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const navLinks =
    document.getElementById("navLinks");

const menuButton =
    document.getElementById("menuButton");

const locationButton =
    document.getElementById("locationButton");

const locationText =
    document.getElementById("locationText");

const exploreButton =
    document.getElementById("exploreButton");

const missionButton =
    document.getElementById("missionButton");

const riskButton =
    document.getElementById("riskButton");

const safetyButton =
    document.getElementById("safetyButton");


// =====================================================
// MOBILE NAVIGATION
// =====================================================

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "open"
            );

        }
    );

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "open"
                );

            }
        );

    });


// =====================================================
// EXPLORE BUTTON
// =====================================================

exploreButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "risk.html";

    }
);


// =====================================================
// MISSION BUTTON
// =====================================================

missionButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("mission")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================================
// CTA BUTTONS
// =====================================================

riskButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "risk.html";

    }
);


safetyButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "safety.html";

    }
);


// =====================================================
// LOCATION
// =====================================================

locationButton.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            locationText.textContent =
                "Unavailable";

            return;

        }


        locationText.textContent =
            "Detecting...";


        navigator.geolocation.getCurrentPosition(

            position => {

                localStorage.setItem(
                    "heatShieldLocation",
                    JSON.stringify({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    })
                );


                locationText.textContent =
                    "Location detected";

            },

            () => {

                locationText.textContent =
                    "Try again";

            }

        );

    }
);


// =====================================================
// CARD INTERACTION
// =====================================================

document
    .querySelectorAll(
        ".problem-card, .value-card, .flow-card"
    )
    .forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "translateY(-4px)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });


// =====================================================
// INITIALIZE
// =====================================================

console.log(
    "HeatShield About page loaded successfully."
);
