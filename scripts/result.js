
const Result = {
    init() {
        console.log(location.href);
        const url = new URL(location.href);
        const id = url.searchParams.get('id');
        const name = url.searchParams.get('name');
        const lastName = url.searchParams.get('lastName');
        const email = url.searchParams.get('email');

        document.getElementById('result-score').innerText = url.searchParams.get('score') +
            '/' + url.searchParams.get('total');

        location.href = 'answers.html?id=' + id + '&name=' + name + '&lastName=' + lastName + '&email=' + email;
    }
}
Result.init();