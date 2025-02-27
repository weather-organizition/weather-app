
//Default safety tips if Api does not have safety tips
const safetyData = {
  "Tornado Warning": [
    "Take shelter in a basement or an interior room without windows.",
    "Avoid mobile homes or vehicles; find a sturdy building.",
    "Cover yourself with a mattress or heavy blankets for protection.",
    "Listen to local weather updates and alerts.",
  ],
  "Severe Thunderstorm Warning": [
    "Stay indoors and avoid windows.",
    "Unplug electrical appliances to prevent power surges.",
    "Avoid using water and landline phones during the storm.",
    "Stay away from tall objects and isolated trees if outdoors.",
  ],
  "Flash Flood Warning": [
    "Move to higher ground immediately.",
    "Avoid walking or driving through floodwaters.",
    "Turn around, don't drown—just 6 inches of water can knock you down.",
    "Listen to emergency broadcasts for updates.",
  ],
  "Hurricane Warning": [
    "Evacuate if instructed by local authorities.",
    "Stock up on food, water, and emergency supplies.",
    "Secure outdoor objects and reinforce windows and doors.",
    "Stay indoors and avoid coastal areas.",
  ],
  "Winter Storm Warning": [
    "Stay indoors and keep warm with extra layers or blankets.",
    "Avoid traveling unless absolutely necessary.",
    "Keep a flashlight, food, and water in case of power outages.",
    "Be cautious of icy roads and sidewalks.",
  ],
  "Excessive Heat Warning": [
    "Stay hydrated and drink plenty of water.",
    "Avoid outdoor activities during peak heat hours (10 AM - 4 PM).",
    "Wear loose, light-colored clothing.",
    "Never leave children or pets in a parked car.",
  ],
  "High Wind Warning": [
    "Secure loose outdoor objects like patio furniture.",
    "Stay indoors and away from windows.",
    "Be cautious of falling tree branches and power lines.",
    "Avoid driving high-profile vehicles like trucks or RVs.",
  ],
  "Air Quality Alert": [
    "Limit outdoor activities, especially for children and elderly.",
    "Wear a mask if necessary, especially in areas with heavy smoke or pollution.",
    "Use air purifiers indoors to reduce exposure to pollutants.",
    "Keep windows and doors closed to maintain indoor air quality.",
  ],
  "Tsunami Warning": [
    "Move to higher ground immediately.",
    "Stay away from the shore until authorities declare it safe.",
    "Follow evacuation routes and emergency instructions.",
    "Do not attempt to watch the tsunami waves from the beach.",
  ],
  "Wildfire Warning": [
    "Prepare an emergency evacuation kit with essentials.",
    "Close all windows and doors to prevent smoke from entering.",
    "If told to evacuate, leave immediately.",
    "Avoid outdoor activities in smoky areas.",
  ],
};

const API_KEY = "b96487ed0b804c0e8ce52629251602";
const PEXELS_API_KEY =
  "Qym5GvbpnwpZ17rsVnIinRACfjJo6t0x8S5v1ktVWQCH4yVkcRl9ZchH";

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
      if (data) {
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
  const activeContainer = document.querySelector(".alert-container");
  activeContainer.innerHTML = "";

  if (alerts.length > 0) {
    const uniqueAlerts = filterUniqueAlerts(alerts);
    const firstAlert = uniqueAlerts[1]; // if there are multiple alerts take one weeyi 
    const alertElement = createAlertElement(firstAlert);
    if (alertElement) {
      activeContainer.appendChild(alertElement);
    }
  } else {
    //  activeContainer.innerHTML = "";

    const noAlertMessage = document.createElement("p");
    noAlertMessage.textContent = "No weather alerts for your area at this time.";
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
  console.log(alert);
  const template = document.getElementById("alert-severe");
  if (!template) {
    console.error("Template element with ID 'alert-severe' not found.");
    return null;
  }

  const alertElement = template.content.cloneNode(true);

  alertElement.querySelector("h3").textContent = alert.headline || alert.event;
  alertElement.querySelector(".alert-location").textContent = `${alert.areas}`;

  const description = alert.desc    
    ? alert.desc.split("...\n")[0][1]
    : "No description available";
  alertElement.querySelector(".alert-details").textContent = description;
  const severity = alert.severity;
  alertElement.querySelector(".alert-id").textContent = severity;
  const alertIdElement = alertElement.querySelector(".alert-id");
  //adding class based on the severity of the alert 
  severity === "Severe"
    ? alertIdElement.classList.add("alert-severe")
    : alertIdElement.classList.add("alert-watch");

  alertElement.querySelector(".alert-time-remaining").textContent = new Date(
    alert.effective
  ).toLocaleTimeString();

//Display Safety tips Section 
  const safetyTemplate = document.getElementById("safety");
  const safetyTipElement = safetyTemplate.content.cloneNode(true);
  const tipsListElement = safetyTipElement.querySelector(".tips-list");
  const safetyTips = getSafetyTipsForAlert(alert);

  console.log(safetyTips);
  safetyTips.forEach((tip) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${tip}</strong>}`;
    console.log(listItem);
    tipsListElement.appendChild(listItem);
  });
  document.body.appendChild(safetyTipElement);
  return alertElement.firstElementChild;
}
//Creating safety tips function
function getSafetyTipsForAlert(alert) {
  // Check if the alert contains an instruction (e.g., safety tips)
  let safetyTips;
  if (alert) {
    safetyTips = alert.instruction
      ? alert.instruction.split("...\n")
      : safetyData[alert.event];
  } else {
    safetyTips = ["no safety data available"];
  }
  return safetyTips;
  // const instruction=alert.instruction
  // console.log(instruction)
  // if (instruction) {
  //   return [
  //     `Safety Tip: ${instruction}`
  //   ];
  // }

  // // Default safety tip if no instruction is available
  // return [
  //   "stay safe stay warm: satya aaaa"
  // ];
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

//qiimo default ah sii weather ka loogu soo bandhigayo
fetchWeatherData("Vancouver")
  .then(updateWeatherUI)
  .catch((error) => {
    console.error("Failed to fetch initial weather data:", error);
    handleApiError(error);
  });


///////////////////////////DARK MODE SECTION/////////////////////////////////////


const toggleButton = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
//add or remove dark mode icons
if (document.body.classList.contains('dark-mode')) {
    darkModeIcon.classList.remove('fa-sun');
    darkModeIcon.classList.add('fa-moon'); // Show moon icon for dark mode
} else {
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun'); // Show sun icon for light mode
}

// Toggle dark mode when the button is clicked
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); 
    if (document.body.classList.contains('dark-mode')) {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon'); 
  } else {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun'); 
  }
});



