import React, { Component } from 'react';
import './index.less';
class Layout extends Component {
  render() {
    return (
      <div className='appContainer'>
        <div className="enterprise-console-topbar" role="menubar">
        </div>
        <div className='console-layout'>
          <div className='console-layout-side-menu'>
          </div>
          <div className="console-layout-main">
            <div className='console-layout-main-content'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;