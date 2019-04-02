import ajaxProvider from '../providers/ajax';

class MessageService {
  async getList(params) {
    let result = await ajaxProvider.request('getReportList', params);
    return result;
  }

  async getReportTypes () {
    let result = await ajaxProvider.request('getReportTypes');
    return result;
  }

  async getOneReport (params) {
    let result = await ajaxProvider.request('getOneReport', params);
    return result.list;
  }
}

export default new MessageService();
