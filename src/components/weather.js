import React from "react";

class Weather extends React.Component {
    render() {
        return (
            <div>
                {this.props.city &&
                    <div className={this.props.small ? "small-weather-card" : "weather-card"}>
                        <h3>{this.props.day}</h3>
                        <div className="weather-card-center">
                        <img src={this.props.sky_state_icon} className="icon"></img>
                            <div className="weather-card-center-right">
                                <h2> {this.props.temp} &deg;C</h2>
                                <p className="sky-state">{this.props.sky_state}</p>
                            </div>
                        </div>
                       
                        <p>Скорость ветра {this.props.wind} м/с</p>
                    </div>
                }
            </div>
        );
    }
}

export default Weather;