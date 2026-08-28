// =====================================================
// HEATSHIELD — SAFETY
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

const startGuideButton =
    document.getElementById("startGuideButton");

const symptomsButton =
    document.getElementById("symptomsButton");

const stageTabs =
    document.querySelectorAll(".stage-tab");

const stageContent =
    document.getElementById("stageContent");

const actionCards =
    document.querySelectorAll(".action-card");

const symptomOptions =
    document.querySelectorAll(".symptom-option");

const symptomCount =
    document.getElementById("symptomCount");

const symptomResult =
    document.getElementById("symptomResult");

const emergencyButton =
    document.getElementById("emergencyButton");


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
// SAFETY STAGE DATA
// =====================================================

const stageData = {

    before: {

        title:
            "Prepare before the heat arrives.",

        description:
            "A little preparation can reduce your exposure and help you respond quickly when temperatures rise.",

        badge:
            "PREPARE",

        actions: [

            {
                number: "01",
                title: "Check the forecast",
                text:
                    "Know when the hottest part of the day is expected."
            },

            {
                number: "02",
                title: "Plan outdoor activity",
                text:
                    "Schedule demanding activities for cooler parts of the day."
            },

            {
                number: "03",
                title: "Prepare water",
                text:
                    "Keep drinking water available before heading outside."
            }

        ]

    },


    during: {

        title:
            "Protect yourself while temperatures are high.",

        description:
            "Reduce heat exposure, stay hydrated and pay attention to how your body feels.",

        badge:
            "PROTECT",

        actions: [

            {
                number: "01",
                title: "Stay hydrated",
                text:
                    "Drink water regularly and take frequent breaks."
            },

            {
                number: "02",
                title: "Find cooler spaces",
                text:
                    "Move into shade, ventilated areas or cooler indoor spaces."
            },

            {
                number: "03",
                title: "Limit exertion",
                text:
                    "Avoid strenuous activity during the hottest hours."
            }

        ]

    },


    after: {

        title:
            "Give your body time to recover.",

        description:
            "After heat exposure, continue cooling down and watch for symptoms that may require attention.",

        badge:
            "RECOVER",

        actions: [

            {
                number: "01",
                title: "Cool down",
                text:
                    "Rest in a cooler environment and allow your body temperature to settle."
            },

            {
                number: "02",
                title: "Replace fluids",
                text:
                    "Continue drinking fluids after prolonged heat exposure."
            },

            {
                number: "03",
                title: "Watch for symptoms",
                text:
                    "Pay attention to dizziness, weakness, confusion or worsening symptoms."
            }

        ]

    }

};


// =====================================================
// RENDER STAGE
// =====================================================

function renderStage(stage) {

    const data =
        stageData[stage];


    stageContent.innerHTML = `

        <div class="stage-top">

            <div>

                <h3>
                    ${data.title}
                </h3>

                <p>
                    ${data.description}
                </p>

            </div>

            <span class="stage-badge">
                ${data.badge}
            </span>

        </div>


        <div class="stage-actions">

            ${data.actions.map(
                action => `

                    <div class="stage-action">

                        <div class="stage-action-number">
                            ${action.number}
                        </div>

                        <h4>
                            ${action.title}
                        </h4>

                        <p>
                            ${action.text}
                        </p>

                    </div>

                `
            ).join("")}

        </div>

    `;

}


// =====================================================
// STAGE TABS
// =====================================================

stageTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                stageTabs.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                renderStage(
                    tab.dataset.stage
                );

            }
        );

    }
);


// =====================================================
// START GUIDE
// =====================================================

startGuideButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("guide")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================================
// SYMPTOM BUTTON
// =====================================================

symptomsButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("symptoms")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================================
// ACTION CARD DETAILS
// =====================================================

const actionDetails = {

    water:
        "Keep water accessible and drink regularly. During prolonged heat exposure, take frequent hydration breaks.",

    shade:
        "Use shade whenever possible and avoid standing in direct sunlight for long periods.",

    clothing:
        "Loose, lightweight clothing can help your body manage heat more comfortably.",

    activity:
        "Move strenuous activities to cooler parts of the day whenever possible."


};


actionCards.forEach(
    card => {

        const button =
            card.querySelector("button");


        button.addEventListener(
            "click",
            () => {

                const action =
                    card.dataset.action;


                alert(
                    actionDetails[action]
                );

            }
        );

    }
);


// =====================================================
// SYMPTOM CHECKER
// =====================================================

const selectedSymptoms =
    new Set();


function updateSymptomResult() {

    const count =
        selectedSymptoms.size;


    symptomCount.textContent =
        count;


    if (count === 0) {

        symptomResult.innerHTML = `

            <div class="result-icon">
                ✓
            </div>

            <h3>
                Stay alert
            </h3>

            <p>
                Select any symptoms you are experiencing
                to see general safety guidance.
            </p>

        `;

        return;

    }


    if (
        selectedSymptoms.has(
            "confusion"
        ) ||
        selectedSymptoms.has(
            "dizziness"
        )
    ) {

        symptomResult.innerHTML = `

            <div class="result-icon">
                !
            </div>

            <h3>
                Take action now
            </h3>

            <p>
                Move to a cooler place, stop strenuous
                activity and seek appropriate medical
                assistance if symptoms are severe,
                worsening or do not improve.
            </p>

        `;

        return;

    }


    if (count >= 3) {

        symptomResult.innerHTML = `

            <div class="result-icon">
                !
            </div>

            <h3>
                Multiple symptoms selected
            </h3>

            <p>
                Stop physical activity and move somewhere
                cooler. Hydrate and monitor your condition.
                Seek medical help if symptoms persist or worsen.
            </p>

        `;

        return;

    }


    symptomResult.innerHTML = `

        <div class="result-icon">
            !
        </div>

        <h3>
            Take a cooling break
        </h3>

        <p>
            Move to a cooler place, rest, drink fluids
            and monitor how you feel. If symptoms become
            severe or worsen, seek medical assistance.
        </p>

    `;

}


symptomOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            () => {

                const symptom =
                    option.dataset.symptom;


                if (
                    selectedSymptoms.has(
                        symptom
                    )
                ) {

                    selectedSymptoms.delete(
                        symptom
                    );

                    option.classList.remove(
                        "selected"
                    );

                }

                else {

                    selectedSymptoms.add(
                        symptom
                    );

                    option.classList.add(
                        "selected"
                    );

                }


                updateSymptomResult();

            }
        );

    }
);


// =====================================================
// EMERGENCY GUIDANCE
// =====================================================

emergencyButton.addEventListener(
    "click",
    () => {

        alert(
            "If someone develops severe symptoms such as confusion, loss of consciousness, seizures, or signs of severe overheating, move them to a cooler place and seek emergency medical assistance immediately."
        );

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
// INITIALIZE
// =====================================================

renderStage("before");

updateSymptomResult();

console.log(
    "HeatShield Safety page loaded successfully."
);