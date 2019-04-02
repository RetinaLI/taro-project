import ajaxProvider from '../providers/ajax';

class PassportService {

  checkLogin() {

  }

  async registUserByWeiXinUserInfo(wxUserInfo) {
    let result = await ajaxProvider.request('registUserByWeiXinUserInfo', wxUserInfo);
    return result;
  }

  async login(params) {
    let result = await ajaxProvider.request('login', params);
    return result;
  }

  saveCookie() {

  }

  getCookie() {

  }
}

let passportService = new PassportService();

export default passportService;
