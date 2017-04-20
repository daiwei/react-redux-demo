import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from '../components/NavBar';
import StatusBar from '../components/StatusBar';
import ReactMap from '../components/ReactMap';

export default () => {
    return (
        <div>
            <NavBar/>
            <StatusBar/>
            <ReactMap/>
        </div>
    )
}
