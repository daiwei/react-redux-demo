import './NavBar.css';
import React, { Component } from 'react';
import { API } from '../../actions'


/**********************************************************
 * NavBar @Component
 **********************************************************/
export default class NavBar extends Component {

    constructor(props) {
        super(props);

        const { loginUser } = window._storage_;
        this.state = {
            selectedUser: loginUser,
            users: null
        };
    }

    componentDidMount() {
        const self = this;
        API.fetchURL((data) => {
            self.setState({users: data, ...self.state})
        })
    }

    render() {
        return null
    }
}

