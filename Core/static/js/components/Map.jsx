import React, {Component, Fragment} from "react";
import * as L from "leaflet";
import {Message, Segment} from "semantic-ui-react";
import {Circle, Marker, TileLayer, Map as LeafletMap} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: props.location.state.properties.results,
            count: props.location.state.properties.count,
            data: props.data,

            mapCenterPosition: [51.49, -0.14],
            mapZoom: 10,

            markers: [],
        };
    }


    componentDidMount() {
        const markers = this.state.properties.map((elem) =>
            <Marker key={elem.listing_id} position={[elem.latitude, elem.longitude]} draggable={false}
                    onClick={() => this.markerOnClick(elem)}/>
        );

        this.setState({markers})
    }

    markerOnClick = (elem) => {
        console.log(elem);
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

        const {mapCenterPosition, markers, count} = this.state;
        return (
            <Fragment>
                <LeafletMap
                    // maxBounds={null}
                     center={mapCenterPosition}
                     zoom={10}
                     minZoom={10}
                     maxZoom={15}
                     // zoom={mapZoom}
                     // onClick={this.mapOnClick}
                     // dragging={true}
                     // onDrag={this.mapOnDrag}
                     style={{minHeight: 768, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                    <TileLayer
                        url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup>
                        {markers}
                    </MarkerClusterGroup>
                    {/*{(markerShow && markerPosition) && [<Marker position={markerPosition} draggable={true}/>,*/}
                        {/*<Circle center={markerPosition} radius={markerRadius}/>]}*/}
                </LeafletMap>
                <Segment>
                    Results: {count}
                </Segment>
            </Fragment>
        )
    }
}