function fetchAlerts(location) {
  axios
    .get("http://api.weatherapi.com/v1")
    .then((response) => {
      if (
        response.data &&
        response.data.alerts &&
        response.data.alerts.length > 0
      ) { 
        console.log(" Weather Alerts Received:", response.data.alerts);
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

fetchAlerts("Seattle");
fetchAlerts("InvalidCity123");
