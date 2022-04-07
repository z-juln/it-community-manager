import { Response, Zone } from '@/model';
import { GET, POST, PUT } from '@/utils/request'

const API_BASE_URL = '/api';

export const getZoneList = ({
  id,
  name,
}: Partial<Zone>): Promise<Response<Zone[]>> => {
  let url = `${API_BASE_URL}/zone/list?`;
  if (id) {
    url += `id=${id}&`;
  }
  if (name) {
    url += `name=${name}&`;
  }
  return GET(url);
};

export const addZone = (name: string): Promise<Response<Zone | null>> =>
  POST(`${API_BASE_URL}/zone/add`, { name });
