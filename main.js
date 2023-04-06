let userInput = document.querySelector('.input')

async function getWeather(){
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=005ed55e80af47f1bf2125433232603&q=${userInput.value}`)
    
        const data = await response.json()
        

        const weather = {
            city: data.location.name,
            country: data.location.country,
            icon: data.current.condition.icon,
            condition: data.current.condition.text,
            temp_c: Math.round(data.current.temp_c),
            temp_f: Math.round(data.current.temp_f),
            rain: data.forecast.forecastday[0].day.daily_chance_of_rain,
            precipitation: data.current.precip_mm,
            humidity:data.current.humidity,
            wind_mph: data.current.wind_mph, 
            uv: data.current.uv, 
            array: data.forecast.forecastday[0].hour,
            //local time
            localTime: function(){
                const date = new Date(data.location.localtime)
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                const dateString = date.toLocaleString('en-US', options);

                return dateString
            },
            //forecast time
            forecastTime: function(i){
                const forecastDate = new Date(data.forecast.forecastday[0].hour[i].time)
                const forecastDate_options = {hour: 'numeric', hour12: true };
                const forecastDate_dateString = forecastDate.toLocaleString('en-US', forecastDate_options);

                return forecastDate_dateString
            }
         }
         displayWeather(weather)

         //reset the user input field
         userInput.value = ''
    
        console.log(data)
        console.log(data.forecast.forecastday[0].hour[0].time)
    } 
    //catch area to capture errors
    catch (error) {
        console.log(error.message)

        if(error.message === "Cannot read properties of undefined (reading 'name')"){
            alert('Please enter a valid city or country')
        }
    }
   
}//END OF ASYNC WEATHER FUNCTION

//This button calls the async weather function
const button = document.querySelector('.button')
    button.addEventListener('click', getWeather)



//This function gets the current user location and gets the weather info
function getCurrentLocation(){
    //if the user's browser supports geolocation
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
           
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            //async function to fetch the exact location based on coords
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    const city = data.address.city; 
                    //update userinput to current city
                    userInput.value = city;
                    //get the weather based on the current city
                    getWeather()

                    alert(`You're currently in the city of ${city}`)
                })
        })
    }
    //if the users browser does not support geolocation
    else{
        alert('Your browser does not support geolocation')
    }
}//END OF GEOLOCATION FUNCTION

//This button calls the geolocation function
const locationBtn = document.querySelector('.location-btn')
    locationBtn.addEventListener('click', getCurrentLocation)



// This function displays the weather info to the homepage
function displayWeather(weather){
    //Weather informmation of the first section:details
        const details = document.querySelector('.details')
        
        details.innerHTML = `
            <h3 class="location"> ${weather.city}, ${weather.country}  </h3>
            <p class="date"> ${weather.localTime()} </p>
            
            <img src="${weather.icon}" alt="weather-condition">
            <h1 class="temperature"> ${weather.temp_c} ℃ <span class="farenheit"> ( ${weather.temp_f} ℉ ) </span> </h1>
            <p class=""> ${weather.condition} </p>
        `
        //add padding to the section
        details.style.padding = '.5em'
       

        //Weather informmation for the second section:more-details
        const moreDetails = document.querySelector('.more-details')
            
        moreDetails.innerHTML = `
            <p>Chance of rain: </p>
            <p class="rain"><b> ${weather.rain} %</b></p>

            <p>Precipitation: </p>
            <p class="rain"><b> ${weather.precipitation} mm </b></p>

            <p>Humidity: </p>
            <p class="humidity"><b>  ${weather.humidity} % </b></p>

            <p>Wind: </p>
            <p class="wind"><b> ${weather.wind_mph} mph</b></p> 
            <marquee class="uv">  </marquee>
            `
 
            //check the status of the uv rays
           const uv = moreDetails.querySelector('.uv')
            if(weather.uv > 8){
                    uv.textContent = 'UV is extreme, please avoid sunlight!'
            }
            else{
                    uv.textContent = ''
            }

            //add padding to the section
            moreDetails.style.padding = '.5em'

        
      //Weather informmation for the third section:forecast
        const forecast = document.querySelector('.forecast')
        
        //this array contains the forecast information
        const arr = weather.array
        console.log(arr)

        forecast.innerHTML = ''

            //the forecast info for each hour
            arr.forEach( (element, i) => {
                forecast.innerHTML += `
                    <div class="card">
                        <p> ${weather.forecastTime(i)} </p>
                        <img src="${arr[i].condition.icon}">
                        <p> ${Math.round(arr[i].temp_c)} ℃ </p>
                    </div>
                `
            });

             //add padding to the section
            forecast.style.padding = '.5em'

            //change the visibility of the forecst section to visible
            const forecastContainer = document.querySelector('.forecast-cont')
            forecastContainer.classList.remove('hide') 

}//END OF DISPLAY FUNCTION




