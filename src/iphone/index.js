import { Component } from 'react'
import styles from './iphone.module.css'

import Search from '../component/SearchBar'

import { IoMdSettings } from 'react-icons/io'

export default class Iphone extends Component {

    state = {
        city: 'London',
        units: 'metric',
        time: '15:17',
        main: '',
        temp: '',
        feelsLike: '',
        pressure: '',
        humidity: '',
        minTemp: '',
        maxTemp: '',
        windSpeed: '',
        clouds: ''
    }

    fetchWeatherData = async () => {
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=175d6199d2d33c42ea32a6c1475c8445'
        await fetch(url)
            .then(res => res.json())
            .then(res => this.updateState(res))
    }

    updateState = (res) => {
        if (res.cod)
            this.setState({
                city: res.name,
                main: res.weather.main,
                temp: res.main.temp,
                feelsLike: res.main.feels_like,
                pressure: res.main.pressure,
                humidity: res.main.humidity,
                minTemp: res.main.temp_min,
                maxTemp: res.main.temp_max,
                windSpeed: res.wind.speed,
                clouds: res.clouds.all
            })
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Search />
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
                    <h1>It's {this.state.main}</h1>
                    <h3>Temp: {this.state.temp}</h3>
                    <h4>Feels like: {this.state.feelsLike}</h4>
                </div>
                <div className={styles.extra}>
                    <div className={styles.wind}>Wind: {this.state.windSpeed}</div>
                    <div className={styles.rain}>Rain</div>
                    <div className={styles.minT}>Min: {this.state.minTemp}</div>
                    <div className={styles.maxT}>Max: {this.state.maxTemp}</div>
                </div>
                <div className={styles.boxContainer}>
                    <div className={styles.box}></div>
                    <div className={styles.box}></div>
                    <div className={styles.box}></div>
                </div>
                <button onClick={() => this.fetchWeatherData()}>Test</button>
            </div>
        )
    }

}
