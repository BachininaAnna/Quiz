export class UrlManager {
    constructor() {
        const name = sessionStorage.getItem('name');
        const lastName = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');

        if (!name || !lastName || !email) {
            location.href = '#/';
        }
    }
}