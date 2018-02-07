// window.Promise = window.Promise || require('es6-promise');
import { render } from 'react-dom';
import React from 'react';
import dashboardStore from './stores/DashboardStore';
import {Provider} from 'mobx-react';

import DashBoard from './containers/DashBoard';

let store = {
  dashboardStore
};
render(
  <Provider {...store}>
    <DashBoard/>
  </Provider>,
  document.getElementById('stage')
); 