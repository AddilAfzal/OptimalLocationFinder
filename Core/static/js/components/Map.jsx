import React, {Component, Fragment} from "react";
import * as L from "leaflet";
import {Button, Header, Image, Message, Segment} from "semantic-ui-react";
import {Circle, Marker, TileLayer, Map as LeafletMap, Popup} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Property from "./Property";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: props.location.state.properties.results,
            count: props.location.state.properties.count,
            data: props.location.state.data,

            mapCenterPosition: [51.49, -0.14],
            mapZoom: 10,
            mapBounds: null,
            mapMaxBounds: null,

            markers: [],
            markerClusterBounds: null,

            property: null,
        };
    }

    componentDidMount() {
        const markers = this.state.properties.map((elem) =>
            <Marker key={elem.listing_id} position={[elem.latitude, elem.longitude]} draggable={false}
                    onClick={() => this.markerOnClick(elem)}>
                <Popup>
                    {elem.propertyimage_set.map(x => <Image src={x.url}/>)}
                </Popup>
            </Marker>
        );
        this.setState({markers}, this.setBounds);
    }

    setBounds = async () => {
        let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
        let mapMaxBounds = this.leafletMap.current.leafletElement.getBounds();
        this.setState({markerClusterBounds, mapMaxBounds});
        this.leafletMap.current.leafletElement.fitBounds(markerClusterBounds)
    };

    markerOnClick = (property) => {
        console.log(property)
        this.setState({property});
    };

    handleEditFilters = () => {
        let {data} = this.state;
        this.props.history.push('/', {data});
    };

    leafletMap = React.createRef();
    markerCluster = React.createRef();

    render() {
        const {mapCenterPosition, markers, count, mapMaxBounds} = this.state;
        return (
            <Fragment>
                <Button onClick={this.handleEditFilters}>Edit filters</Button>
                <Message
                    attached
                    icon='point'
                    header={`${count.toLocaleString()} results found`}
                    content='Click on a cluster to zoom in.'
                    success
                />
                <Segment attached>
                    <LeafletMap
                        ref={this.leafletMap}
                        center={mapCenterPosition}
                        zoom={8}
                        minZoom={10}
                        maxZoom={16}
                        maxBounds={mapMaxBounds}
                        style={{minHeight: 768, border: "1px solid #ddd", padding: 26, marginTop: 16}}>
                        <TileLayer
                            url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        />
                        <MarkerClusterGroup ref={this.markerCluster}>
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