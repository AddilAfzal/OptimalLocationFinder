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
import Filters from "../components/Filters";
import Map from "../components/Map";
import {Route, BrowserRouter as Router, Link} from "react-router-dom";


export default class indexContainer extends Component {
    constructor() {
        super();

        this.state = {
            step: null,
        }
    }

    render() {
        return (
            <div>
                <Navigation/>
                <div className={"ui container"}>
                    <br/>
                    <Header as='h1'>Welcome</Header>
                    <p>Optimal location finder (OLF) is a tool to help you find the best place to live depending on a
                        set of unique
                        requirements.</p>

                    {/*<Filters/>*/}
                    <br/>
                    <Router>
                        <div>
                            {/*<nav>*/}
                            {/*<ul>*/}
                            {/*<li>*/}
                            {/*<Link to="/">Home</Link>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                            {/*<Link to="/about/">About</Link>*/}
                            {/*</li>*/}
                            {/*<li>*/}
                            {/*<Link to="/results/" others={{}}>Results</Link>*/}
                            {/*</li>*/}
                            {/*</ul>*/}
                            {/*</nav>*/}

                            <Route path="/" exact component={Filters}/>
                            <Route path="/results/" component={Map}/>
                        </div>
                    </Router>
                </div>

                <Footer/>
            </div>
        )
    }
}