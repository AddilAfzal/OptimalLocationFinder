import React, {Component, Fragment} from "react";
import {Header, Segment, Table} from "semantic-ui-react";
import {startCase} from "lodash";
import {Marker, Tooltip as LeafletTooltip} from "react-leaflet";


export default class Crime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            property: null,
            chartData: null,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.property !== this.state.property) {
            this.setState({property: nextProps.property, loading: true}, this.fetchData);
        }
    }

    updateMap = async () => {
        const {data} = this.state;
        const {property} = this.props;

        const locations = data.map(item =>
            <Marker key={item.id} position={[item.lat, item.lng]}
                    draggable={false}>
                <LeafletTooltip>
                    {startCase(item.name)}
                </LeafletTooltip>
            </Marker>
                    );
        this.props.updateMapContents(locations, property);
        this.props.toggleMapLoader(false);
    };

    fetchData = async () => {
        this.props.toggleMapLoader(true);
        const {latitude, longitude} = this.props.property;
        const data =
            await fetch(`/api/get_closest_schools/${latitude}/${longitude}/`)
                .then(x => x.json())

        this.setState({data, loading: false}, this.updateMap);
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;

        const body = data && data.map((school) => (
            <Table.Row>
                <Table.Cell>
                    {school.name}
                </Table.Cell>
                <Table.Cell>
                    {school.street}, {school.postcode}
                </Table.Cell>
                <Table.Cell>
                    {(school.distance).toFixed(2)} KM
                </Table.Cell>
                <Table.Cell>
                    {school.is_primary ? <i className="fas fa-check"/>: <i className="fas fa-times"/>}
                </Table.Cell>
                <Table.Cell>
                    {school.is_secondary ? <i className="fas fa-check"/>: <i className="fas fa-times"/>}
                </Table.Cell>
                <Table.Cell>
                    {school.is_post16 ? <i className="fas fa-check"/>: <i className="fas fa-times"/>}
                </Table.Cell>
                <Table.Cell>
                    {school.ofstedinspection_set[0] ? school.ofstedinspection_set[0].overall_effectiveness : "Not available"}
                </Table.Cell>
            </Table.Row>
        ));
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Schools
                </Header>
                <Segment attached loading={loading} style={{minHeight: 500, paddingBottom: 40}}>
                    <h4>Educational facilities near by.</h4>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>Distance</Table.HeaderCell>
                                <Table.HeaderCell>Primary</Table.HeaderCell>
                                <Table.HeaderCell>Secondary</Table.HeaderCell>
                                <Table.HeaderCell>Post 16</Table.HeaderCell>
                                <Table.HeaderCell>Ofsted Rating</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {body}
                        </Table.Body>
                    </Table>
                </Segment>
            </Fragment>
        )
    }
}