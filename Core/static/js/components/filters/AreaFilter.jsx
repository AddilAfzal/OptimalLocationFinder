import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Button, Message
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Circle, CircleMarker, Map, Marker, Popup, TileLayer} from 'react-leaflet'
import Slider from 'rc-slider';

export default class AreaFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            area: "London, United Kingdom",
            londonBoundary: null,

            mapZoom: 10,
            mapCenterPosition: [51.49, -0.14],
            mapDragging: true,

            markerShow: false,
            markerPosition: null,
            markerRadius: 4000, // in M
        };

    }

    // componentWillMount() {
    //     fetch("/static/json/greaterlondon.json")
    //         .then(response => response.json())
    //         .then(response => this.setState({londonBoundary: response.features}));
    //
    // }

    static description = "Filter the list of homes to be located within a specific area.";

    getCollapsedText = () => {
        const {markerPosition, markerRadius} = this.state;
        return (
            <Fragment>
                <h3>Area</h3>
                <p><i className="fas fa-map-marker-alt"/> Within a {markerRadius / 1000} KM radius from coordinates
                    ({markerPosition.lat} {markerPosition.lng})</p>
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

    mapOnClick = (e) => {
        this.setState({markerPosition: e.latlng, markerShow: true});
        console.log(this.mapRef)
        console.log(e)
    };

    mapOnDrag = (e) => {
        console.log(e)
    };

    mapRef = React.createRef();

    renderBody() {
        const {area, mapCenterPosition, mapZoom,
            markerShow, markerPosition, markerRadius} = this.state;

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
                     // maxBounds={null}
                     center={mapCenterPosition}
                     minZoom={10}
                     zoom={mapZoom}
                     onClick={this.mapOnClick}
                     dragging={true}
                     onDrag={this.mapOnDrag}
                     style={{height: 550, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                    <TileLayer
                        url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    />
                    {(markerShow && markerPosition) && [<Marker position={markerPosition} draggable={true}/>,
                        <Circle center={markerPosition} radius={markerRadius}/>]}
                </Map>
                <br/>
                <p>Radius: {this.state.markerRadius/1000} KM</p>
                <Slider
                    min={1}
                    max={8000}
                    defaultValue={markerRadius}
                    marks={{ 0:"0 KM", 2000:"2 KM", 4000:"4 KM", 6000:"6 KM", 8000:"8 KM" }}
                    onChange={(e) => this.setState({markerRadius: e })}/>
                <br/>
                <br/>
                <Button.Group vertical labeled icon>
                    {markerPosition &&
                    <Button icon='marker' content='Remove Marker'
                            onClick={() => this.setState({markerPosition: null})}
                            disabled={!this.state.markerPosition}/>}
                </Button.Group>

            </Fragment>
        )
    }

    isValid = () => {
        return this.state.markerPosition && this.state.markerRadius;
    };
}