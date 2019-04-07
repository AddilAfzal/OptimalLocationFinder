import React, {Component} from 'react'
import {
    Header, Input, Search,
} from 'semantic-ui-react'
import {Marker} from "react-leaflet";
import * as debounce from "debounce";

export default class Explore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: null,
            isLoading: false,
            suggestions: [],
            results: [],
            value: '',
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
    }, 400);

    render() {
        const {isLoading, results, value} = this.state;

        const resultRenderer = ({text, vicinity}) =>
            <div>{text} {vicinity &&
                <small dangerouslySetInnerHTML={{__html: vicinity.split("<br/>").join(", ")}}/>}
            </div>;

        return (
            <Search
                loading={isLoading}
                // onResultSelect={this.handleResultSelect}
                // onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
                // results={results}
                // value={value}
                onSearchChange={(e, o) => {
                    this.setState({value: o.value});
                    this.handleSearchChange(e, o)
                }}
                results={results}
                value={value}
                resultRenderer={resultRenderer}
                {...this.props}
            />
        )
    }
}