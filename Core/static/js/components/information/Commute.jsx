import React, {Component, Fragment} from "react";
import {Button, Divider, Header, Image, Segment, Table} from "semantic-ui-react";
import {Marker, Tooltip as LeafletTooltip} from "react-leaflet";
import {startCase} from "lodash";


class CommuteSingle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showRouteSteps: false,
            commuteData: null,
        }
    }

    render() {
        const {showRouteSteps} = this.state;
        const {locationTitle, commuteData} = this.props;

        return (
            <Segment>
                <Header as='h3'>{locationTitle}</Header>
                <div dangerouslySetInnerHTML={{__html: commuteData.summary.text}}/>
                <Divider/>
                <Button primary onClick={() => this.setState({showRouteSteps: !showRouteSteps})}>
                    Toggle route steps
                </Button>
                {showRouteSteps && [<Divider/>,
                        commuteData.leg[0].maneuver.map((x) => <p
                            dangerouslySetInnerHTML={{__html: x.instruction}}/>)]}

            </Segment>)
    }
}

export default class Commute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            property: props.property,
        }
    }

    componentDidMount() {
        this.updateMap();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.property !== this.state.property) {
            this.setState({property: nextProps.property, loading: false}, this.updateMap);
        }
        console.log(this.props);
    }

    updateMap = async () => {
        const {property, data} = this.props;

        const locations = data.commute.commute.map(item =>
            <Marker key={item.text} position={item.position}
                    draggable={false}>
                <LeafletTooltip>
                    {/*{startCase(item)}*/} {item.text}
                </LeafletTooltip>
            </Marker>
        );

        this.props.updateMapContents(locations);
        this.props.toggleMapLoader(false);
    };

    render() {
        const {property, data} = this.props;
        const {loading} = this.state;
        const locations = property.route_data.map((item, index) => {
            return (
                <CommuteSingle
                    locationTitle={data.commute.commute[index].text}
                    commuteData={item.response.route[0]}/>
            )
        });

        console.log(property.route_data);

        const body = data && (
            <Fragment>
                {locations}
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Commute
                </Header>
                <Segment attached loading={loading} style={{paddingBottom: 40}}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}