import React, {Component, Fragment} from "react";
import {Card, Header, Message, Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {startCase} from "lodash";


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

        const chartData = Object.keys(p).map(k => ({category: startCase(k), value: p[k]}) );

        this.setState({data, chartData, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading, chartData} = this.state;

        const body = data && (
            <Fragment>
                 <h4>Types of crime committed in the last 30 days.</h4>
                        <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical"
                                      margin={{top: 5, right: 30, left: 30, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis type="number"/>
                                <YAxis type="category" dataKey="category" width={135}/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="value" fill="#8884d8" name="# occurrences">
                                    {/*<LabelList dataKey="category" position="right" />*/}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
            </Fragment>
        );
            return (
                <Fragment>
                    <Header as='h3' attached='top'>
                        Crime Statistics
                    </Header>
                    <Segment attached loading={loading} style={{height: 500, paddingBottom: 40}}>
                        {body}
                    </Segment>
                    <Message warning attached='bottom'>
                        The data shown is based on crimes that have occurred within a 1 KM radius from the selected location.
                    </Message>
                </Fragment>
            )
    }
}