import React, {Component, Fragment} from "react";
import * as L from "leaflet";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: null,
            map: null
        };
    }

    mapRef = React.createRef();

    componentDidMount() {
        this.init()
    }

    async init() {
        let map = L.map(this.mapRef.current).setView([51.505, -0.09], 10);

        L.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmaporg/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();

        let properties = await this.props.getData();
        await this.setState({properties, map})
        this.displayResults();
    };

    displayResults() {
        // console.log(this)
        this.state.properties.results.forEach((l) => {
            console.log(l)
            L.marker([l.latitude, l.longitude])
                .addTo(this.state.map)
                .bindPopup(new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(l.price));
        })
    }

    render() {
        return (
            <Fragment>
                <div ref={this.mapRef} style={{width:'100%', height: '600px'}}/>
            </Fragment>
        )
    }
}