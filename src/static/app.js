document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const card = document.createElement("div");
        card.className = "activity-card";

        const title = document.createElement("h4");
        title.textContent = name;

        const schedule = document.createElement("p");
        schedule.innerHTML = `<strong>Schedule:</strong> `;
        const scheduleText = document.createTextNode(details.schedule);
        schedule.appendChild(scheduleText);

        const location = document.createElement("p");
        location.innerHTML = `<strong>Location:</strong> `;
        const locationText = document.createTextNode(details.location);
        location.appendChild(locationText);

        const participantsDiv = document.createElement("div");
        participantsDiv.className = "participants-list";

        const participantsTitle = document.createElement("h5");
        participantsTitle.textContent = "Current Participants:";
        participantsDiv.appendChild(participantsTitle);

        const participantsList = document.createElement("ul");
        if (details.participants.length > 0) {
          details.participants.forEach(email => {
            const listItem = document.createElement("li");
            listItem.textContent = email;
            participantsList.appendChild(listItem);
          });
        } else {
          const noParticipantsItem = document.createElement("li");
          noParticipantsItem.textContent = "No participants yet";
          participantsList.appendChild(noParticipantsItem);
        }
        participantsDiv.appendChild(participantsList);

        card.appendChild(title);
        card.appendChild(schedule);
        card.appendChild(location);
        card.appendChild(participantsDiv);

        activitiesList.appendChild(card);

        // Also update the select options
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
