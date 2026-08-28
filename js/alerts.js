// =====================================================
// HEATSHIELD ALERTS
// alerts.js
// =====================================================


// =====================================================
// ALERT DATA
// =====================================================

const alertsData = {

    high: {

        label: "HIGH ALERT",

        title:
            "High heat conditions expected",

        text:
            "Temperatures may reach dangerous levels during the afternoon. Limit prolonged outdoor activity, stay hydrated and take regular breaks in a cooler environment.",

        icon: "!",

        color: "high"

    },


    extreme: {

        label: "EXTREME ALERT",

        title:
            "Extreme heat may develop",

        text:
            "Conditions could become hazardous, especially for older adults, children and people working outdoors. Avoid unnecessary exposure to extreme heat.",

        icon: "!",

        color: "extreme"

    },


    information: {

        label: "HEAT INFORMATION",

        title:
            "Warmer conditions may continue",

        text:
            "HeatShield is monitoring conditions throughout the week. Keep checking the heat risk and alerts pages as conditions change.",

        icon: "i",

        color: "information"

    }

};


// =====================================================
// ELEMENTS
// =====================================================

const navLinks =
    document.getElementById(
        "navLinks"
    );


const menuButton =
    document.getElementById(
        "menuButton"
    );


const locationButton =
    document.getElementById(
        "locationButton"
    );


const locationText =
    document.getElementById(
        "locationText"
    );


const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


const alertCards =
    document.querySelectorAll(
        ".alert-card"
    );


const emptyAlerts =
    document.getElementById(
        "emptyAlerts"
    );


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


// Close mobile menu when a link is clicked

document
    .querySelectorAll(
        ".nav-links a"
    )
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
// ALERT FILTER
// =====================================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                // Remove active state

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Activate selected filter

                button.classList.add(
                    "active"
                );


                const selectedFilter =
                    button.dataset.filter;


                let visibleCount = 0;


                alertCards.forEach(
                    card => {

                        const level =
                            card.dataset.level;


                        let shouldShow =
                            false;


                        // ALL

                        if (
                            selectedFilter ===
                            "all"
                        ) {

                            shouldShow =
                                true;

                        }


                        // HIGH

                        else if (
                            selectedFilter ===
                            "high"
                        ) {

                            shouldShow =
                                level ===
                                "high";

                        }


                        // EXTREME

                        else if (
                            selectedFilter ===
                            "extreme"
                        ) {

                            shouldShow =
                                level ===
                                "extreme";

                        }


                        if (shouldShow) {

                            card.style.display =
                                "flex";

                            visibleCount++;

                        }

                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                // Empty state

                if (
                    visibleCount === 0
                ) {

                    emptyAlerts.classList.add(
                        "show"
                    );

                }

                else {

                    emptyAlerts.classList.remove(
                        "show"
                    );

                }

            }
        );

    }
);


// =====================================================
// ALERT MODAL
// =====================================================

const alertModal =
    document.getElementById(
        "alertModal"
    );


const modalIcon =
    document.getElementById(
        "modalIcon"
    );


const modalLabel =
    document.getElementById(
        "modalLabel"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalText =
    document.getElementById(
        "modalText"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const modalDismiss =
    document.getElementById(
        "modalDismiss"
    );


const modalSafetyButton =
    document.getElementById(
        "modalSafetyButton"
    );


// =====================================================
// OPEN ALERT MODAL
// =====================================================

function openAlertModal(
    alertType
) {

    const alert =
        alertsData[alertType];


    if (!alert) {
        return;
    }


    modalIcon.textContent =
        alert.icon;


    modalLabel.textContent =
        alert.label;


    modalTitle.textContent =
        alert.title;


    modalText.textContent =
        alert.text;


    // Change modal styling

    modalIcon.className =
        "modal-icon";


    if (
        alert.color ===
        "extreme"
    ) {

        modalIcon.style.color =
            "#e96b5b";

        modalIcon.style.background =
            "rgba(220,68,58,0.10)";

    }

    else if (
        alert.color ===
        "information"
    ) {

        modalIcon.style.color =
            "#76a7c6";

        modalIcon.style.background =
            "rgba(103,151,185,0.08)";

    }

    else {

        modalIcon.style.color =
            "#ff7540";

        modalIcon.style.background =
            "rgba(255,105,57,0.10)";

    }


    alertModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


// =====================================================
// VIEW DETAILS BUTTONS
// =====================================================

const viewAlertButtons =
    document.querySelectorAll(
        ".view-alert-button"
    );


viewAlertButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const alertType =
                    button.dataset.alert;


                openAlertModal(
                    alertType
                );

            }
        );

    }
);


