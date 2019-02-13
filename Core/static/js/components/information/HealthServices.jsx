import React, {Component, Fragment} from "react";
import {Header, Image, Segment, Table} from "semantic-ui-react";


export default class HealthServices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            property: null,
            chartData: null,
        }
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

        if(data) {
            return (
                <Fragment>
                    <Header as='h3' attached='top'>
                        Heath-care Services
                    </Header>
                    <Segment attached loading={loading} style={{height: 200, paddingBottom: 40}}>
                        <h4>Distance from closest health-care services</h4>
                          <Table basic='very' celled collapsing>
                              <Table.Header>
                                  <Table.Row>
                                      <Table.HeaderCell> </Table.HeaderCell>
                                      <Table.HeaderCell>Location</Table.HeaderCell>
                                      <Table.HeaderCell>Distance</Table.HeaderCell>
                                      <Table.HeaderCell>CQC Rating</Table.HeaderCell>
                                  </Table.Row>
                              </Table.Header>

                              <Table.Body>
                                  <Table.Row>
                                      <Table.Cell>
                                          <Header as='h4' image>
                                              <Header.Content>
                                                  <i className="fas fa-user-md fa-2x"/> GP
                                              </Header.Content>
                                          </Header>
                                      </Table.Cell>
                                      <Table.Cell>{data['gp']['name']}</Table.Cell>
                                      <Table.Cell>{data['gp']['distance']} KM</Table.Cell>
                                      <Table.Cell>Good</Table.Cell>
                                  </Table.Row>
                                  <Table.Row>
                                      <Table.Cell>
                                          <Header as='h4' image>
                                              <Header.Content>
                                                  <i className="fas fa-user-md fa-2x"/> GP
                                              </Header.Content>
                                          </Header>
                                      </Table.Cell>
                                      <Table.Cell>{data['hospital']['name']}</Table.Cell>
                                      <Table.Cell>{data['hospital']['distance']} KM</Table.Cell>
                                      <Table.Cell>Good</Table.Cell>
                                  </Table.Row>
                              </Table.Body>
                          </Table>
                    </Segment>
                </Fragment>
            )
        } else {
            return ""
        }
    }
}