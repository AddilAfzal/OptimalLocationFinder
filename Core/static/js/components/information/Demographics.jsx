import React, {Component, Fragment} from "react";
import {Header, Segment} from "semantic-ui-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

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
            <ResponsiveContainer width="100%" height={500}>
                <BarChart layout="vertical" data={chartData} margin={{left: 20, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="value"
                         isAnimationActive={false}
                         data={chartData}
                         fill="#8884d8"
                         barSize="30"
                         label="name"/>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                    <XAxis type="number" >
                        <Label value="Population"  position='outside' offset={40} dy={20}/>
                    </XAxis>
                    <YAxis dataKey="name"  type="category"  width={135} >
                        <Label value="Ethnic background"  angle={270} position='left' style={{ textAnchor: 'middle' }}/>
                    </YAxis>
                </BarChart>
            </ResponsiveContainer>
        );

        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Demographics
                </Header>
                <Segment attached loading={loading} style={{paddingBottom: 40}}>
                    {/*<h4>Types of crime committed in the last 30 days.</h4>*/}
                    <Header a="h4">Ethnic backgrounds</Header>
                    <p>By borough</p>
                    {body}
                </Segment>

            </Fragment>
        )
    }
}