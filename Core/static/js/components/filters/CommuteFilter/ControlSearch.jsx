import React, {Component, Fragment} from "react";
import {Search} from "semantic-ui-react";
import {Map, Marker, withLeaflet} from "react-leaflet";
import * as debounce from "debounce";

function formatPrice(property)
{
    if(property.listing_status === 'rent') {
        return `${Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((property.rentalprice_set[0].per_month))} pcm`
    } else {
        return new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format((property.price))
    }
}

class ControlSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            suggestions: [],
            results: [],
            value: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.property !== this.props.property) {
            this.forceUpdate();
        }
    }

    getSuggestions = async (search) =>
        await fetch(`/api/auto_complete/${search}/`)
            .then(response => response.json())
            .then(x => x.results)
            .then(suggestions => this.setState({suggestions}));


    handleSearchChange = debounce(async (e, o) => {
        if(o.value.length > 2) {
            await this.setState({loading: true});
            await this.getSuggestions(o.value);
            if(this.state.suggestions && this.state.suggestions.length > 0) {
                const results = this.state.suggestions
                    .filter(s => s.resultType !== "chain")
                    .map( (x, i) => ({title: x.href, text: x.title, position: x.position, vicinity: x.vicinity,}))
                    .slice(0, 6);
                this.setState({results});
            }
            this.setState({loading: false});
        }
        this.forceUpdate();

    }, 600);

    handleResultSelect = (e, {result}) => {
        let marker = <Marker key={result.position} ref={React.createRef()} draggable={true}
                             position={result.position} text={result.text}
                             time={45} />
        this.setState({ value: result.text});
        this.props.addMarker(marker);
    };

    render() {
        const {results, value, loading} = this.state;
        let resultRenderer = ({text, vicinity}) =>
            <div>{text} {vicinity &&
                <small dangerouslySetInnerHTML={{__html: vicinity.split("<br/>").join(", ")}}/>}
            </div>;

        return (
            <Search
                placeholder={"Search"}
                loading={loading}
                onSearchChange={(e, o) => {
                    this.setState({value: o.value});
                    this.handleSearchChange(e, o)
                }}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
                onResultSelect={this.handleResultSelect}
            />)
    }
}

export default withLeaflet(ControlSearch);