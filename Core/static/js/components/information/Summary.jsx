import React, {Component, Fragment} from "react";
import {Button, Card, Divider, Header, Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


export default class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: null,
        }
    }

    componentDidMount() {
        this.props.updateMapContents(null, null);
    }
    //
    // async fetchData() {
    //     const {property} = this.props;
    //     const data = await fetch("http://api.postcodes.io/postcodes?" +
    //         `lon=${property.longitude}` +
    //         `&lat=${property.latitude}`).then(a => a.json());
    //     this.setState({data: data['result'][0]});
    // }

    render() {
        const {property} = this.props;
        const {loading} = this.state;

        const body = (
            <Fragment>
                <Button onClick={() => window.open(property.details_url,'_blank')} secondary>View on Zoopla</Button>
                <Divider/>
                <div dangerouslySetInnerHTML={{__html: property.short_description}}/>
                <h4>Address</h4>
                {property.street_name}, {property.outcode}
                <h4 style={{marginBottom: 0}}>First listed</h4>
                {property.first_published}
                <h4 style={{marginBottom: 0}}>Last updated</h4>
                {property.last_published}
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Summary
                </Header>
                <Segment attached loading={loading}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}