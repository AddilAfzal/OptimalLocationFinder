import React, {Component, Fragment} from 'react'
import {
    Header,
} from 'semantic-ui-react'
import Footer from './../components/footer'
import Navigation from './../components/navigation'
import Filters from "../components/Filters";
import PropertiesMap from "../components/PropertiesMap";
import {Route, BrowserRouter as Router, Link} from "react-router-dom";
import Explore from "../components/Explore";
import CustomMenu from "../components/Menu";
import LocationMap from "../components/LocationMap";
import About from "../components/About";


export default class indexContainer extends Component {
    constructor() {
        super();

        this.state = {
            pagePath: '/',
        }
    }

    routeRef = React.createRef();

    componentDidMount() {
        const pagePath = this.routeRef.current.history.location.pathname;
        console.log(pagePath)
        console.log(this.routeRef.current)
        this.setState({pagePath});
    }

    changePage = (pagePath) => {
        const {history} = this.routeRef.current;
        history.push(pagePath);
        this.setState({pagePath});
    };

    render() {
        const {pagePath} = this.state;
        return (
            <div>
                <Navigation/>
                <div className={"ui container"}>
                    <br/>
                    <Header as='h1'>Welcome</Header>
                    <p>Optimal location finder (OLF) is a tool to help you find the best place to live depending on a
                        set of unique requirements.<br/> You can search for properties or explore an area.</p>
                    <br/>

                    <CustomMenu pagePath={pagePath} changePage={this.changePage}/>

                    <Router ref={this.routeRef}>
                        <div>
                            <Route path="/" exact component={Filters}/>
                            <Route path="/results/" exact component={PropertiesMap}/>
                            <Route path="/explore/" exact component={Explore}/>
                            <Route path="/explore/location/" exact component={LocationMap}/>
                            <Route path="/about/" component={About}/>
                        </div>
                    </Router>
                </div>

                <Footer/>
            </div>
        )
    }
}