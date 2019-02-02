import React, {Component, Fragment} from "react";
import * as L from "leaflet";
import {Button, Image, Message, Segment} from "semantic-ui-react";
import {Circle, Marker, TileLayer, Map as LeafletMap} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';

export default class Property extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
        const {property} = this.props;
        if (property) {
            return (
                <Fragment>
                    <h5> {property.street_name}, {property.outcode}</h5>
                    <Button onClick={() => window.open(property.details_url)}>Zoopla</Button>
                    {property.propertyimage_set.map(x => <Image src={x.url}/>)}
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    Click on a property to see more information about it here.
                </Fragment>)
        }
    }
}