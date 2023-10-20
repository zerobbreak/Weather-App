const searchCountry = document.getElementById("country-search");

searchCountry.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
      const location = searchCountry.value;
      if (location) {
          renderLocationData(location);
          renderForecastDays(location, 4);
          renderData(location)
      }
  }
});

async function getArea(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=API_KEY=${location}&days=1&aqi=no&alerts=no`
    );

    const areaData = await response.json();
    const country = areaData.location.country;
    const localtime = areaData.location.localtime;
    const region = areaData.location.region;

    return { country, localtime, region };
  } catch (error) {
    // Handle errors here
    console.error(error);
    return null;
  }
}

async function getWeather(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=API_KEY=${location}&days=1&aqi=no&alerts=no`
    );

    const weatherData = await response.json();
    const current = weatherData.current;
    const title = current.condition.text;
    const weatherIcon = current.condition.icon;
    const temp = current.temp_c;
    return { title, weatherIcon, temp };
  } catch (error) {
    // Handle errors here
    console.error(error);
    return null;
  }
}

async function getForecast(location, days) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=API_KEY=${location}&days=${days}&aqi=no&alerts=no`
    );

    const responseData = await response.json();

    if (responseData && responseData.forecast && responseData.forecast.forecastday) {
      const daysData = responseData.forecast.forecastday[0]; // Assuming you want data for the first day.

      if (daysData && daysData.hour) {
        const hourData = daysData.hour;

        return hourData.map((hour) => {
          const hourTitle = hour.condition.text;
          const hourIcon = hour.condition.icon;
          const hourTemp = hour.temp_c;
          const humidity = hour.humidity;

          return {
            hourTitle,
            hourIcon,
            hourTemp,
            humidity,
          };
        });
      }
    }

    return null; // Return null if the data is not in the expected structure.
  } catch (error) {
    // Handle errors here
    return null;
  }
}

async function getLocationData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=API_KEY=${location}&days=1&aqi=no&alerts=no`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const responseData = await response.json();
    const country = responseData.location.country;
    const localtime = responseData.location.localtime;
    const name = responseData.location.name;
    const region = responseData.location.region;
    const id = responseData.location.tz_id;

    return { country, localtime, name, region, id };
  } catch (error) {
    // Handle errors here
    console.error('An error occurred:', error);
    return null;
  }
}


// Call the getForecast function using `await`
async function renderData(location) {
  const areaData = await getArea(location);
  if (areaData) {
    const { country, localtime, region } = areaData;
    const location = document.getElementById("location");
    const regionText = document.getElementById("region");
    const condition = document.getElementById("condition");

    regionText.innerText = region;
    location.innerText = country;
    condition.innerText = localtime;
  } else {
    console.log("An error occurred while fetching the forecast.");
  }

  const weatherData = await getWeather(location, 4);
  if (weatherData) {
    const { title, weatherIcon, temp } = weatherData;
    const icon = document.getElementById("weather-icon");
    const weatherTitle = document.getElementById("weather-text");
    const temperature = document.getElementById("weather-temperature");

    icon.src = weatherIcon;
    weatherTitle.innerText = title;
    temperature.innerText = `${temp}°C`;
  } else {
    console.log("An error occurred while fetching the Weather.");
  }
}

// Call the async render function
renderData();


async function renderForecastDays(location, days) {
  const daysContainer = document.getElementById("daysContainer");

  try {
    const forecastData = await getForecast(location, days);
    if (forecastData) {
      // Clear existing content in the "daysContainer"
      daysContainer.innerHTML = "";

      // Limit the forecast data to the first 34 items
      const limitedForecastData = forecastData.slice(0, 3);

      // Loop through the limited forecast data
      limitedForecastData.forEach((hourData) => {
        const { hourTitle, hourIcon, hourTemp, humidity, time } = hourData;

        // Create a new day element for each hour
        renderDay(hourIcon, hourTitle, hourTemp, humidity, time);
      });
    } else {
      console.log("An error occurred while fetching the forecast data.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the renderForecastDays function
renderForecastDays("London", 4);

function renderDay(iconUrl, title, temp, humidity) {
  // Create a new day element
  const dayElement = document.createElement("div");
  dayElement.classList.add("day");

  // Create the elements for the day's content
  const imgIcon = document.createElement("div");
  imgIcon.classList.add("imgIcon");
  const img = document.createElement("img");
  img.src = iconUrl;
  img.alt = "Weather Icon";
  imgIcon.appendChild(img);

  const dayContent = document.createElement("div");
  dayContent.classList.add("day-content");

  const dayTitle = document.createElement("h3");
  dayTitle.classList.add("day-title");
  dayTitle.innerText = title;

  const dayTemperature = document.createElement("p");
  dayTemperature.classList.add("day-temperature");
  dayTemperature.innerText = `${temp}°C`;

  const dayHumidity = document.createElement("p");
  dayHumidity.classList.add("day-humidity");
  dayHumidity.innerText = `Humidity: ${humidity}%`;

  // Append the elements to the day element
  dayContent.appendChild(dayTitle);
  dayContent.appendChild(dayTemperature);
  dayContent.appendChild(dayHumidity);

  dayElement.appendChild(imgIcon);
  dayElement.appendChild(dayContent);

  // Append the day element to the "days" container
  const daysContainer = document.getElementById("daysContainer");
  daysContainer.appendChild(dayElement);
}

async function renderLocationData(location) {
  try {
    const locationData = await getLocationData(location);
    if (locationData) {
      const titleElement = document.getElementById('location-title');
      const countryElement = document.getElementById('location-country');
      const timeElement = document.getElementById('location-time');
      const idElement = document.getElementById('location-id');

      titleElement.innerText = locationData.name;
      countryElement.innerText = locationData.country;
      timeElement.innerText = locationData.localtime;
      idElement.innerText = locationData.id;
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the renderLocationData function with the desired location
renderLocationData('London'); // Replace 'London' with your desired location.
renderData("London")
