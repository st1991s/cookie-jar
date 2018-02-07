window.Promise = window.Promise || require('es6-promise');
import { render } from 'react-dom';
import React from 'react';
import {Router,Route,IndexRoute} from 'react-router';
import dashboardStore from './stores/DashboardStore';
import {Provider} from 'mobx-react';
import {hashHistory} from 'react-router';
import NotFound from './containers/NotFound';

import layout from './common/layout';
//如果需要动态根据路由打包js，请用这种方式——注意：不要为了偷懒把这个方法简化，变成传路径，经验告诉你，不生效！！！！
const DashBoard = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('./containers/DashBoard'));
  }, 'dashboard') ; 
};
//如果不需要动态加载用下面的，但注意route得相应改成component={}
//import DashBoard from './containers/DashBoard'

let store = {
  dashboardStore
};
render(
  <Provider {...store}>
    <Router history={hashHistory}>
      <Route path="/" component={layout} >
        <IndexRoute getComponent={DashBoard} />
        <Route path="/dashboard" getComponent={DashBoard}>
        </Route>
        <Route path="*" component={NotFound}>

        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('stage')
); 