import { Component, Fragment } from "react";
import styles from "./iphone.module.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";

import CardList from "../components/CardList";
import GoogleSearchModal from "../components/GoogleSearchModal";

export default class Iphone extends Component {
  state = { location: "Choose a location" };

  constructor(props) {
    super(props);
    var d = new Date();
    var t = d.getHours() + ":" + d.getMinutes();
    this.state = {
      time: t,
    };
  }

  componentDidMount() {
    const location = localStorage.getItem("location");
    if (location) {
      this.setState({ city: location });
    } else {
      this.setState({ city: 'London' })
    }
    // Timer for clock
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    var d = new Date();
    var t = d.getHours() + ":" + d.getMinutes();
    this.setState({
      time: t,
    });
  }



  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerChildOne}>
            <div className={styles.sbar}>
              <GoogleSearchModal />
            </div>
          </div>
          <div className={styles.headerChildTwo}>
            <div className={styles.time}>
              <p>{this.state.time}</p>
            </div>
            <div className={styles.settings}>
              <SettingsIcon />
            </div>
          </div>
        </div>
        <div className={styles.day}>
          <BrowserRouter>
            <div className="App">
              <Route
                path="/"
                render={({ location }) => (
                  <Fragment>
                    <Tabs value={location.pathname}>
                      <Tab label="Today" component={Link} to="/" />
                      <Tab
                        label="Next 5 Days"
                        component={Link}
                        to="/forecast"
                      />
                    </Tabs>
                    <Switch>
                      <Route path="/forecast" render={() => <Forecast />} />
                      <Route
                        path="/"
                        render={() => <Today state={this.state} />}
                      />
                    </Switch>
                  </Fragment>
                )}
              />
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

class Today extends Component {
  state = {
    city: "X",
    units: "",
    time: "00:00",
    weather: "X",
    temp: "",
    feelsLike: "0",
    pressure: "0",
    humidity: "0",
    minTemp: "0",
    maxTemp: "0",
    windSpeed: "0",
    seaLevel: "0",
    clouds: "",
    forecast: [
      { weather: "X", temp: 0, precip: 0 },
      { weather: "X", temp: 0, precip: 0 },
      { weather: "X", temp: 0, precip: 0 },
      { weather: "X", temp: 0, precip: 0 },
    ],
  };

  fetchCurrentWeatherData = async (place) => {
    //const url = `http://api.openweathermap.org/data/2.5/weather?q=portsmouth&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=175d6199d2d33c42ea32a6c1475c8445`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => this.updateState(data));
  };

  fetchHourlyWeatherData = async (lat, lon) => {
    //const url = `http://api.openweathermap.org/data/2.5/onecall?lat=0&lon=0&exclud=current,minutely,daily,alerts&units=metric&appid=175d6199d2d33c42ea32a6c1475c8445`
    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclud=current,minutely,daily,alerts&units=metric&appid=175d6199d2d33c42ea32a6c1475c8445`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => this.updateList(data));
  };

  updateList = (res) => {
    var list = [];
    var dataLength = 4;
    for (var i = 0; i < dataLength; i++) {
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(res.hourly[i].dt * 1000);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      const t = {
        weather: res.hourly[i].weather[0].main,
        temp: Math.ceil(res.hourly[i].temp),
        precip: Math.ceil(res.hourly[i].pop),
        time: hours + ":" + minutes,
      };
      list.push(t);
    }
    this.setState({
      forecast: list,
    });
  };

  updateState = (res) => {
    this.setState({
      city: res.name,
      weather: res.weather[0].main,
      temp: Math.ceil(res.main.temp),
      feelsLike: Math.ceil(res.main.feels_like),
      pressure: Math.ceil(res.main.pressure),
      humidity: Math.ceil(res.main.humidity),
      minTemp: Math.ceil(res.main.temp_min),
      maxTemp: Math.ceil(res.main.temp_max),
      seaLevel: Math.ceil(res.main.sea_level),
      windSpeed: Math.ceil(res.wind.speed),
      clouds: res.clouds.all,
    });
  };

  // Calls functions when the app has mounted
  componentDidMount() {
    if (localStorage.getItem('address') === null) {
      localStorage.setItem('address', 'London, UK')
      localStorage.setItem('location', 'London')
      localStorage.setItem('lat', 0)
      localStorage.setItem('lng', 0)
    } else {
      this.fetchHourlyWeatherData(localStorage.getItem('lat'), localStorage.getItem('lng'));
      this.fetchCurrentWeatherData(localStorage.getItem('address'));
    }
  }

  render() {
    return (
      <div>
        <div className={styles.main}>
          <h2>It's {this.state.weather}</h2>
          <h1>{this.state.temp}°</h1>
          <h4>Feels like {this.state.feelsLike}°</h4>
        </div>
        <div className={styles.extra}>
          <div className={styles.level}>Sea Level: {this.state.seaLevel}</div>
          <div className={styles.minT}>Min: {this.state.minTemp}°</div>
          <div className={styles.maxT}>Max: {this.state.maxTemp}°</div>
          <div className={styles.wind}>Wind: {this.state.windSpeed} m/s</div>
        </div>
        <div className={styles.boxContainer}>
          <div className={styles.box}></div>
          <CardList forecast={this.state.forecast} />
        </div>
        {/* <button onClick={() => this.fetchCurrentWeatherData()}>
          Test Current
        </button>
        <button onClick={() => this.fetchHourlyWeatherData()}>
          Test Hourly
        </button> */}
      </div>
    );
  }
}

class Forecast extends Component {
  render() {
    return (
      <div>
        <h2>Forecast</h2>
      </div>
    );
  }
}
