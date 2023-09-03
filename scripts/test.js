/*(function () {*/
const Test = {
    questionTitleElement: null,
    optionsElement: null,
    quiz: null,
    currentQuestionIndex: 1,
    init() {
        checkUserData();
        const url = new URL(location.href);
        const testId = url.searchParams.get('id');
        if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
                this.startQuiz();
            } else {
                location.href = 'index.html';
            }
        } else {
            location.href = 'index.html';
        }
    },
    startQuiz() {
        console.log(this.quiz);
        this.questionTitleElement = document.getElementById('title');
        this.optionsElement = document.getElementById('options');


        this.showQuestion();
    },
    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML = '<span>Вопрос  ' + this.currentQuestionIndex
            + ':</span> ' + activeQuestion.question;

        this.optionsElement.innerHTML = '';
        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        })
    }

}

Test.init();
/*
})();*/