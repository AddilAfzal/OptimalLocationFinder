import React, {Component, Fragment} from 'react'
import SearchBox from "./explore/SearchBox";
import {Button, Card, Divider, Header, Search} from "semantic-ui-react";

const Location = ({text, vicinity, onRemove}) => {
    return (
        <Card>
            <Card.Content>
                <Card.Header content={text}/>
                {/*<Card.Meta content={vicinity}/>*/}
                <Card.Description>
                    <div dangerouslySetInnerHTML={{ __html: vicinity }} />
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button size='mini' onClick={onRemove}>Remove</Button>
            </Card.Content>
        </Card>
    )
};

export default class Explore extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            step: null,
            selectedLocation: null,
        }

    }

    handleResultSelect = (e, {result}) => {
        this.setState({selectedLocation: result});
        console.log(result)
    };

    handleShowMap = () => {
        const {history} = this.props;
        const {selectedLocation} = this.state;
        history.push('/explore/location/', {selectedLocation});
    };

    render() {
        const {selectedLocation} = this.state;

        const contents = selectedLocation ?
            <Fragment>
                <Location
                    {...selectedLocation}
                    onRemove={() => this.setState({selectedLocation: null})}
                />
                <Button
                    size="medium"
                    onClick={this.handleShowMap}
                    primary>
                    Explore
                </Button>
            </Fragment> :
            <Fragment>
                <SearchBox
                    placeholder="King's Cross"
                    onResultSelect={this.handleResultSelect}
                />
            </Fragment>;

        return (
            <div>
                <br/>
                <Header>
                        Explore an area
                </Header>
                <p>
                    Use this functionality if you already have a location in mind and want to find out more about it's surroundings.
                </p>
                {contents}
                <br/>
            </div>
        )
    }
}