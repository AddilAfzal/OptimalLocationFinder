import React, {Component, Fragment} from "react";
import {Button, Header, Menu, Message, Segment} from "semantic-ui-react";
import {Marker, TileLayer, Map as LeafletMap, Polyline, FeatureGroup} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Crime from "./information/Crime";
import HealthServices from "./information/HealthServices";
import Demographics from "./information/Demographics";
import Restaurants from "./information/Restaurants";
import Summary from "./information/Summary";
import SportsFacilities from "./information/SportsFacilities";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server'

export default class LocationsMap extends Component {
    constructor(props) {
        super(props);

        const {selectedLocation} = props.location.state;

        this.state = {

            selectedLocation: {
                ...selectedLocation,
                latitude: selectedLocation.position[0],
                longitude: selectedLocation.position[1],
            },

            mapCenterPosition: selectedLocation.position,
            mapZoom: 12,
            mapBounds: null,
            mapMaxBounds: null,
            mapHeight: this.getMapHeight(),
            mapLoading: false,
            mapContents: null,

            markers: [],
            markerClusterBounds: null,

            polylines: [],

            activeInfo: 'crime',
        };

        console.log(this.state)
    }


    componentDidMount() {
        const {selectedLocation} = this.state;
        const marker = <Marker position={selectedLocation.position}
                               draggable={false}
                                // onClick={() => this.markerOnClick(marker)}
                               icon={this.customMarkerIcon()}/>;

        this.setState({marker}, this.setBounds);
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
        // const {position} = this.state.selectedLocation;

        // let mapMaxBounds = this.leafletMap.current.leafletElement.getBounds();
        // this.setState({mapMaxBounds});
        // let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
        // this.leafletMap.current.leafletElement.fitBounds(markerClusterBounds)
    };

    customMarkerIcon = (size="2em") => divIcon({
        html: renderToStaticMarkup(
            <span className="fa-stack fa-1x">
                    <i className="fas fa-home fa-stack-1x" style={{color: '#55855b', marginTop: 0, fontSize: size}}/>
            </span>
        )
    });

    handleChangeLocation = () => {
        let {selectedLocation} = this.state;
        this.props.history.push('/explore', {selectedLocation});
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
        await this.setState({mapContents: null, polylines: []});
        // let markerClusterBounds = this.markerCluster.current.leafletElement.getBounds();
        // this.leafletMap.current.leafletElement.fitBounds(markerClusterBounds);
    };

    toggleMapLoader = (mapLoading) => this.setState({mapLoading});

    leafletMap = React.createRef();
    markerCluster = React.createRef();
    customContentsLayer = React.createRef();

    render() {
        const {mapCenterPosition, data, selectedLocation, mapMaxBounds, mapZoom,
            polylines, activeInfo, mapContents, marker, mapHeight, mapLoading} = this.state;

        let InfoSegment = (props) => "";

        switch (activeInfo) {
            case 'summary':
                InfoSegment = Summary;
                break;
            case 'crime':
                InfoSegment = Crime;
                break;
            case 'health':
                InfoSegment = HealthServices;
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
        }

        const colourPallete = ["#26547C", "#03AA8C", "#EF476F", "#FFD166",];
        const contents = <FeatureGroup ref={this.customContentsLayer}>{marker}{mapContents}</FeatureGroup>;

        return (
            <Fragment>
                <Button onClick={this.handleChangeLocation}>Edit location</Button>
                <Message
                    attached
                    icon='point'
                    header={`Location found`}
                    content='Click on a cluster to zoom in.'
                    success
                />
                <Segment attached loading={mapLoading}>
                    <LeafletMap
                        ref={this.leafletMap}
                        center={mapCenterPosition}
                        zoom={mapZoom}
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

                    </LeafletMap>
                </Segment>
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
                </Menu>

                <InfoSegment property={selectedLocation} updateMapContents={this.displayInformationContents} data={{test: 'none'}}
                             toggleMapLoader={this.toggleMapLoader}/>
            </Fragment>
        )
    }
}