import { Component } from 'react'
import styles from './iphone.module.css'

//import Search from '../component/SearchBar'
import CardList from '../components/CardList'

import { IoMdSettings } from 'react-icons/io'

export default class Iphone extends Component {

    state = {
        city: 'X',
        units: '',
        time: '00:00',
        weather: 'X',
        temp: '',
        feelsLike: '0',
        pressure: '0',
        humidity: '0',
        minTemp: '0',
        maxTemp: '0',
        windSpeed: '0',
        seaLevel: '0',
        clouds: '',
        forecast: [
            { weather: "X", temp: 0, precip: 0 },
            { weather: "X", temp: 0, precip: 0 },
            { weather: "X", temp: 0, precip: 0 },
            { weather: "X", temp: 0, precip: 0 },       
          ]
    }

    fetchCurrentWeatherData = async () => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=portsmouth&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
        await fetch(url)
            .then(res => res.json())
            .then(data => this.updateState(data))
    }

    fetchHourlyWeatherData = async () => {
        const url = `http://api.openweathermap.org/data/2.5/onecall?lat=50.81957441096404&lon=-1.0890056435577038&exclud=current,minutely,daily,alerts&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
        await fetch(url)
            .then(res => res.json())
            .then(data => this.updateList(data))
    }

    updateList = (res) => {
        var list = []
        var dataLength = 4
        for (var i = 0; i < dataLength; i++) {
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(res.hourly[i].dt * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            const t = {weather: res.hourly[i].weather[0].main, temp: Math.ceil(res.hourly[i].temp), precip: Math.ceil(res.hourly[i].pop), time: (hours + ":" + minutes)};
            list.push(t)
        }
        this.setState({
            forecast: list
        })
    }

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
            clouds: res.clouds.all
        })
    }

    // Calls functions when the app has mounted
    componentDidMount() {
        this.fetchHourlyWeatherData();
        this.fetchCurrentWeatherData();
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <p>{this.state.city}</p>
                    </div>
                    <div className={styles.time}>{this.state.time}</div>
                    <div className={styles.settings}><IoMdSettings /></div>
                </div>
                <div className={styles.day}>
                    <h2>Today</h2>
                    <h2>Next 5 days</h2>
                </div>
                <div className={styles.main}>
                    <h1>It's {this.state.weather}</h1>
                    <h3>Temp: {this.state.temp}°</h3>
                    <h4>Feels like: {this.state.feelsLike}°</h4>
                </div>
                <div className={styles.extra}>
                    <div className={styles.wind}>Wind: {this.state.windSpeed} m/s</div>
                    <div className={styles.level}>Sea Level: {this.state.seaLevel}</div>
                    <div className={styles.minT}>Min: {this.state.minTemp}°</div>
                    <div className={styles.maxT}>Max: {this.state.maxTemp}°</div>
                </div>
                <div className={styles.boxContainer}>
                    <div className={styles.box}></div>
                    <CardList forecast={this.state.forecast}/>
                </div>
                <button onClick={() => this.fetchCurrentWeatherData()}>Test Current</button>
                <button onClick={() => this.fetchHourlyWeatherData()}>Test Hourly</button>
            </div>
        )
    }

}
