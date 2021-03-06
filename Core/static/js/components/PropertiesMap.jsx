import React, {Component, Fragment} from "react";
import {Button, Header, Menu, Message, Segment} from "semantic-ui-react";
import {Marker, TileLayer, Map as LeafletMap, Polyline, FeatureGroup} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import ControlInfo from "./map/ControlInfo";
import Crime from "./information/Crime";
import HealthServices from "./information/HealthServices";
import Demographics from "./information/Demographics";
import Restaurants from "./information/Restaurants";
import Summary from "./information/Summary";
import SportsFacilities from "./information/SportsFacilities";
import Commute from "./information/Commute";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server'
import ControlBackButton from "./map/ControlBackButton";
import Schools from "./information/Schools";

export default class PropertiesMap extends Component {
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
            mapHeight: this.getMapHeight(),
            mapLoading: false,
            mapContents: null,

            markers: [],
            markerClusterBounds: null,

            polylines: [],

            property: null,

            activeInfo: 'summary',

        };
    }

    componentDidMount() {
        const markers = this.state.properties.map((elem) =>
            <Marker key={elem.listing_id} position={[elem.latitude, elem.longitude]} draggable={false}
                    onClick={() => this.markerOnClick(elem)} icon={this.customMarkerIcon()}>
                {/*<Popup>*/}
                    {/*{elem.propertyimage_set.map(x => <Image src={x.url}/>)}*/}
                {/*</Popup>*/}
                {/*<Tooltip style={{height: 100, width: 100}}>*/}
                {/*</Tooltip>*/}

            </Marker>
        );
        this.setState({markers}, this.setBounds);
        window.addEventListener("resize", this.resizeMap);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeMap);
    }

    resizeMap = () => {
        this.setState({mapHeight: this.getMapHeight()})
    };

    getMapHeight() {
        return (window.innerHeight > 400 ? window.innerHeight - 110 : 400);
    }

    setBounds = () => {
        const {properties} = this.state;

        if(properties.length > 0) {
            let mapMaxBounds = this.leafletMap.current.leafletElement.getBounds();
            this.setState({mapMaxBounds});
            let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
            this.leafletMap.current.leafletElement.fitBounds(markerClusterBounds)
        }
    };

    customMarkerIcon = (size="2em") => divIcon({
        html: renderToStaticMarkup(
            <span className="fa-stack fa-1x">
                    <i className="fas fa-home fa-stack-1x" style={{color: '#55855b', marginTop: 0, fontSize: size}}/>
            </span>
        )
    });

    markerOnClick = async (property) => {
        let data = await fetch('/api/properties/' + property.listing_id).then(x => x.json());
        let polylines = [];
        if (property.route_data && this.state.activeInfo === 'commute') {
            polylines = property.route_data.map((route) => {
                return route.response.route[0].leg[0].maneuver
                        .map(x => [x.position.latitude, x.position.longitude]);
            });
        }
        await this.setState({
            property: {...property, ...data},
            polylines,
        });

        this.leafletMap.current.leafletElement.panTo([property.latitude, property.longitude]);
    };

    handleEditFilters = () => {
        let {data} = this.state;
        this.props.history.push('/', {data});
    };

    updateMapBounds = () =>
                this.leafletMap.current.leafletElement.fitBounds(this.customContentsLayer.current.leafletElement.getBounds());

    displayInformationContents = (contents, property=null) => {
        const {markers} = this.state;
        if(contents) {

            if(property) {
                const propertyMarker =
                    <Marker key={property.listing_id} position={[property.latitude, property.longitude]}
                            draggable={false} icon={this.customMarkerIcon("2.5em")}/>;

                this.setState({
                    mapContents: [
                        <MarkerClusterGroup>{contents}</MarkerClusterGroup>,
                        propertyMarker
                    ]
                }, this.updateMapBounds);
            } else {
                this.setState({
                    mapContents: [
                        <MarkerClusterGroup>{markers}</MarkerClusterGroup>,
                        contents
                    ]
                }, this.updateMapBounds);
            }
        } else {
            this.setState({mapContents: null});
        }
    };

    resetMap = async () => {
        await this.setState({mapContents: null, property: null, polylines: []});
    };

    toggleMapLoader = (mapLoading) => this.setState({mapLoading});

    leafletMap = React.createRef();
    markerCluster = React.createRef();
    customContentsLayer = React.createRef();

    render() {
        const {mapCenterPosition, markers, count, data,
            mapMaxBounds, property, polylines, activeInfo, mapContents, mapHeight, mapLoading} = this.state;
        let InfoSegment = (props) => "";

        if(property) {
            switch(activeInfo){
                case 'summary':
                    InfoSegment = Summary;
                    break;
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
                case 'schools':
                    InfoSegment = Schools;
                    break;
            }
        }
        const colourPallete = ["#26547C", "#03AA8C", "#EF476F", "#FFD166",];
        const contents = mapContents ? <FeatureGroup ref={this.customContentsLayer}>{mapContents}</FeatureGroup> :
            <MarkerClusterGroup ref={this.markerCluster}>
                {markers}
            </MarkerClusterGroup>;

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
                <Segment attached loading={mapLoading}>
                    <LeafletMap
                        ref={this.leafletMap}
                        center={mapCenterPosition}
                        zoom={8}
                        minZoom={10}
                        maxZoom={18}
                        maxBounds={mapMaxBounds}
                        style={{height: mapHeight, border: "1px solid #ddd", padding: 26, marginTop: 10, zIndex: 10}}>
                        <TileLayer
                            url="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        />
                        {contents}
                        {activeInfo === 'commute' && polylines.map((polylinePositions, index) =>
                            <Polyline
                                color={colourPallete[index % colourPallete.length]} positions={polylinePositions}/>)}
                        <ControlInfo property={property}/>
                        <ControlBackButton property={property} action={this.resetMap} mapContents={mapContents}
                                           toggleMapLoader={this.toggleMapLoader} />
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
                        <Menu.Item name='Schools' active={activeInfo === 'schools'}
                                   onClick={() => this.setState({activeInfo: 'schools'})}/>
                        <Menu.Item disabled={!data.commute} name='Commute' active={activeInfo === 'commute'}
                                   onClick={() => this.setState({activeInfo: 'commute'})}/>
                    </Menu>
                }

                <InfoSegment property={property} updateMapContents={this.displayInformationContents} data={data}
                             toggleMapLoader={this.toggleMapLoader}/>
            </Fragment>
        )
    }
}