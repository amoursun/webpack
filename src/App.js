import React from 'react'
import Routes from './routes/index';

import {Provider} from 'mobx-react';
import stores from './stores/index';
// import { BrowserRouter } from 'react-router-dom';
import './style.min.less';

class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="app">
                <Provider {...stores}>
                    <Router basename={__BASENAME__}>{Routes()}</Router>
                </Provider>
            </div>
        )
    }
}
export default App;