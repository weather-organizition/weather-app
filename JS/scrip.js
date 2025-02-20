function fetchAlerts(location) {
  axios
    .get(//'http://api.weatherapi.com/v1/current.json?key=b96487ed0b804c0e8ce52629251602&q=${location}')
      `http://api.weatherapi.com/v1/forecast.json?key=b96487ed0b804c0e8ce52629251602&q=${location}&alerts=yes`)

    .then((response) => {
        console.log(response)
      if (
        response.data 
        // response.data.alerts &&
        //  response.data.alerts.alert.length > 0
       ) { 
        weatherData(response.data)
        console.log(" Weather Alerts Received:", response.data.alerts.alert);
      } else {
        console.log(`No weather alerts for ${location}.`);
      }
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401) {
          console.error(
            " API Error: Invalid API Key. Check your API settings."
          );
        } else if (error.response.status === 400) {
          console.error(
            " API Error: Invalid location. Please try another city."
          );
        } else if (error.response.status === 429) {
          console.error(" API Error: Too many requests. Try again later.");
        } else {
          console.error(
            ` API Error (${error.response.status}): ${error.response.data.error.message}`
          );
        }
      } else if (error.request) {
        console.error(
          " Network Error: No response received. Please check your internet connection."
        );
      } else {
        console.error(" Unexpected Error:", error.message);
      }
    });
} 


function weatherData(data){
  const templateContainer = document.getElementById("alert-severe")
  const activeContainer = document.querySelector(".container")

  const icon = document.querySelector('[data-weather-type="icon"]')
  icon.src = `https:${data.current.condition.icon}`
  icon.alt = data.current.condition.text
  
  const description = document.querySelector('[data-weather-type="description"]')
  description.textContent = data.current.condition.text;

  const location = document.querySelectorAll("#Location")
  location.forEach((location) => {
    location.textContent = data.location.name;

  })
  

  const temp = document.querySelector('[data-weather-type="temp"]')
  temp.textContent = data.current.temp_f + "°F";

  const wind = document.querySelector('[data-weather-type="wind"]')
  wind.textContent = data.current.wind_kph + " kph";


  const humidity = document.querySelector('[data-weather-type="humidity"]')
  humidity.textContent = data.current.humidity + "%";

  
  if (data.alerts && data.alerts.alert.length > 0) {
    activeContainer.innerHTML = "";
    const alertData = data.alerts.alert; 
    alertData.forEach(item =>{

      

      const activeAlertTemplate = templateContainer.content.cloneNode(true)
      activeAlertTemplate.querySelector("h3").textContent = /*item?.event*/  item?.headline;
      activeAlertTemplate.querySelector(".alert-location").textContent = item?.areas + " , " + data?.location?.name;
      activeAlertTemplate.querySelector(".alert-details").textContent = item?.instruction || item?.desc;
      activeAlertTemplate.querySelector(".alert-id").textContent = item?.severity || item?.category || "No additional details available." ;
      activeAlertTemplate.querySelector(".alert-time-remaining").textContent = new Date(item?.effective).toLocaleTimeString();
      
      activeContainer.append(activeAlertTemplate)

                
    })
  
}else {
 
    const noAlertMessage = document.createElement("p");
    noAlertMessage.textContent = "No active weather alerts.";
    activeContainer.appendChild(noAlertMessage);
  
  }
  
  
}

document.querySelector("#btn").addEventListener("click", () => {
  const locationInput = document.querySelector("#cityInput").value;
  if (locationInput) {
    fetchAlerts(locationInput);
  } else {
    console.log("Please enter a location.");
  }
})
//fetchAlerts("london");
//fetchAlerts("New York");
//fetchAlerts("55379");
fetchAlerts("Saudi Arabia");
//fetchAlerts("Sydney");

//fetchAlerts("InvalidCity123");
