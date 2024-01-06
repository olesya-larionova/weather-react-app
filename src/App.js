import React from "react";
import './styles/App.css'
import Info from "./components/info";
import Form from "./components/form";
import Weather from "./components/weather";
import FormPeriod from "./components/form_period";
import FormGeo from "./components/form_geo";

const API_KEY = "bdd690940d5443123a47b25e7133893d";

class App extends React.Component {

  state = {
    temp: undefined,
    city: undefined,
    country: undefined,
    sky_state: undefined,
    sky_state_icon: undefined,
    wind: undefined,
    error: undefined,
    type: undefined,
    period: 1,
    forecast5: []
  }

  setType = (e) => {
    this.setState({
      type: e.target.checked
    });
  }

  setPeriod = (e) => {
    this.setState({
      period: e.target.checked ? 5 : 1
    });
    if (this.state.period == 1) {
      this.setState({forecast5: []})
    }
  }

  async getGeoUrl(e) {
 
    if ("geolocation" in navigator) {
      
      const getCoords = async () => {
        return new Promise(function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err)
          );
        });
      }  

      return await getCoords()
        .then((pos) => {
          const action = this.state.period == 1 ? "weather" : "forecast";
          e.target.elements.city.value = "";
          return `https://api.openweathermap.org/data/2.5/${action}?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&lang=ru&appid=${API_KEY}&units=metric`;
        })
        .catch((err) => {
          this.setError("Похоже, что в браузере отключена геолокация, может быть включите ее?");
          return undefined;
        });

    } else {

      this.setError("Браузер не поддерживает геолокацию. Введите название города");
      this.setState ({
        type: false
      });
      return undefined;

    }
  }

  getCityUrl(e) {
    let city = e.target.elements.city.value;
    if(city){
      const action = this.state.period == 1 ? "weather" : "forecast";
      return `https://api.openweathermap.org/data/2.5/${action}?q=${city}&lang=ru&appid=${API_KEY}&units=metric`;  
    } else {
      this.setError("Введите название города");
      return undefined;
    }
  }

  getWeather = async (e) => {
    e.preventDefault();

    const url = this.state.type ? await this.getGeoUrl(e) : this.getCityUrl(e);
  
    if (url) { 
      const server_data = await fetch(url);
      const data = await server_data.json();
//      console.log(data);
      if (data.cod == '200') {
        if (this.state.period == 1) {
          this.setState({
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            sky_state: data.weather[0].description,
            sky_state_icon: this.getIcon(data.weather[0].main),
            wind: data.wind.speed,
            error: undefined
          });
        } else {
          const timeFilter = (12 - data.city.timezone / 3600) + ":00:00";
          const forecast_data = data.list.filter(reading => reading.dt_txt.includes(timeFilter));
          this.setState({
            city: data.city.name,
            country: data.city.country,
            forecast5: forecast_data,
            error: undefined
          });
        }
      } else if (data.cod =='404') {
          this.setError("Город не найден, проверьте его название");
      } else {
          this.setError("Непонятная ошибка");
      }
    }
  }

  setError(text) {
    this.setState ({
      temp: undefined,
      city: undefined,
      country: undefined,
      sky_state: undefined,
      sky_state_icon: undefined,
      wind: undefined,
      error: text
    })
  }

  getIcon(type) {
    let icon;
    switch (type) {
      case "Mist":
      case "Smoke":
      case "Haze": 
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
        icon = "./img/mist.png";
        break;
      case "Thunderstorm":
        icon = "./img/thunderstorm.svg";
        break;
      case "Clouds":
        icon = "./img/clouds.svg";
        break;
      case "Rain":
      case "Drizzle":
        icon = "./img/rain.svg";
        break;
      case "Snow":
        icon = "./img/snow.svg";
        break;
      case "Clear":
        icon = "./img/sun.svg";
        break;
      default:
        icon = "";
        break;
    }
    return icon;
  }

  renderOneDay = () => {
    return this.state.forecast5.map((data, index) =>

     <Weather
      day = {this.formatDate(data.dt)}
      city = {this.state.city}
      temp = {Math.round(data.main.temp)}
      sky_state = {data.weather[0].description}
      sky_state_icon = {this.getIcon(data.weather[0].main)}
      wind = {data.wind.speed}
      small = {true}
      key={index}/>
    )
  }

formatDate(udate) {
  const dt = new Date(udate * 1000);
  return dt.toLocaleString(undefined, {weekday: "long", month: "long", day: "numeric",
  });
}

  render() {
    if (this.state.period == 1) {
      return (
        <div>
          <Info />
          <Form gettingWeather={this.getWeather}
            city={this.state.city}
            country={this.state.country}
            error={this.state.error}
          />
          <Weather
            city={this.state.city}
            temp={this.state.temp}
            sky_state={this.state.sky_state}
            sky_state_icon={this.state.sky_state_icon}
            wind={this.state.wind}
            small={false}
          />
          <FormPeriod gettingWeather={this.setPeriod}/>
          <FormGeo gettingWeather={this.setType}/>
        </div>
      )
    } else {
      return (
        <div>
        <Info />
        <Form gettingWeather={this.getWeather}
        city={this.state.city}
        country={this.state.country}
        error={this.state.error}
        />
        <div className="forecast5">
        {this.renderOneDay()}
        </div>
        <FormPeriod gettingWeather={this.setPeriod}/>
        <FormGeo gettingWeather={this.setType}/>
        </div>
      )
    }
  }
}

export default App;
