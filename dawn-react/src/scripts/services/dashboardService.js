import { get } from '../utils/request';

export async function fetchData(data, options) {
  return await get('/dashboard/list.json', data, options);
}