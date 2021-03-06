import React, {Component, Fragment} from "react";
import {
    Header, Form, Label, Button, Divider, Search
} from 'semantic-ui-react'

import BaseFilter from "./BaseFilter";
import {Circle, Map as LeafletMap, Map, Marker, TileLayer} from "react-leaflet";
import * as debounce from "debounce";
import Control from 'react-leaflet-control';
import ControlSearch from "./CommuteFilter/ControlSearch";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MarkerTable from "./CommuteFilter/MarkerTable";


export default class CommuteFilter extends BaseFilter {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            mapZoom: 10,
            mapCenterPosition: [51.49, -0.14],
            mapDragging: true,
            mapMarkers: [],

            markerShow: false,
            markerPosition: null,
            markerRadius: 4000, // in M
        };
    }

    static filter_name = "Commute filter";
    static description = "Filter for homes that match your ideal commute time.";

    getData = () => {
        const formatMarkerData = (x) => {
            const {text, position, time} = x.props;
            return {
                text,
                position,
                time,
            }
        };

        let markerData = this.state.mapMarkers.map(formatMarkerData);
        return {'commute': {'commute': markerData}};
    };


    componentDidMount() {
        super.componentDidMount();
        let commute = this.props.data.commute;

        if (commute) {
            console.log(commute)
            this.state.mapMarkers = commute.commute.map(x =>
                <Marker key={Math.random()} ref={React.createRef()} draggable={false} {...x}/>);
            this.save();
        }
    }

    getCollapsedText = () => {
        return (
            <Fragment>
                <h3>Commute</h3>
                <MarkerTable markers={this.state.mapMarkers} edit={false}/>
            </Fragment>
        )
    };

    setBounds = async () => {
        let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
        this.mapRef.current.leafletElement.fitBounds(markerClusterBounds)
    };

    addMarker = (marker) => {
        const mapMarkers = [...this.state.mapMarkers, marker];
        this.setState({mapMarkers});
        // this.setBounds();
    };

    updateMarker = (key, new_props) => {
        let marker = this.state.mapMarkers.find(m => m.key === key);
        marker = React.cloneElement(marker, new_props);
        this.setState( {mapMarkers: [...this.state.mapMarkers.filter(x => x.key !== key), marker]});
    };

    removeMarker = (key) => {
        this.setState( {mapMarkers: [...this.state.mapMarkers.filter(x => x.key !== key)]});
    };

    isValid = () => {
        return this.state.mapMarkers.length > 0;
    };

    mapRef = React.createRef();
    markerCluster = React.createRef();

    renderBody() {
        const {mapCenterPosition, mapZoom, mapMarkers} = this.state;

        return (
            <Fragment>
                <h3>Commute</h3>
                <MarkerTable markers={mapMarkers} edit={true}
                             updateMarker={this.updateMarker} removeMarker={this.removeMarker}/>
                <Divider/>
                <Map ref={this.mapRef}
                     maxZoom={16}
                     center={mapCenterPosition}
                     minZoom={10}
                     zoom={mapZoom}
                     dragging={true}
                     style={{height: 550, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                    <TileLayer
                        url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    />
                    {mapMarkers}
                </Map>
                <br/>
                <ControlSearch markers={mapMarkers} addMarker={this.addMarker}/>

            </Fragment>
        )
    }
}