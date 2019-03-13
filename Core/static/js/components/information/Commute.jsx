import React, {Component, Fragment} from "react";
import {Button, Divider, Header, Image, Segment, Table} from "semantic-ui-react";


export default class Commute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            property: props.property,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.property !== this.state.property) {
            this.setState({property: nextProps.property, loading: false}, this.fetchData);
        }
    }

    render() {
        const {property, data} = this.props;
        const {loading} = this.state;
        const locations = property.route_data.map((item, index) => {

            return (
                <Segment>
                    <Header as='h3'>{data.commute.commute[index].text}</Header>
                    <div dangerouslySetInnerHTML={{__html: item.response.route[0].summary.text}}/>
                    <Divider/>
                    <Button primary={true}>Show route steps</Button>
                    <Divider/>
                    {item.response.route[0].leg[0].maneuver.map((x) => <p dangerouslySetInnerHTML={{__html: x.instruction}}/>)}
                </Segment>
            )
        });

        console.log(property.route_data);

        const body = data && (
            <Fragment>
                {locations}
            </Fragment>
        );
        return (
            <Fragment>
                <Header as='h3' attached='top'>
                    Commute
                </Header>
                <Segment attached loading={loading} style={{paddingBottom: 40}}>
                    {body}
                </Segment>
            </Fragment>
        )
    }
}