import React, {Component, Fragment} from "react";
import {Header, Image, Segment, Table} from "semantic-ui-react";


export default class Commute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            property: props.property,
        }
    }
re
    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.property !== this.state.property) {
            this.setState({property: nextProps.property, loading: true}, this.fetchData);
        }
    }

    fetchData = async () => {
        // const {latitude, longitude} = this.props.property;
        // const data =
        //     await fetch(`/api/get_closest_health_services/${latitude}/${longitude}/`)
        //         .then(x => x.json());
        //
        // this.setState({data, loading: false});
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;
        const body = data && (
            <Fragment>
                <h4>Information about your commute/s</h4>

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