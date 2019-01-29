import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label, Modal, Image
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import ListingTypeFilter from "./filters/ListingTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import DistanceFilter from "./filters/DistanceFilter";
import PropertyTypeFilter from "./filters/PropertyTypeFilter";
import PriceFilter from "./filters/PriceFilter";
import AddFilterModal from "./AddFIlterModal";


const options = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];


export default class filters extends Component {
    constructor() {
        super();

        this.state = {
            data: {},
            filters: [],

            lock: true,
        };
    }

    componentDidMount() {
        const {filters, lock, data} = this.state;
        const {addFilter, removeFilter, enableLock, disableLock, reloadData} = this;

        const propMethods = {addFilter, removeFilter, enableLock, disableLock, reloadData};
        const propVars = {lock, filters, data};

        const onPriceValid = () => this.addFilter(<PropertyTypeFilter ref={React.createRef()}
                                                                      key={Math.random()}
                                                                      {...propMethods}
                                                                      {...propVars}/>);

        const onListingStatusValid = () => this.addFilter(<PriceFilter ref={React.createRef()}
                                                                       onFirstValid={onPriceValid}
                                                                       key={Math.random()}
                                                                       {...propMethods}
                                                                       {...propVars}/>);

        this.addFilter(<ListingTypeFilter ref={React.createRef()}
                                          onFirstValid={onListingStatusValid}
                                          key={Math.random()}
                                          {...propMethods}
                                          {...propVars}/>);
    };

    reloadData = async () => {
        let data = this.state.filters.length > 0 ? this.state.filters
            .map(f => f.ref.current.getData())
            .reduce((obj, item) => {
                let key = Object.keys(item)[0];
                obj[key] = item[key];
                return obj;
            }) : [];
        await this.setState({data})
    };

    printData = () => console.log(this.state.data);

    addFilter = (f) => this.setState({filters: [...this.state.filters, f]});

    removeFilter = async (f) => {
        const key = f.props["data-key"];
        let filters = this.state.filters.filter( (f) => f.key.toString() !== key.toString());
        await this.setState({filters})
        this.reloadData();
    };

    enableLock = () => this.setState({lock: true});
    disableLock = () => this.setState({lock: false});

    render() {
        const {filters, lock, data} = this.state;
        const {addFilter, removeFilter, enableLock, disableLock, reloadData} = this;

        const propMethods = {addFilter, removeFilter, enableLock, disableLock, reloadData};
        const propVars = {lock, filters, data};

        return (
            <div>
                <Button primary size="large" onClick={() => this.setState({show: true})}>
                    Start
                </Button>
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    {filters}
                    <p>
                        Please select at least one filter to apply.
                    </p>

                    { (filters.length >= 3 && lock === false) && <AddFilterModal {...propMethods} {...propVars}/> }

                    <div style={{textAlign: 'right'}}>
                        { this.state.filters.length > 0 && <Button size={'large'} primary disabled={!(filters.length >= 3 && lock === false) }>Submit</Button> }
                    </div>
                    <Button onClick={this.printData}>Print data</Button>
                </Fragment>
            </div>
        )
    }
}