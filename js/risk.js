// =========================
// HEAT DATA
// =========================

const heatData = {

    location: "Your Area",

    temperature: 38,

    humidity: 48,

    uv: 8,

    wind: 12,

    feelsLike: 42,

    heatIndex: 42,

    risk: "HIGH HEAT RISK",

    message:
        "Dangerous heat conditions are present. Extra precautions are recommended."

};


// =========================
// LOAD HEAT DATA
// =========================

function loadHeatData() {

    document.getElementById(
        "locationName"
    ).textContent =
        heatData.location;


    document.getElementById(
        "temperature"
    ).textContent =
        heatData.temperature;


    document.getElementById(
        "humidity"
    ).textContent =
        heatData.humidity;


    document.getElementById(
        "uvIndex"
    ).textContent =
        heatData.uv;


    document.getElementById(
        "wind"
    ).textContent =
        heatData.wind;


    document.getElementById(
        "feelsLike"
    ).textContent =
        `${heatData.feelsLike}°C`;


    document.getElementById(
        "heatIndex"
    ).textContent =
        heatData.heatIndex;


    document.getElementById(
        "riskLevel"
    ).textContent =
        heatData.risk;


    document.getElementById(
        "riskMessage"
    ).textContent =
        heatData.message;

}


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
                "Unavailable";

            return;

        }


        locationText.textContent =
            "Detecting...";


        navigator.geolocation.getCurrentPosition(

            position => {

                const locationData = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                };


                localStorage.setItem(
                    "heatShieldLocation",
                    JSON.stringify(
                        locationData
                    )
                );


                locationText.textContent =
                    "Location detected";


                document.getElementById(
                    "locationName"
                ).textContent =
                    "Your Location";

            },


            () => {

                locationText.textContent =
                    "Permission denied";

            }

        );

    }
);


// =========================
// MOBILE MENU
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
// SAFETY MODAL
// =========================

const modal =
    document.getElementById(
        "infoModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalText =
    document.getElementById(
        "modalText"
    );


const learnButtons =
    document.querySelectorAll(
        ".learn-button"
    );


learnButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                modalTitle.textContent =
                    button.dataset.title;


                modalText.textContent =
                    button.dataset.text;


                modal.classList.add(
                    "show"
                );

            }
        );

    }
);


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    modal.classList.remove(
        "show"
    );

}


document.getElementById(
    "modalClose"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "modalDone"
).addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// =========================
// ESC KEY
// =========================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// =========================
// EMERGENCY GUIDANCE
// =========================

document.getElementById(
    "emergencyButton"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "emergency.html";

    }
);


// =========================
// UPDATE TIME
// =========================

function updateTime() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    document.getElementById(
        "updatedTime"
    ).textContent =
        `Updated ${time}`;

}


// =========================
// INITIALIZE
// =========================

loadHeatData();

updateTime();