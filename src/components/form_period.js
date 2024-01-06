import React from "react";

class FormPeriod extends React.Component {
    render() {
        return (
            <form onChange={this.props.gettingWeather}>
                <input type="checkbox" name="period"/> <b>Показать прогноз на 5 дней</b>
            </form>
        );
    }
}

export default FormPeriod;