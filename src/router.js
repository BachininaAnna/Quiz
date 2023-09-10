import {Form} from "./components/form.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {

                }
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form();
                }
            },
        ]
    }
    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash
        })

        if (!newRoute) {
            window.location.hash = '#/';
            return
        }

        document.getElementById('title').innerText = newRoute.title;
        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        document.getElementById('styles').setAttribute('href', newRoute.styles);
        newRoute.load();

    }
}