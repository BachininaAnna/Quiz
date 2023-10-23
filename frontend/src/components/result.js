import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result  {
    constructor() {
        this.testId = sessionStorage.getItem('testId');
        this.init();
    }
    async init(){
        if (this.testId) {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/';
            }
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}

