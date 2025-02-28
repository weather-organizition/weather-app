const API_KEY = "b96487ed0b804c0e8ce52629251602";
const PEXELS_API_KEY = "Qym5GvbpnwpZ17rsVnIinRACfjJo6t0x8S5v1ktVWQCH4yVkcRl9ZchH";

function fetchWeatherData(location) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&alerts=yes`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) { n
        return data;
      } else {
        throw new Error("No data received from the API");
      }
    })
    .catch(handleApiError);
}

function handleApiError(error) {
  console.error("Error fetching weather data:", error);
  // soo bandhigista error ka message ee user 
  document.querySelector(
    "#current-conditions"
  ).innerHTML = `<p class="error">Error: ${error.message}</p>`;
  document.querySelector(
    ".container"
  ).innerHTML = `<p class="error">Error: ${error.message}</p>`;
}

function updateWeatherUI(data) {
  // isbadalayaan location ka hada la tagan yahay
  document.querySelector(
    '[data-weather-type="icon"]'
  ).src = `https:${data.current.condition.icon}`;
  document.querySelector('[data-weather-type="icon"]').alt =
    data.current.condition.text;
  document.querySelector('[data-weather-type="description"]').textContent =
    data.current.condition.text;
  document
    .querySelectorAll("#Location")
    .forEach((el) => (el.textContent = data.location.name));
  document.querySelector(
    '[data-weather-type="temp"]'
  ).textContent = `${data.current.temp_f}°F`;
  document.querySelector(
    '[data-weather-type="wind"]'
  ).textContent = `${data.current.wind_kph} kph`;
  document.querySelector(
    '[data-weather-type="humidity"]'
  ).textContent = `${data.current.humidity}%`;


  // isbadalayaan alerts ka
  updateAlerts(data.alerts ? data.alerts.alert : []);

  // Update background
  // isbadalayaan background ka 
  updateBackground(data.current.condition.text);
}

function updateAlerts(alerts) {
  const activeContainer = document.querySelector(".container");
  activeContainer.innerHTML = "";

  if (alerts.length > 0) {
    const uniqueAlerts = filterUniqueAlerts(alerts);
    uniqueAlerts.forEach((alert) => {
      const alertElement = createAlertElement(alert);
      if (alertElement) {
        activeContainer.appendChild(alertElement);
      }
    });
  } else {
    const noAlertMessage = document.createElement("p");
    noAlertMessage.textContent = "No active weather alerts.";
    activeContainer.appendChild(noAlertMessage);
  }
}

function filterUniqueAlerts(alerts) {
  const uniqueAlerts = new Map();
  alerts.forEach((alert) => {
    const key = `${alert.event}-${alert.areas}`;
    if (!uniqueAlerts.has(key)) {
      uniqueAlerts.set(key, alert);
    }
  });
  return Array.from(uniqueAlerts.values());
}

function createAlertElement(alert) {
  const template = document.getElementById("alert-severe");
  if (!template) {
    console.error("Template element with ID 'alert-severe' not found.");
    return null;
  }

  const alertElement = template.content.cloneNode(true);

  alertElement.querySelector("h3").textContent = alert.headline || alert.event;
  alertElement.querySelector(".alert-location").textContent = `${alert.areas}`;
  alertElement.querySelector(".alert-details").textContent =
    alert.instruction || alert.desc;
  alertElement.querySelector(".alert-id").textContent =
    alert.severity || alert.category || alert.msgtype || alert.event;
  alertElement.querySelector(".alert-time-remaining").textContent = new Date(
    alert.effective
  ).toLocaleTimeString();

  return alertElement.firstElementChild;
}

function updateBackground(weatherDescription) {
  const searchTerm = getBackgroundSearchTerm(weatherDescription);
  fetchBackgroundImage(searchTerm);
}

function getBackgroundSearchTerm(description) {
  const lowerDesc = description.toLowerCase();
  if (
    lowerDesc.includes("rain") ||
    lowerDesc.includes("shower") ||
    lowerDesc.includes("drizzle")
  ) {
    return "rainy weather";
  } else if (lowerDesc.includes("cloud") || lowerDesc.includes("overcast")) {
    return "cloudy sky";
  } else if (lowerDesc.includes("sunny") || lowerDesc.includes("clear")) {
    return "sunny sky";
  } else if (lowerDesc.includes("snow") || lowerDesc.includes("blizzard")) {
    return "snowy weather";
  } else if (lowerDesc.includes("fog") || lowerDesc.includes("mist")) {
    return "foggy weather";
  } else if (lowerDesc.includes("wind") || lowerDesc.includes("breeze")) {
    return "windy weather";
  } else if (lowerDesc.includes("storm") || lowerDesc.includes("thunder")) {
    return "stormy weather";
  }
  return "weather";
}

function fetchBackgroundImage(searchTerm) {
  fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=1`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.photos && data.photos.length > 0) {
        const imageUrl = data.photos[0].src.landscape;
        document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${imageUrl}')`;
      } else {
        console.warn("No images found for:", searchTerm);
      }
    })
    .catch((error) => {
      console.error("Error fetching image from Pexels:", error);
    });
}

function searchWeather() {
  const locationInput = document.querySelector("#cityInput").value;
  if (locationInput) {
    fetchWeatherData(locationInput)
      .then(updateWeatherUI)
      .catch((error) => {
        console.error("Failed to fetch weather data:", error);
        handleApiError(error);
      });
  } else {
    alert("Please enter a location.");
  }
}


// dhageysiga dhacdada marka button search aan click gareeyo
document.querySelector("#btn").addEventListener("click", searchWeather);


// dhageysiga dhacdada marka Enter aan ku dhufano
document
  .querySelector("#cityInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      searchWeather();
    }
  });


// qiimo default ah sii weather ka loogu soo bandhigayo
fetchWeatherData("london")
  .then(updateWeatherUI)
  .catch((error) => {
    console.error("Failed to fetch initial weather data:", error);
    handleApiError(error);
  });


 
//Dark mode functionality section
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');

  // hubi in ay active thy 
  if (document.body.classList.contains('dark-mode')) {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon'); 
  } else {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun'); 
  }

  // Toggle dark mode marka button la taabto
  darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      // Updating the icon iyado lo egayo current state
      if (document.body.classList.contains('dark-mode')) {
          darkModeIcon.classList.remove('fa-sun');
          darkModeIcon.classList.add('fa-moon');
      } else {
          darkModeIcon.classList.remove('fa-moon');
          darkModeIcon.classList.add('fa-sun'); 
      }
  });