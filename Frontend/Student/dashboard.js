// Backend API URL
const API_URL = "http://localhost:8080/api/domains";

// HTML Elements
const domainsContainer = document.getElementById("domainsContainer");

const logoutButton = document.getElementById("logoutButton");


// Page open hote hi domains load karna
loadDomains();


// 1. Load All Domains
async function loadDomains() {

    try {

        // Backend ko GET request bhejna
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load domains");
        }

        // Backend se JSON data lena
        const domains = await response.json();

        // Purana content clear karna
        domainsContainer.innerHTML = "";

        // Agar koi domain nahi hai
        if (domains.length === 0) {

            domainsContainer.textContent = "No domains available.";

            return;
        }

        // Har domain ka card banana
        domains.forEach(function(domain) {

            // Sirf ACTIVE domains dikhana
            if (domain.status !== "ACTIVE") {
                return;
            }

            // Card
            const card = document.createElement("div");
            card.className = "domain-card";

            // Domain Name
            const title = document.createElement("h3");
            title.textContent = domain.domainName;

            // Domain Description
            const description = document.createElement("p");
            description.textContent = domain.description;

            // Practice Button
            const practiceButton = document.createElement("button");

            practiceButton.textContent = "Practice Now";

            practiceButton.className = "practice-btn";

            // Practice Button Click
            practiceButton.addEventListener("click", function() {

                startPractice(domain.id);

            });

            // Elements ko card mein add karna
            card.appendChild(title);

            card.appendChild(description);

            card.appendChild(practiceButton);

            // Card ko webpage par add karna
            domainsContainer.appendChild(card);

        });

    } catch (error) {

        domainsContainer.textContent = "Error loading domains.";

        console.log(error);

    }
}


// 2. Practice Button
function startPractice(domainId) {

    // Selected domain ki ID save karna
    sessionStorage.setItem("selectedDomainId", domainId);

    alert("Domain selected! Domain ID: " + domainId);

}


// 3. Logout Button
logoutButton.addEventListener("click", function() {

    // Temporary session data clear karna
    sessionStorage.clear();

    // Login page par redirect karna
    window.location.href = "../login.html";

});