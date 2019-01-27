import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label, Modal, Image
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import PropertyTypeFilter from "./filters/PropertyTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import DistanceFilter from "./filters/DistanceFilter";
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
            show: {
                PropertyTypeFilter: true,
                AreaFilter: true,
                RoomsFilter: false,
                PriceFilter: false,
                DistanceFilter: false,
            },
            data: {},
            filters: [],
            showPriceFilter: false,
        };
    }

    // componentDidMount = () => {
    //     this.setState({
    //         filters: [
    //             <PropertyTypeFilter key={Math.random()} ref={React.createRef()} reloadData={this.reloadData} onFirstValid={() => {
    //                 this.reloadData(); this.addFilter(<PriceFilter key={Math.random()} ref={React.createRef()} reloadData={this.reloadData}
    //                                             getFilter={this.getFilter} data={this.state.data}/>)
    //             }}/>,
    //         ]
    //     });
    // };


    getFilter = (filterType) => {
        return this.state.filters.filter(f => f.type.name === filterType)[0];
    };

    reloadData = async () => {
        let data = this.state.filters.length > 0 ? this.state.filters
            .map(f => f.ref.current.getData())
            .reduce((obj, item) => {
                let key = Object.keys(item)[0];
                obj[key] = item[key];
                return obj;
            }) : [];
        data = {...data, ...this.propertyFilterRef.current.getData()};
        if (this.priceFilterRef.current) {
            data = {...data, ...this.priceFilterRef.current.getData()};
        }
        await this.setState({data})
    };

    printData = () => {
        console.log(
            this.state.filters
                .map(f => f.ref.current.getData())
                .reduce((obj, item) => {
                    let key = Object.keys(item)[0];
                    obj[key] = item[key];
                    return obj;
                })
        );
    };

    addFilter = async (f) => {
        await this.setState({filters: [...this.state.filters, f]})
    };

    removeFilter = async (f) => {
        let key = f.props["data-key"];
        let filters = this.state.filters.filter((f) => parseInt(f.key) !== key);
        await this.setState({filters})
        this.reloadData();
    };

    onFirstValid = async () => {
        await this.reloadData();
        this.setState({showPriceFilter: true});
    };

    propertyFilterRef = React.createRef();
    priceFilterRef = React.createRef();


    render() {
        const {filters, showPriceFilter} = this.state;

        return (
            <div>
                <Button primary size="large" onClick={() => this.setState({show: true})}>
                    Start
                </Button>
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    <PropertyTypeFilter ref={this.propertyFilterRef} reloadData={this.reloadData}
                                        onFirstValid={this.onFirstValid}/>
                    { this.state.showPriceFilter && <PriceFilter ref={this.priceFilterRef}
                                 reloadData={this.reloadData}
                                 getFilter={this.getFilter}
                                 data={this.state.data}/> }
                    {filters}

                    <p>
                        Please select at least one filter to apply.
                    </p>

                    <AddFilterModal
                        filters={this.state.filters}
                        addFilter={this.addFilter}
                        removeFilter={this.removeFilter}
                        reloadData={this.reloadData}
                    />

                    <div style={{textAlign: 'right'}}>
                        { this.state.filters.length > 0 && <Button size={'large'} primary>Submit</Button> }
                    </div>
                    <Button onClick={this.printData}>Print data</Button>
                </Fragment>
            </div>
        )
    }
}