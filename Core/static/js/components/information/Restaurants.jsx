import React, {Component, Fragment} from "react";
import {Card, Header, Image, Rating, Segment} from "semantic-ui-react";


const Restaurant = (props) => {
    console.log(props)
    return (
        <Card key={props.R.res_id}>
            <Image url={props.url} src={props.thumb ? props.thumb :
                "https://www.albagaskets.com/media/placeholder.php?colour=d1e7f7&opacity=0.2&width=290&height=200"}/>
            <Card.Content>
                <Card.Header> <a target="_blank" href={props.url}>{props.name}</a></Card.Header>
                <Card.Meta>
                    <span className='date'>{props.cuisines}</span>
                </Card.Meta>
                {/*<Card.Description>Matthew is a musician living in Nashville.</Card.Description>*/}
            </Card.Content>
            <Card.Content extra>
                <Rating defaultRating={Math.round(props.user_rating.aggregate_rating)} maxRating={5} 
                        title={props.user_rating.aggregate_rating} disabled/>
            </Card.Content>
        </Card>
    )
};

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

        this.setState({data, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;

        let rs = [];

        if(data) {
          rs =   data.restaurants.slice(0,8).map((x) => <Restaurant {...x.restaurant}/>)
        }

        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Restaurants
                </Header>
                <Segment attached loading={loading} style={{ paddingBottom: 40}}>
                    <h4>Places to eat near by.</h4>
                      <Card.Group itemsPerRow={4}>
                        {rs}
                      </Card.Group>
                </Segment>
            </Fragment>
        )
    }
}