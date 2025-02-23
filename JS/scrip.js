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

const pexelsAPIKey = "Qym5GvbpnwpZ17rsVnIinRACfjJo6t0x8S5v1ktVWQCH4yVkcRl9ZchH"
function backgroundChange(discription) {
  const htmlbody = document.body;

  let DiscriptionSearch = "weather";
  if(discription.textContent.includes("rain") || 
  discription.textContent.includes("shower") ||
  discription.textContent.includes("dirrizzle")){

    DiscriptionSearch = "rainy";

  } else if(discription.textContent.includes("cloud") ||
  discription.textContent.includes("overcast") ||
  discription.textContent.includes("partly cloudy")){
    DiscriptionSearch = "cloudy sky";
  }
  else if(discription.textContent.includes("sunny") ||
  discription.textContent.includes("clear")){
    DiscriptionSearch = "blue sky";
  }
  else if(discription.textContent.includes("snow") ||
  discription.textContent.includes("blizzard")){
    DiscriptionSearch = "snowy sky";
  }
  else if(discription.textContent.includes("fog") ||
  discription.textContent.includes("mist")){
    DiscriptionSearch = "foggy sky";
  }
  else if(discription.textContent.includes("wind") ||
  discription.textContent.includes("breeze")){
    DiscriptionSearch = "windy sky";
  }
  else if(discription.textContent.includes("storm") ||
  discription.textContent.includes("thunderstorm")) {
    DiscriptionSearch = "stormy sky";
  }
  
  fetch(`https://api.pexels.com/v1/search?query=${DiscriptionSearch}&per_page=1`, {
   headers: {
    Authorization: pexelsAPIKey
  }
})
      .then(response => response.json())
      .then(data => {
        if (data.photos.length > 0) {
          const imageUrl = data.photos[0].src.landscape;
          htmlbody.style.background = `url('${imageUrl}') no-repeat center center/cover`;
        } else {
          console.warn("No images found for:", searchTerm);
        }
      })
      .catch(error => {
        console.error("Error fetching image from Pexels:", error);
      });
    }
    

function weatherData(data){
  const templateContainer = document.getElementById("alert-severe")
  const activeContainer = document.querySelector(".container")

  const icon = document.querySelector('[data-weather-type="icon"]')
  icon.src = `https:${data.current.condition.icon}`
  icon.alt = data.current.condition.text

const discription = document.querySelector('[data-weather-type="description"]')
discription.textContent = data.current.condition.text.toLowerCase();

backgroundChange(discription);



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
    const alertData = data.alerts.alert; 
    activeContainer.innerHTML = "";

    const newAlerts = new Set();
    const updatedAlerts = [];

    alertData.forEach((item) =>{
      const alertKey = `${item.event}-${item.areas}`
      
      if(!newAlerts.has(alertKey)){
        newAlerts.add(alertKey);
        updatedAlerts.push(item)
      }

    })

    
    updatedAlerts.forEach((item) =>{

      

      const activeAlertTemplate = templateContainer.content.cloneNode(true)
      activeAlertTemplate.querySelector("h3").textContent = /*item?.event*/  item?.headline;
      activeAlertTemplate.querySelector(".alert-location").textContent = item?.areas + " , " + data?.location?.name;
      activeAlertTemplate.querySelector(".alert-details").textContent = item?.instruction || item?.desc;
      activeAlertTemplate.querySelector(".alert-id").textContent = item?.severity || item?.category || item?.msgtype || item?.event;
      activeAlertTemplate.querySelector(".alert-time-remaining").textContent = new Date(item?.effective).toLocaleTimeString();
      
      activeContainer.append(activeAlertTemplate)

                
    })
  
}else {
 
    const noAlertMessage = document.createElement("p");
    noAlertMessage.textContent = "No active weather alerts.";
    activeContainer.appendChild(noAlertMessage);
  
  }
}
  

document.querySelector("#btn").addEventListener("click",  (e) => {
  const locationInput = document.querySelector("#cityInput").value;
  if (locationInput) {
    fetchAlerts(locationInput);
  } else {
    console.log("Please enter a location.");
  }
})
document.querySelector("#cityInput").addEventListener("keypress",  (e) => { 
  if (e.key === "Enter") {
    e.preventDefault();
    const locationInput = document.querySelector("#cityInput").value;
    if (locationInput) {
      fetchAlerts(locationInput);
    } else {
      console.log("Please enter a location.");
    }
  }
})
//fetchAlerts("london");
//fetchAlerts("New York");
//fetchAlerts("55379");
//fetchAlerts("san francisco");
 fetchAlerts("sydney");

//fetchAlerts("InvalidCity123");
