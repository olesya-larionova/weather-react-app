import React from "react";

class FormGeo extends React.Component {
    render() {
        return (
            <form onChange={this.props.gettingWeather}>
                <input type="checkbox" name="geo" /> <b>Показать прогноз по геолокации</b>
            </form>
        );
    }
}

export default FormGeo;