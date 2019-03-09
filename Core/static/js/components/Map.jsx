import React, {Component, Fragment} from "react";
import {Button, Header, Menu, Message, Segment} from "semantic-ui-react";
import {Marker, TileLayer, Map as LeafletMap, Polyline} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Property from "./map/Property";
import ControlInfo from "./map/ControlInfo";
import Crime from "./information/Crime";
import HealthServices from "./information/HealthServices";
import Demographics from "./information/Demographics";
import Restaurants from "./information/Restaurants";
import Summary from "./information/Summary";
import SportsFacilities from "./information/SportsFacilities";
import Commute from "./information/Commute";

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

            polylinePositions: [],

            property: null,

            activeInfo: 'summary',

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
        let polylinePositions = [];
        if(property.route_data) {
            polylinePositions =
                property.route_data[0].response.route[0].leg[0].maneuver
                    .map(x => [x.position.latitude, x.position.longitude])
        }
        await this.setState({
            property: {...property, ...data},
            polylinePositions,
        });
    };

    handleEditFilters = () => {
        let {data} = this.state;
        this.props.history.push('/', {data});
    };

    leafletMap = React.createRef();
    markerCluster = React.createRef();

    render() {
        const {mapCenterPosition, markers, count, mapMaxBounds, property, polylinePositions, activeInfo} = this.state;
        let InfoSegment = (props) => "";

        if(property) {
            switch(activeInfo){
                case 'summary':
                    InfoSegment = Summary;
                    break;
                    // InfoSegment =  (props) => "Test";
                case 'crime':
                    InfoSegment =  Crime;
                    break;
                case 'health':
                    InfoSegment =  HealthServices;
                    break;
                case 'restaurants':
                    InfoSegment = Restaurants;
                    break;
                case 'demographics':
                    InfoSegment = Demographics;
                    break;
                case 'sports':
                    InfoSegment = SportsFacilities;
                    break;
                case 'commute':
                    InfoSegment = Commute;
                    break;
            }
        }

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
                            <Polyline positions={polylinePositions}/>
                        </MarkerClusterGroup>
                        <ControlInfo property={property}/>
                    </LeafletMap>
                </Segment>
                {property &&
                    <Menu pointing secondary>
                        <Menu.Item name='summary' active={activeInfo === 'summary'}
                                   onClick={() => this.setState({activeInfo: 'summary'})}/>
                        <Menu.Item name='Crime' active={activeInfo === 'crime'}
                                   onClick={() => this.setState({activeInfo: 'crime'})}/>
                        <Menu.Item name='Health services' active={activeInfo === 'health'}
                                   onClick={() => this.setState({activeInfo: 'health'})}/>
                        <Menu.Item name='Restaurants' active={activeInfo === 'restaurants'}
                                   onClick={() => this.setState({activeInfo: 'restaurants'})}/>
                        <Menu.Item name='Sports facilities' active={activeInfo === 'sports'}
                                   onClick={() => this.setState({activeInfo: 'sports'})}/>
                        <Menu.Item name='Demographics' active={activeInfo === 'demographics'}
                                   onClick={() => this.setState({activeInfo: 'demographics'})}/>
                        <Menu.Item name='Commute' active={activeInfo === 'commute'}
                                   onClick={() => this.setState({activeInfo: 'commute'})}/>
                    </Menu>
                }

                {/*<Property property={property}/>*/}
                <InfoSegment property={property}/>
            </Fragment>
        )
    }
}