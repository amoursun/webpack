import React from 'react'
import Routes from 'routes';
import stores from 'stores';
import './style.min.less';

const {Provider} = MobxReact;
const {BrowserRouter: Router} = ReactRouterDOM;
// import {BrowserRouter as Router, withRouter} from "react-router-dom";


class App extends React.Component {
    render() {
        return (
            <div className="app-module">
                <Provider {...stores}>
                    <Router basename={__BASENAME__}>{Routes()}</Router>
                </Provider>
            </div>
        )
    }
}

export default App;