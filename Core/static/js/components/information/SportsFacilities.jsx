import React, {Component, Fragment} from "react";
import {Header, Image, Segment, Table} from "semantic-ui-react";
import {Card} from "semantic-ui-react/dist/commonjs/views/Card";

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

const Activity = ({activity}) => {
    return (
        <div>{activity['name']}</div>
    )
};

const ActivePlace = ({data}) => {
    return (
        <Table.Row>
            <Table.Cell>
                <h5>{titleCase(data.name)}</h5>
                {data.contact.email && [data.contact.email, <br/>]}
                {data.contact.website && [data.contact.website, <br/>]}
                {data.contact.telephone && [data.contact.telephone, <br/>]}
            </Table.Cell>
            <Table.Cell>
                {data.activities.map(x => <Activity activity={x}/>)}
            </Table.Cell>
            <Table.Cell>
                {(data.distance).toFixed(2)} KM
            </Table.Cell>
        </Table.Row>
    )
};

export default class SportsFacilities extends Component {
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
            await fetch(`/api/get_closest_active_places/${latitude}/${longitude}/`)
                .then(x => x.json());

        this.setState({data, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;


        const body = data && (
            <Fragment loading={true}>
                <Table basic='very' celled >
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell singleLine>Location</Table.HeaderCell>
                            <Table.HeaderCell>Activities</Table.HeaderCell>
                            <Table.HeaderCell>Distance</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map(x => (<ActivePlace data={x}/>))}
                    </Table.Body>
                </Table>
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Sports Facilities
                </Header>
                <Segment attached loading={loading} style={{ paddingBottom: 40}}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}