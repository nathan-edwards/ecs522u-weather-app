import { Component } from 'react'
import styles from './iphone.module.css'

//import Search from '../component/SearchBar'

import { IoMdSettings } from 'react-icons/io'

export default class Iphone extends Component {

    state = {
        city: '',
        units: '',
        time: '15:00',
        main: '',
        temp: '',
        feelsLike: '',
        pressure: '',
        humidity: '',
        minTemp: '',
        maxTemp: '',
        windSpeed: '',
        seaLevel: '',
        clouds: ''
    }

    fetchCurrentWeatherData = async () => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=portsmouth,uk&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
        fetch(url)
            .then(res => res.json())
            .then(data => this.updateState(data))
    }

    fetchHourlyWeatherData = async () => {
        const url = `http://api.openweathermap.org/data/2.5/forecast/hourly?q=portsmouth,uk&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
        fetch(url)
            .then(res => res.json())
            .then(data => this.updateState(data))
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
                    
                </div>
                <button onClick={() => this.fetchCurrentWeatherData()}>Test Current</button>
                <button onClick={() => this.fetchHourlyWeatherData()}>Test Hourly</button>
            </div>
        )
    }

}
