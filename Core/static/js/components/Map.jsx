import React, {Component, Fragment} from "react";
import * as L from "leaflet";
import {Message} from "semantic-ui-react";
import {Circle, Marker, TileLayer, Map as LeafletMap} from "react-leaflet";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: props.location.state.properties,
            map: null,

            mapCenterPosition: [51.49, -0.14],
            mapZoom: 10,
        };
    }

    mapRef = React.createRef();

    componentDidMount() {
        // this.init()
    }

    async init() {
        let map = L.map(this.mapRef.current).setView([51.505, -0.09], 10);

        L.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png').addTo(map);

        // L.marker([51.5, -0.09]).addTo(map)
        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //     .openPopup();

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

        const {mapCenterPosition} = this.state;
        return (
            <Fragment>
                <LeafletMap
                    // maxBounds={null}
                     center={mapCenterPosition}
                     zoom={10}
                     // minZoom={10}
                     // zoom={mapZoom}
                     // onClick={this.mapOnClick}
                     // dragging={true}
                     // onDrag={this.mapOnDrag}
                     style={{minHeight: 768, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                    <TileLayer
                        url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    />
                    {/*{(markerShow && markerPosition) && [<Marker position={markerPosition} draggable={true}/>,*/}
                        {/*<Circle center={markerPosition} radius={markerRadius}/>]}*/}
                </LeafletMap>
            </Fragment>
        )
    }
}