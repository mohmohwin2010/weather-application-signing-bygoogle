import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import jwtDecode from "jwt-decode";
import Search from "./component/search/search";
import Forecast from "./component/forecast/forecast";
import CurrentWeather from "./component/current-weather/current-weather";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./component/api";

function App() {
  const [user, setUser] = useState({});
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split("");
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token : " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "963425870980-u7kni0ibj4ibakcd9jnq3194302se7k9.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  //If we have no user: sign in button
  //If we have a user: show the log out button

  return (
    <div className="App">
      <div id="signInDiv"></div>
      {Object.keys(user).length != 0 && (
        <>
          <button onClick={(e) => handleSignOut(e)}>Sign Out</button>

          <div className="gcontainer">
            {/* {console.log("user within condition : ", Object.keys(user).length)} */}

            <img src={user.picture} />
            <h3>{user.name}</h3>
          </div>
          <div className="container">
            <Search onSearchChange={handleOnSearchChange} />
            {currentWeather && <CurrentWeather data={currentWeather} />}

            {forecast && <Forecast data={forecast} />}
          </div>
        </>
      )}
      {/* {console.log("user outer condition : ", Object.keys(user).length)}
      {user && (
        <>
          <div className="gcontainer">
            {console.log("user within condition : ", Object.keys(user).length)}
            <img src={user.picture} />
            <h3>{user.name}</h3>
          </div>
        </>
      )} */}
    </div>
  );
}

export default App;
