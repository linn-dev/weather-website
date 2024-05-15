const getDaysBtn = document.querySelectorAll(".days > li");
const getWeatherDetails = document.querySelectorAll(
  ".weather-details > * > .condition"
);

const getSearchInput = document.querySelector(".search-city");
const getSearchbtn = document.querySelector(".search-btn");
const getCity = document.querySelector(".city-name");
const getWeatherIcon = document.querySelector(".weather-icon > img");
const getTemp = document.querySelector(".temp");
const getCondition = document.querySelector(".condition");
const showDate = document.querySelector(".date");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let weather = {
  getLocation: async function () {
    const geoRes = await fetch(
      "https://api.ipregistry.co/?hostname=true&key=g1nfd0pjfs6wz0ov"
    );
    const geoData = await geoRes.json();

    this.getWeather(geoData.location.city);
  },

  getWeather: async function (city) {
    const weatherRes = await fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=f1c6350d8eb5492d93f143312241002&q=" +
        city +
        "&days=5&aqi=no&alerts=no"
    );

    if(!weatherRes.ok){
      alert("Uh oh! This city name does not exist on Earth.");
    }
    const weatherData = await weatherRes.json();
    console.log(weatherData);
    this.displayWeather(weatherData);
  },

  displayWeather: function (data) {
    const indicator = document.querySelector(".indicator");
    const getDate = new Date(data.forecast.forecastday[2].date); //Weather data date
    const { name, country } = data.location;
    const {
      temp_c,
      uv,
      humidity,
      feelslike_c,
      wind_mph,
      wind_dir,
      pressure_mb,
    } = data.current;

    const {
      sunrise,
      sunset 
    } = data.forecast.forecastday[0].astro;

    getDaysBtn[2].innerHTML = getDate.getDate() + " " + months[getDate.getMonth()];

    function current () {
      getCity.innerHTML = name + " , " + country;
      getTemp.innerHTML = Math.round(temp_c) + " °C";

    //Weather Deatils
    getWeatherDetails[1].innerHTML = humidity;
    getWeatherDetails[2].innerHTML = Math.round(feelslike_c) + " °C";
    getWeatherDetails[3].innerHTML = wind_mph;
    getWeatherDetails[4].innerHTML = sunrise.replace("AM", "");
    getWeatherDetails[5].innerHTML = pressure_mb;
    
    document.querySelector(".real-feel > .title").innerHTML = "Real feel";
    document.querySelector(".wind > .title").innerHTML = "Wind";
    //Sunset
    document.querySelector(".sunset").innerHTML = sunset.replace("PM", "");
    }

    function condition(text) {
      if (text.match(/sun|clear/i)) {
        getCondition.innerHTML = "Sunny";
        getWeatherIcon.src= "./assets/weather_icons/sunny.png";
      } else if (text.match(/cloud|overcast|mist|fog/i)) {
        getCondition.innerHTML = "Cloudy";
        getWeatherIcon.src= "./assets/weather_icons/cloudy.png";
      } else if (text.match(/rain|drizzle/i)) {
        getCondition.innerHTML = "Rainy";
        getWeatherIcon.src= "./assets/weather_icons/rainy.png";
      } else if (text.match(/snow|sleet|freez|blizzardi|ice/i)) {
        getCondition.innerHTML = "Snow";
        getWeatherIcon.src= "./assets/weather_icons/snow.png";
      } else {
        getCondition.innerHTML = "Thunder";
        getWeatherIcon.src= "./assets/weather_icons/thunder.png";
      }
    };

    function uvIndex(uv) {
      document.querySelector(".uv .condition-text").innerHTML = uv;

      if (uv <= 2) {
        getWeatherDetails[0].innerHTML = "Low";
        indicator.style.transform = "translateX(-50%) rotate(-70deg)";
      } else if (uv <= 5) {
        getWeatherDetails[0].innerHTML = "Moderate";
        indicator.style.transform = "translateX(-50%) rotate(-20deg)";
      } else if (uv <= 7) {
        getWeatherDetails[0].innerHTML = "High";
        indicator.style.transform = "translateX(-50%) rotate(10deg)";
      } else if (uv <= 10) {
        getWeatherDetails[0].innerHTML = "Very High";
        indicator.style.transform = "translateX(-50%) rotate(65deg)";
      } else {
        getWeatherDetails[0].innerHTML = "Extreme";
        indicator.style.transform = "translateX(-50%) rotate(90deg)";
      }
    };

    current();
    uvIndex(uv);
    condition(data.current.condition.text);

    getDaysBtn.forEach((getDay, idx) => {
      // Toggle active in getDays Button
      getDay.addEventListener("click", function () {
        getDaysBtn.forEach((day) => day.classList.remove("active"));
        this.classList.add("active");
      });

      // Display Weather Data by user's click
      getDaysBtn[idx].addEventListener("click", function () {
        if (idx == 0) {
          showDate.innerHTML = "Now";
          current();
          uvIndex(uv);
          condition(data.current.condition.text);
        } else {
          const text = data.forecast.forecastday[idx].day.condition.text;
          const { avgtemp_c, avghumidity, uv, maxwind_mph, maxtemp_c } = data.forecast.forecastday[idx].day;
          const { sunrise, sunset} = data.forecast.forecastday[idx].astro;
          const getDate = new Date(data.forecast.forecastday[idx].date);

          document.querySelector(".real-feel > .title").innerHTML = "Max temp";
          document.querySelector(".wind > .title").innerHTML = "Max wind";

          getTemp.innerHTML = Math.round(avgtemp_c) + " °C";
          getWeatherDetails[1].innerHTML = avghumidity;
          getWeatherDetails[2].innerHTML = Math.round(maxtemp_c) + " °C";
          getWeatherDetails[3].innerHTML = maxwind_mph;
          getWeatherDetails[4].innerHTML = sunrise.replace("AM", "");

          showDate.innerHTML = getDate.getDate() + " " + months[getDate.getMonth()] + " " + getDate.getFullYear();

          uvIndex(uv);
          condition(text);
        }
      });
    });
  },

  search: function () {
    this.getWeather(getSearchInput.value);
  }
};

getSearchInput.addEventListener("mousedown", function () {
  getSearchbtn.children[0].classList.add("fa-fade");
})

getSearchbtn.addEventListener("click", function (e) {
  e.preventDefault();
  weather.search();

  getSearchInput.value = ""; // Remove text after search
  getSearchInput.blur(); //Remove focus after search
  getSearchbtn.children[0].classList.remove("fa-fade");
});

weather.getLocation();