
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
  
  // fetch weather data from WeatherAPI
  
  async function fetchWeatherData(location) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&alerts=yes`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    }
    catch (error) {
      handleApiError(error);
    }
  }
  
  
  function handleApiError(error) {
    console.error("Error fetching weather data:", error);
    // soo bandhigista error ka message ee user
    let errorMessage = "An unexpected error occurred. Please try again.";
  
    if (error.message.includes("Network response was not ok")) {
      errorMessage = "Weather service is unavailable. Please try later.";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage = "Network error! Please check your internet connection.";
    } else if (error.message.includes("No data received from the API")) {
      errorMessage = "Location not found. Please enter a valid city.";
    }
  
  
    document.querySelector(
      "#current-conditions"
    ).innerHTML = `<p class="error">Error: ${errorMessage}</p>`;
    document.querySelector(
      ".container"
    ).innerHTML = `<p class="error">Error: ${errorMessage}</p>`;
  }
   // update weather data on the UI
  
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
  
  
    //feels like data and toggle between fahrenheit and celsius
    const feelsLikeElement = document.querySelector(
      '[data-weather-type="feelsLike"]'
    );
    const feelsLikeF = data.current.feelslike_f;
    const feelsLikeC = data.current.feelslike_c;
    feelsLikeElement.textContent = `${feelsLikeF}°F`;
    feelsLikeElement.setAttribute("data-unit", "fahrenheit"); 
    if (feelsLikeElement) {
      const newFeelsLikeElement = feelsLikeElement.cloneNode(true);
      feelsLikeElement.parentNode.replaceChild(newFeelsLikeElement, feelsLikeElement);
  
      newFeelsLikeElement.addEventListener("click", () => {
        const currentUnit = newFeelsLikeElement.getAttribute("data-unit");
        if (currentUnit === "fahrenheit") {
          newFeelsLikeElement.textContent = `${feelsLikeC.toFixed(1)}°C`;
          newFeelsLikeElement.setAttribute("data-unit", "celsius");
        } else {
          newFeelsLikeElement.textContent = `${feelsLikeF}°F`;
          newFeelsLikeElement.setAttribute("data-unit", "fahrenheit");
        }
      });
    }
    
  
    //get temp data and toggle between fahrenheit and celsius
  
    const tempElement = document.querySelector('[data-weather-type="temp"]');
    const tempF = data.current.temp_f;
    const tempC = data.current.temp_c;
  
    let currentUnit = tempElement.getAttribute("data-unit") || "fahrenheit";
    tempElement.textContent =
      currentUnit === "fahrenheit" ? `${tempF}°F` : `${tempC.toFixed(1)}°C`;
    tempElement.setAttribute("data-unit", currentUnit);
  
    const newTempElement = tempElement.cloneNode(true);
    tempElement.parentNode.replaceChild(newTempElement, tempElement);
  
    newTempElement.addEventListener("click", () => {
      currentUnit = newTempElement.getAttribute("data-unit");
  
      if (currentUnit === "fahrenheit") {
        newTempElement.textContent = `${tempC.toFixed(1)}°C`;
        newTempElement.setAttribute("data-unit", "celsius");
      } else {
        newTempElement.textContent = `${tempF}°F`;
        newTempElement.setAttribute("data-unit", "fahrenheit");
      }
    });
  
    //get data and toggle between wind speed kph and mph
  
    const windElement = document.querySelector('[data-weather-type="wind"]');
    const windKph = data.current.wind_kph;
    const windMph = data.current.wind_mph;
    let currentWindUnit = windElement.getAttribute("data-unit") || "kph";
    windElement.textContent =
      currentWindUnit === "kph" ? `${windKph} kph` : `${windMph} mph`;
    windElement.setAttribute("data-unit", currentWindUnit);
  
    const newWindElement = windElement.cloneNode(true);
    windElement.parentNode.replaceChild(newWindElement, windElement);
  
    newWindElement.addEventListener("click", () => {
      currentWindUnit = newWindElement.getAttribute("data-unit");
  
      if (currentWindUnit === "kph") {
        newWindElement.textContent = `${windMph} mph`;
        newWindElement.setAttribute("data-unit", "mph");
      } else {
        newWindElement.textContent = `${windKph} kph`;
        newWindElement.setAttribute("data-unit", "kph");
      }
    });
  
    document.querySelector(
      '[data-weather-type="humidity"]'
    ).textContent = `${data.current.humidity}%`;
  
    // isbadalayaan alerts ka
    updateAlerts(data.alerts ? data.alerts.alert : []);
  
    // isbadalayaan background ka
    updateBackground(data.current.condition.text);
  }
   // update alerts on the UI
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
      noAlertMessage.classList.add("no-alerts");
      noAlertMessage.textContent = "No active weather alerts.";
      activeContainer.appendChild(noAlertMessage);
  
    }
  }
  // get unique alerts based on event and areas
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
  // create alert element based on the alert data
  // Store added safety alerts to prevent duplicates
  const addedSafetyAlerts = new Set();
  
  function createAlertElement(alert) {
    const template = document.getElementById("alert-severe");
    if (!template) {
      console.error("Template element with ID 'alert-severe' not found.");
      return null;
    }
  
    const alertElement = template.content.cloneNode(true);
    alertElement.querySelector("h3").textContent = alert.headline || alert.event;
    alertElement.querySelector(".alert-location").textContent = `${alert.areas}`;
    const description = alert.desc ? alert.desc.split("...\n") : "No description available";
    alertElement.querySelector(".alert-details").textContent = description;
  
    // Time remaining
    const alertEffectiveTime = new Date(alert.effective);
    const currentTime = new Date();
    const timeRemaining = currentTime - alertEffectiveTime;
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
    const timeRemainingText = hoursRemaining > 0 
      ? `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} remaining` 
      : `${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''} remaining`;
  
    alertElement.querySelector(".alert-time-remaining").textContent = timeRemainingText;
  
    // Add severity class
    const severity = alert.severity;
    alertElement.querySelector(".alert-id").textContent = severity;
    const alertIdElement = alertElement.querySelector(".alert-id");
    severity === "Severe" ? alertIdElement.classList.add("alert-severe") : alertIdElement.classList.add("alert-watch");
  
    // Prevent duplicate safety tips
    if (!addedSafetyAlerts.has(alert.event)) {
      const safetyTemplate = document.getElementById("safety");
      if (safetyTemplate) {
        const safetyTipElement = safetyTemplate.content.cloneNode(true);
        const tipsListElement = safetyTipElement.querySelector(".tips-list");
        const safetyTips = getSafetyTipsForAlert(alert);
  
        safetyTips.forEach((tip) => {
          const listItem = document.createElement("li");
          listItem.classList.add('safety-tips-list')
          listItem.innerHTML = `<strong>${tip}</strong>`;
          tipsListElement.appendChild(listItem);
        });
  
        document.body.appendChild(safetyTipElement);
        addedSafetyAlerts.add(alert.event); // Mark this alert type as added
      }
    }
  
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
  // get background image based on weather description
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
  // fetch background image from Pexels API
  
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
          document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url('${imageUrl}')`;
          
        } else {
          console.warn("No images found for:", searchTerm);
        }
      })
      .catch((error) => {
        console.error("Error fetching image from Pexels:", error);
      });
  }
  // update weather data when search button is clicked
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
      return;
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
  fetchWeatherData("Mogadishu")
    .then(updateWeatherUI)
    .catch((error) => {
      console.error("Failed to fetch initial weather data:", error);
      handleApiError(error);
    });
  
  //Dark mode functionality section
  document.addEventListener("DOMContentLoaded", () => {
  
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeIcon.classList.remove("fa-sun");
    darkModeIcon.classList.add("fa-moon");
  } else {
    document.body.classList.remove("dark-mode");
    darkModeIcon.classList.remove("fa-moon");
    darkModeIcon.classList.add("fa-sun");
  }
  
  // hubi in ay active thy
  
  
  // Toggle dark mode marka button la taabto
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  
    // Updating the icon iyado lo egayo current state
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      darkModeIcon.classList.remove("fa-sun");
      darkModeIcon.classList.add("fa-moon");
    } else {
      localStorage.setItem("darkMode", "disabled");
      darkModeIcon.classList.remove("fa-moon");
      darkModeIcon.classList.add("fa-sun");
    }
  });
  });
git   