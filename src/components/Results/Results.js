import React, { Component } from 'react';

export default class Results extends Component {
    constructor() {
        super();
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="Results">
                {JSON.stringify(this.props)}
            </div>
        )
    }
}
