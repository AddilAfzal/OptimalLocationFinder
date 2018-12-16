import React, {Component, Fragment} from 'react'
import {
    Container,
    Dropdown,
    Header,
    Image,
    Menu,
} from 'semantic-ui-react'
import Footer from './../components/footer'
import Navigation from './../components/navigation'
import Map from "./../components/map";
import Filters from "./../components/filters";


export default class MapContainer extends Component {
    constructor() {
        super();

        this.state = {
            step: null,
        }
    }

    async getData(requestData) {
        return await fetch(properties_api_url).then((data) => data.json());
    }

    render() {
        return (
            <div>
                <Navigation/>
                <div className={"ui container"}>
                    <div className="row" style={{marginTop: 80}} >
                        <div className="twelve wide column">
                            <Header as='h1'>Map</Header>
                            <Map getData={this.getData}/>
                        </div>
                    </div>
                </div>

                <Footer/>
            </div>
        )
    }
}