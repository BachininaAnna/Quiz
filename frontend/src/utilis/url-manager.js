export class UrlManager {

    static getQueryParams(){
        const qs = document.location.hash.split('+').join(' ');

        let params = {},
            tokens,
            re = /[?&]([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
    static checkUserData(params){
        /*if (!params.name || !params.lastName || !params.email) {
            location.href = '#/';
        }*/
    }
   /* constructor() {
        const name = sessionStorage.getItem('name');
        const lastName = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');

        /!*if (!name || !lastName || !email) {
            location.href = '#/';
        }*!/
    }*/
}