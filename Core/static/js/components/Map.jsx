import React, {Component, Fragment} from "react";
import {Button, Header, Message, Segment} from "semantic-ui-react";
import { Marker, TileLayer, Map as LeafletMap} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Property from "./map/Property";
import ControlInfo from "./map/ControlInfo";

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
                {/*<Popup>*/}
                    {/*{elem.propertyimage_set.map(x => <Image src={x.url}/>)}*/}
                {/*</Popup>*/}
                {/*<Tooltip style={{height: 100, width: 100}}>*/}
                {/*</Tooltip>*/}

            </Marker>
        );
        this.setState({markers}, this.setBounds);
    }

    setBounds = async () => {
        let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
        let mapMaxBounds = this.leafletMap.current.leafletElement.getBounds();
        this.setState({mapMaxBounds});
        this.leafletMap.current.leafletElement.fitBounds(markerClusterBounds)
    };

    markerOnClick = async (property) => {
        let data = await fetch('/api/properties/' + property.listing_id).then(x => x.json());
        await this.setState({property: {...property, ...data}});
    };

    handleEditFilters = () => {
        let {data} = this.state;
        this.props.history.push('/', {data});
    };

    leafletMap = React.createRef();
    markerCluster = React.createRef();

    render() {
        const {mapCenterPosition, markers, count, mapMaxBounds, property} = this.state;
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
                        <ControlInfo property={property}/>
                    </LeafletMap>
                </Segment>
                <Header as='h4' attached='top'>
                    Property
                </Header>
                <Segment attached>
                    <Property property={property}/>
                </Segment>
            </Fragment>
        )
    }
}