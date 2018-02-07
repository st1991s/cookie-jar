import React, { Component } from 'react';
import './index.less';
import DashBoardComponent from '../../components/Dashboard/index';

//国际化支持，如果不需要请删掉
import {addLocaleData,IntlProvider} from 'react-intl';
let locale_data = window.locale || {
  hello:'hello,{name}'
}; //这里可以抽离成一个大json
addLocaleData([...locale_data]);

class DashBoard extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div> 
        <IntlProvider 
          locale={'en'} 
          messages={locale_data}>
            <DashBoardComponent />
        </IntlProvider>
      </div>
    );
  }
}

export default DashBoard;