// =====================================================
// CLOSE MODAL
// =====================================================

function closeAlertModal() {

    alertModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeAlertModal
    );

}


if (modalDismiss) {

    modalDismiss.addEventListener(
        "click",
        closeAlertModal
    );

}


// =====================================================
// CLICK OUTSIDE MODAL
// =====================================================

alertModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            alertModal
        ) {

            closeAlertModal();

        }

    }
);


// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAlertModal();

        }

    }
);


// =====================================================
// SAFETY GUIDE BUTTON
// =====================================================

if (modalSafetyButton) {

    modalSafetyButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "safety.html";

        }
    );

}


// =====================================================
// MAIN SAFETY BUTTON
// =====================================================

const safetyButton =
    document.getElementById(
        "safetyButton"
    );


if (safetyButton) {

    safetyButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "safety.html";

        }
    );

}


// =====================================================
// LOCATION BUTTON
// =====================================================

if (locationButton) {

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

                    const latitude =
                        position.coords.latitude;


                    const longitude =
                        position.coords.longitude;


                    // Store location

                    localStorage.setItem(
                        "heatShieldLocation",
                        JSON.stringify({

                            latitude:
                                latitude,

                            longitude:
                                longitude

                        })
                    );


                    locationText.textContent =
                        "Location detected";

                },


                error => {

                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {

                        locationText.textContent =
                            "Permission denied";

                    }

                    else {

                        locationText.textContent =
                            "Try again";

                    }

                }

            );

        }
    );

}


// =====================================================
// NOTIFICATION BUTTON
// =====================================================

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        () => {

            // Browser supports notifications

            if (
                "Notification" in window
            ) {

                if (
                    Notification.permission ===
                    "granted"
                ) {

                    enableNotifications();

                }

                else if (
                    Notification.permission !==
                    "denied"
                ) {

                    Notification
                        .requestPermission()
                        .then(
                            permission => {

                                if (
                                    permission ===
                                    "granted"
                                ) {

                                    enableNotifications();

                                }

                                else {

                                    showNotificationMessage();

                                }

                            }
                        );

                }

                else {

                    showNotificationMessage();

                }

            }

            else {

                showNotificationMessage();

            }

        }
    );

}


// =====================================================
// ENABLE NOTIFICATIONS
// =====================================================

function enableNotifications() {

    localStorage.setItem(
        "heatShieldNotifications",
        "enabled"
    );


    notificationButton.textContent =
        "Alerts enabled ✓";


    notificationButton.classList.add(
        "enabled"
    );

}


// =====================================================
// NOTIFICATION FALLBACK
// =====================================================

function showNotificationMessage() {

    localStorage.setItem(
        "heatShieldNotifications",
        "enabled"
    );


    notificationButton.textContent =
        "Alerts enabled ✓";


    notificationButton.classList.add(
        "enabled"
    );


    setTimeout(
        () => {

            alert(
                "HeatShield alerts are enabled for this device."
            );

        },
        150
    );

}


// =====================================================
// RESTORE NOTIFICATION STATE
// =====================================================

function restoreNotificationState() {

    const notificationState =
        localStorage.getItem(
            "heatShieldNotifications"
        );


    if (
        notificationState ===
        "enabled"
    ) {

        notificationButton.textContent =
            "Alerts enabled ✓";


        notificationButton.classList.add(
            "enabled"
        );

    }

}


// =====================================================
// CLOSE MOBILE MENU WHEN RESIZING
// =====================================================

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            800
        ) {

            navLinks.classList.remove(
                "open"
            );

        }

    }
);


// =====================================================
// INITIALIZE
// =====================================================

restoreNotificationState();

console.log(
    "HeatShield Alerts initialized."
);