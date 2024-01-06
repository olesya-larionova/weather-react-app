import React from "react";

class Form extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.gettingWeather}>
                <input type="text" name="city" placeholder="Населенный пункт" className="city"/>
                <button className="button">Получить прогноз</button>
                <p className="city-font">{this.props.city} {this.props.country}</p>
                <p className="error">{this.props.error}</p>
            </form>
        );
    }
}

export default Form;