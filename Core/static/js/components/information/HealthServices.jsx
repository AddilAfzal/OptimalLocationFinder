import React, {Component, Fragment} from "react";
import {Header, Image, Segment, Table} from "semantic-ui-react";


export default class HealthServices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            property: props.property,
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

    fetchData = async () => {
        const {latitude, longitude} = this.props.property;
        const data =
            await fetch(`/api/get_closest_health_services/${latitude}/${longitude}/`)
                .then(x => x.json());

        this.setState({data, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;
        const body = data && (
            <Fragment>
                <h4>Distance from closest health-care services</h4>
                <Table basic='very' celled collapsing definition style={{width: "100%"}}>
                    <Table.Header fullWidth>

                        <Table.Row>
                            <Table.HeaderCell> </Table.HeaderCell>
                            <Table.HeaderCell>Location</Table.HeaderCell>
                            <Table.HeaderCell>Distance</Table.HeaderCell>
                            <Table.HeaderCell>CQC Rating</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign='center'>
                                <Header as='h4' image>
                                    <Header.Content>
                                        <i className="fas fa-user-md fa-2x"/> GP
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{data['gp']['name']}</Table.Cell>
                            <Table.Cell>{data['gp']['distance']} KM</Table.Cell>
                            <Table.Cell>{data['gp']['last_rating']} </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign='center'>
                                <Header as='h4' image>
                                    <Header.Content>
                                        <i className="fas fa-hospital-symbol fa-2x"/> Hospital
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{data['hospital']['name']}</Table.Cell>
                            <Table.Cell>{data['hospital']['distance']} KM</Table.Cell>
                            <Table.Cell>{data['hospital']['last_rating']} </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign='center'>
                                <Header as='h4' image>
                                    <Header.Content>
                                        <i className="fa fa-tooth fa-2x"/> Dentist
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>{data['dentist']['name']}</Table.Cell>
                            <Table.Cell>{data['dentist']['distance']} KM</Table.Cell>
                            <Table.Cell>N/A </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Heath-care Services
                </Header>
                <Segment attached loading={loading} style={{paddingBottom: 40}}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}