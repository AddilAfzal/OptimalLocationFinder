import React, {Component, Fragment} from "react";
import {Button, Header, Label, Rating, Segment, Table} from "semantic-ui-react";
import {Marker, Tooltip} from "react-leaflet";


export default class Restaurants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            property: props.property,
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
        this.props.toggleMapLoader(true);
        const {latitude, longitude} = this.props.property;

        const data =
            await fetch(`https://developers.zomato.com/api/v2.1/search?` +
                `lat=${latitude}&lon=${longitude}&` +
                `radius=1000&sort=real_distance`,
                {
                    headers: {
                        "user-key": "d87c028817211b8d2b6df3e125b81d94"
                    }
                })
                .then(x => x.json());

        this.setState({data, loading: false}, this.updateMap);
    };


    updateMap = () => {
        const {data} = this.state;
        const {property} = this.props;

        const markers = data.restaurants.map((r) => {
            console.log(r.restaurant);
            const l = r.restaurant;
            return <Marker key={l.id} position={[l.location.latitude, l.location.longitude]}
                           draggable={false}>
                {/*<Popup>*/}
                    {/*Test123*/}
                {/*</Popup>*/}
                <Tooltip style={{height: 100, width: 100}}>
                    {l.name}
                </Tooltip>
            </Marker>
        });

        this.props.updateMapContents(markers, property);
        this.props.toggleMapLoader(false);
    };

    render() {
        const {data, loading} = this.state;

        let body = [];
        if (data) {
            body = data.restaurants.slice(0, 15).map((x) => {
                const restaurant = x.restaurant;
                return <Table.Row>
                    <Table.Cell>
                        {restaurant.name}
                    </Table.Cell>
                    <Table.Cell>
                        <Label style={{background: '#' + restaurant.user_rating.rating_color}}>{restaurant.user_rating.rating_text}</Label><br/>
                        <Rating defaultRating={Math.round(restaurant.user_rating.aggregate_rating)} maxRating={5}
                                title={restaurant.user_rating.aggregate_rating} disabled/>
                    </Table.Cell>
                    <Table.Cell>
                        {restaurant.cuisines}
                    </Table.Cell>
                    <Table.Cell>
                        <Button size="tiny" href={restaurant.menu_url} target="_blank">View</Button>
                    </Table.Cell>
                    <Table.Cell>
                        {restaurant.location.address}
                    </Table.Cell>
                </Table.Row>
            });
        }

        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Restaurants
                </Header>
                <Segment attached loading={loading} style={{ paddingBottom: 40}}>
                    <h4>Places to eat near by.</h4>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Rating</Table.HeaderCell>
                                <Table.HeaderCell>Cuisines</Table.HeaderCell>
                                <Table.HeaderCell>Menu</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
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