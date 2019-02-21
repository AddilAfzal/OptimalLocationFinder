import React, {Component, Fragment} from "react";
import {Header, Segment} from "semantic-ui-react";
import {Cell, Pie, PieChart, Tooltip} from "recharts";

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class Demographics extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            await fetch(`/api/get_demographics/${latitude}/${longitude}/`)
                .then(x => x.json())

        console.log(data)
        const chartData = data.map(k => ({name: k.ethnic_group, value: k.total}) );

        console.log(chartData)
        this.setState({data, chartData, loading: false});
    };

    render() {
        const {property} = this.props;
        const {chartData, loading} = this.state;

        const body = chartData && (
            <PieChart width={400} height={320}>
                <Pie dataKey="value" isAnimationActive={false} data={chartData} cx={180} cy={140}
                     outerRadius={140} fill="#8884d8"
                     innerRadius={100}
                     label={({name, value}) => name}>
                    {
                        chartData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
                <Tooltip/>
            </PieChart>
        );

        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Location
                </Header>
                <Segment attached loading={loading} style={{paddingBottom: 40}}>
                    {/*<h4>Types of crime committed in the last 30 days.</h4>*/}
                    {body}
                </Segment>

            </Fragment>
        )
    }
}