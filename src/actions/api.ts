import axios from 'axios';
import config from '../config';
import apiRequest from '../types/apiRequest';
import { run } from 'node:test';

/**
 * Run a request
 * 
 * @param request 
 * @param id 
 * @returns 
 */
async function runRequest(request: apiRequest, id?: string): Promise<any> {
    console.log(`${request.method} ${request.path}`);
    var result = {} as any;
    try {
        switch (request.method) {
            case 'GET':

                result = await axios.get(`${config.api_endpoint}${request.path}`);

                break;
            case 'POST':

                result = await axios.post(`${config.api_endpoint}${request.path}`, request.fields);

                break;
            case 'PUT':

                result = await axios.put(`${config.api_endpoint}${request.path}`, request.fields);

                break;
            case 'DELETE':

                result = await axios.delete(`${config.api_endpoint}${request.path}${id}`);

                break;
            default:
                break;
        }
        return result.data;
    } catch (e) {
        throw e;
    }
}


export default runRequest;