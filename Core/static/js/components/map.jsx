import React, {Component, Fragment} from "react";
import * as L from "leaflet";

export default class Map extends Component {
    constructor() {
        super();

        this.state = {};
    }

    mapRef = React.createRef();

    componentDidMount() {
        this.init()

    }
    init() {
        let map = L.map(this.mapRef.current).setView([51.505, -0.09], 13);

        L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmaporg/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
    };

    render() {
        return (
            <Fragment>
                <div ref={this.mapRef} style={{width:'100%', height: '400px'}}/>
            </Fragment>
        )
    }
}