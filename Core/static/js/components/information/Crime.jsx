import React, {Component, Fragment} from "react";
import {Card, Header, Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


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
                        Crime Statistics
                    </Header>
                    <Segment attached loading={loading} style={{height: 400, paddingBottom: 40}}>
                        <h4>Types of crime committed in the last 30 days.</h4>
                        <ResponsiveContainer>
                            <BarChart data={chartData}
                                      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="category"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="value" fill="#8884d8"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Segment>
                </Fragment>
            )
        } else {
            return ""
        }
    }
}