import { observable, action, computed } from 'mobx';
import * as dashboardService from '../services/dashboardService'; 
class DashboardStore {
  @observable configMessage = {};
  @observable isLoading = false;
  constructor() {
    
  }
  @action async fetchData(){
    this.isLoading = true;
    try {
      let response = await dashboardService.fetchData();
      this.isLoading = false;
      this.configMessage = response.data;
    } catch (e) {
      this.isLoading = false;
    }
  }
  @computed get globalConfig(){
    return this.configMessage.name + this.configMessage.dream;
  }
}
let dashboardStore = new DashboardStore();
export default dashboardStore;