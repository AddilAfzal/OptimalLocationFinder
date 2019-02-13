import React, {Component, Fragment} from "react";
import {Header, Segment} from "semantic-ui-react";


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
            await fetch(`https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}`)
                .then(x => x.json())

        const p = data.reduce((acc, value) => {
            if(acc.hasOwnProperty(value.category)) {
                acc[value.category] += 1;
            } else {
                acc[value.category] = 1;
            }
            return acc
        }, {});

        const chartData = Object.keys(p).map(k => ({category: k, value: p[k]}) );

        this.setState({data, chartData, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading, chartData} = this.state;

        if(data) {
            return (
                <Fragment>
                    <Header as='h3' attached='top'>
                        Heath-care Services
                    </Header>
                    <Segment attached loading={loading} style={{height: 400, paddingBottom: 40}}>
                        <h4>Dentist</h4>

                    </Segment>
                </Fragment>
            )
        } else {
            return ""
        }
    }
}