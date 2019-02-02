import React, {Component, Fragment} from "react";
import * as L from "leaflet";
import {Header, Message, Segment} from "semantic-ui-react";
import {Circle, Marker, TileLayer, Map as LeafletMap} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Property from "./Property";

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

            property: null,
        };
    }


    componentDidMount() {
        const markers = this.state.properties.map((elem) =>
            <Marker key={elem.listing_id} position={[elem.latitude, elem.longitude]} draggable={false}
                    onClick={() => this.markerOnClick(elem)}/>
        );

        this.setState({markers})
    }

    markerOnClick = (property) => {
        this.setState({property});
    };

    render() {
        const {mapCenterPosition, markers, count} = this.state;
        return (
            <Fragment>
                <Message
                    attached
                    icon='point'
                    header={`${count.toLocaleString()} results found`}
                    content='Click on a cluster to zoom in.'
                />
                <Segment attached>
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
                    </LeafletMap>
                </Segment>
                <Header as='h4' attached='top'>
                    Property
                </Header>
                <Segment attached>
                    <Property property={this.state.property}/>
                </Segment>
            </Fragment>
        )
    }
}