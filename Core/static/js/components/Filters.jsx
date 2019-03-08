import React, {Component, Fragment} from "react";
import {
    Button, Container, Header, Form, Label, Modal, Image
} from 'semantic-ui-react'

import {Divider, Segment} from 'semantic-ui-react'
import Slider, {Range} from 'rc-slider';
import ListingTypeFilter from "./filters/ListingTypeFilter";
import AreaFilter from "./filters/AreaFilter";
import RoomsFilter from "./filters/RoomsFilter";
import CommuteFilter from "./filters/CommuteFilter";
import PropertyTypeFilter from "./filters/PropertyTypeFilter";
import PriceFilter from "./filters/PriceFilter";
import AddFilterModal from "./AddFilterModal";
import SchoolFilter from "./filters/SchoolFilter";

export default class Filters extends Component {
    constructor(props) {
        super(props);
        console.log(props)

        this.state = {
            data: {},
            filters: [],
            lock: true,
            submitLoading: false,
            ...props.location.state,
        };
    }

    componentDidMount() {
        this.loadFilters();
        // this.onSubmit();
    };

    loadFilters = async () => {
        const {filters, lock, data} = this.state;
        const {addFilter, removeFilter, enableLock, disableLock, reloadData} = this;

        const propMethods = {addFilter, removeFilter, enableLock, disableLock, reloadData};
        const propVars = {lock, filters, data};

        let onPriceValid = async () => await this.addFilter(<PropertyTypeFilter ref={React.createRef()}
                                                                    key={Math.random()}
                                                                    {...propMethods}
                                                                    {...propVars}/>);

        let onListingStatusValid = async () => await this.addFilter(<PriceFilter ref={React.createRef()}
                                                                     onFirstValid={onPriceValid}
                                                                     key={Math.random()}
                                                                     {...propMethods}
                                                                     {...propVars}/>);

        await this.addFilter(<ListingTypeFilter ref={React.createRef()}
                                          onFirstValid={onListingStatusValid}
                                          key={Math.random()}
                                          {...propMethods}
                                          {...propVars}/>);

        // Recreate the components on page back functionality.
        for(let key in data) {
            switch (key) {
                case 'area':
                    this.createFilterComponent(AreaFilter);
                    continue;
                case 'rooms':
                    this.createFilterComponent(RoomsFilter);
                    continue;
                case 'commute':
                    this.createFilterComponent(CommuteFilter);
                    continue
                case 'school':
                    this.createFilterComponent(SchoolFilter);
            }
        }
    };

    createFilterComponent = (F) => {
        const key = Math.random();
        this.addFilter(<F ref={React.createRef()} key={key} data-key={key} {...this.props} />)
    };

    reloadData = async () => {
        if (this.state.filters.filter(f => f.ref.current === undefined | f.ref.current === null).length > 0) {
            return
        }

        let data = this.state.filters.length > 0 ? this.state.filters
            .map(f => f.ref.current.getData())
            .reduce((obj, item) => {
                let key = Object.keys(item)[0];
                obj[key] = item[key];
                return obj;
            }) : [];
        await this.setState({data})
    };

    addFilter = (f) => {
        this.setState({filters: [...this.state.filters, f]});
    };

    removeFilter = async (f) => {
        const key = f.props["data-key"];
        let filters = this.state.filters.filter( (f) => f.key.toString() !== key.toString());
        await this.setState({filters})
        await this.reloadData();
    };

    enableLock = () => this.setState({lock: true});
    disableLock = () => this.setState({lock: false});

    onSubmit = async () => {
        await this.setState({submitLoading: true});
        let {data, filters} = this.state;
        const requestData = Object.entries(data).reduce((obj, [key, value]) => {
            return {...obj, ...value};
        }, {});

        // console.log(requestData)

        const properties = await fetch('/api/properties/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData)
        }).then(x => x.json());

        this.props.history.push('/results', {properties, data});
    };

    render() {
        const {lock, data, filters, submitLoading} = this.state;
        const {addFilter, removeFilter, enableLock, disableLock, reloadData, onSubmit, createFilterComponent} = this;

        const propMethods = {addFilter, removeFilter, enableLock, disableLock, reloadData, createFilterComponent};
        const propVars = {lock, filters, data};

        let updatedFilters = this.state.filters.map((F) => React.cloneElement(F,{...propVars, ...propMethods}));

        return (
            <div>
                <Fragment>
                    <br/>
                    <br/>
                    <hr/>
                    {updatedFilters}
                    <p>
                        Please select at least one filter to apply.
                    </p>

                    {/*{ (filters.length >= 3 && lock === false) &&*/}
                    <AddFilterModal {...propMethods} {...propVars}/>
                    {/*}*/}

                    <div style={{textAlign: 'right'}}>
                        <Button size={'large'} primary disabled={(filters.length < 3 || lock === true)}
                                loading={submitLoading} onClick={onSubmit}>Submit</Button>
                    </div>
                </Fragment>
            </div>
        )
    }
}