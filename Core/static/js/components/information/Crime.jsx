import React, {Component, Fragment} from "react";
import {Card, Segment} from "semantic-ui-react";

export default class Crime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            categoryCounts: null,
            loading: true,
            property: null,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.property !== this.state.property) {
            this.setState({property: nextProps.property}, this.fetchData);
        }
    }

    fetchData = async () => {
        console.log(this.props.property)
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

        console.log(p)

        this.setState({data});
        console.log(data)
    };

    render() {
        const {property} = this.props;
        const {data, loading} = this.state;

        if(data) {
            return (
                <Segment loading={loading}>
                    <h1>Test</h1>
                </Segment>
            )
        } else {
            return ""
        }
    }
}