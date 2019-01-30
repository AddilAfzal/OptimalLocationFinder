import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Button, Message
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Circle, CircleMarker, Map, Marker, Popup, TileLayer} from 'react-leaflet'


export default class AreaFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            area: "London, United Kingdom",

            mapZoom: 10,
            mapCenterPosition: [51.49, -0.14],
            mapDragging: true,

            markerShow: false,
            markerPosition: null,
            markerRadius: 200, // in KM

            markerMode: false,
        };

        setTimeout(() => this.setState({markerRadius: 1000}), 3000)
    }

    static description = "Filter the list of homes to be located within a specific area.";

    getCollapsedText = () => {
        return (
            <Fragment>
                <h3>Area</h3>
                <p><i className="fas fa-map-marker-alt"/> {this.state.area}</p>
            </Fragment>
        )
    };

    getData = () => {
        let {area, radius} = this.state;
        return {
            'area': {
                area,
                radius
            },
        };
    };

    toggleMarkerMode = () => {
        if(this.state.markerMode) {
            this.setState({
                mapDragging: true,
                markerMode: false,
            });
        } else {
            this.setState({
                mapDragging: false,
                markerMode: true,
            })
        }
    };


    mapOnClick = (e) => {
        this.setState({markerPosition: e.latlng, markerShow: true});
        console.log(this.mapRef)
        console.log(e)
    };

    mapRef = React.createRef();

    renderBody() {
        const {area, mapCenterPosition, mapZoom, mapDragging,
            markerShow, markerPosition, markerRadius, marker} = this.state;

        return (
            <Fragment>
                <h3>Area</h3>
                <Form.Group inline>
                    {/*<label>Where should the property be situated?</label>*/}
                    <Header size='small'>Where should the property be located?</Header>
                </Form.Group>
                <Message warning>
                    <Message.Header>Help</Message.Header>
                    <Message.List>
                        <Message.Item>Click and hold to drag the map.</Message.Item>
                        <Message.Item>Single click to define a center point.</Message.Item>
                    </Message.List>
                </Message>
                <Map ref={this.mapRef}
                     center={mapCenterPosition}
                     minZoom={10}
                     zoom={mapZoom}
                     onClick={this.mapOnClick}
                     dragging={true}
                     style={{height: 550, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                    <TileLayer
                        // url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
                        url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        // attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {(markerShow && markerPosition) && [<Marker position={markerPosition} draggable={true}/>,
                        <Circle center={markerPosition} radius={markerRadius}/>]}
                </Map>
                <br/>
                <Button.Group vertical labeled icon>
                    <Button icon='marker' content='Remove Marker' onClick={this.toggleMarkerMode}
                            disabled={this.state.markerMode}/>
                </Button.Group>

            </Fragment>
        )
    }
}