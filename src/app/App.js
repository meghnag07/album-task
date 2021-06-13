import * as React from "react";
import { withRouter } from "react-router-dom";
import '../assets/styles/index.css';
import 'antd/dist/antd.css';
import { AppRoutes } from "./AppRoutes";

import { Provider } from 'react-redux'
import store from '../redux/store'

function App(props) {
  const currentRoute = props.history.location.pathname;

  return (
    <>
      <Provider store={store}>
        <div className="App">
          <AppRoutes />
        </div> 
      </Provider>
    </>
  );
}

export default withRouter(App);
