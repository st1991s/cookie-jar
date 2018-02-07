import React, { Component } from 'react';
import { Dialog, Button } from '@alife/next';
import {inject,observer} from 'mobx-react';
//国际化依赖
import {FormattedMessage} from 'react-intl';

@inject('dashboardStore')
@observer
class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      visible:false
    };
  }
  onOpen = () => {
    this.setState({
      visible: true
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }
  componentDidMount() {
    this.props.dashboardStore.fetchData();
  }
  render() {
    let {dashboardStore} = this.props;
    let {configMessage} = dashboardStore;
    let {name,dream} = configMessage;
    return (
      <div>
        <FormattedMessage
          id="hello"
          values={{name: <b>{name}</b>}}/>
        <Button style={{marginLeft:'50px'}} onClick={this.onOpen} type="primary">Open dialog</Button>
        <Dialog visible={this.state.visible}
          onOk={this.onClose}
          onCancel={this.onClose}
          onClose={this.onClose} title="Alibaba.com">
          <h3>{name || ''}</h3>
          <ul>
            <li>{dream || ''}</li>
          </ul>
        </Dialog>
      </div>
    );
  }
}

export default Dashboard;