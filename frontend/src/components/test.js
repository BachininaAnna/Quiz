import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Test {
    constructor() {
        this.progressBarElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.passButtonElement = null;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.test = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];

        this.testId = sessionStorage.getItem('testId');
        this.init();
    }
    async init() {
        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.test = result;
                    this.startQuiz();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    startQuiz() {
        document.getElementById('pre-title').innerText = this.test.name;
        this.questionTitleElement = document.getElementById('test-question-title');
        this.optionsElement = document.getElementById('options');
        this.progressBarElement = document.getElementById('progress-bar');

        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');

        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');

        this.passButtonElement = document.getElementById('pass');
        this.passButtonElement.onclick = this.move.bind(this, 'pass');

        this.prepareProgressBar();
        this.showQuestion();
        const timerElement = document.getElementById('timer');
        let seconds = 599;
        this.interval = setInterval(function () {
            seconds--;
            timerElement.innerText = seconds;

            if (seconds === 0) {
                clearInterval(this.interval);
                this.complete();
            }
        }.bind(this), 1000);
    }
    prepareProgressBar() {
        for (let i = 0; i < this.test.questions.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'test-progress-bar-item' + (i === 0 ? ' active' : '');

            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'test-progress-bar-item-circle';

            const itemTextElement = document.createElement('div');
            itemTextElement.className = 'test-progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
        }
    }

    showQuestion() {
        const activeQuestion = this.test.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML = '<span>Вопрос  ' + this.currentQuestionIndex
            + ':</span> ' + activeQuestion.question;

        this.optionsElement.innerHTML = '';
        const that = this;
        const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);

        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked');
            } else {

            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        })


        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled');
            this.passButtonElement.classList.add('disabled');
            document.getElementById('img-arrow').setAttribute('src', '/images/grey-mini-arrow.svg');
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
            document.getElementById('pass').classList.remove('disabled');
            document.getElementById('img-arrow').setAttribute('src', '/images/blue-mini-arrow.svg');
        }


        if (this.currentQuestionIndex === this.test.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
        } else {
            this.nextButtonElement.innerText = 'Далее';
        }
        if (this.currentQuestionIndex > 1) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled');
        this.passButtonElement.classList.add('disabled');
        document.getElementById('img-arrow').setAttribute('src', '/images/grey-mini-arrow.svg');
    }

    move(action) {
        const activeQuestion = this.test.questions[this.currentQuestionIndex - 1];
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return element.checked;
        });

        let chosenAnswerId = null;
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value);
        }
        const existingResult = this.userResult.find(item => {
            return item.questionId === activeQuestion.id
        });

        if (existingResult) {
            existingResult.chosenAnswerId = chosenAnswerId;
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId
            })
        }

        if (action === 'pass' || action === 'next') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if (this.currentQuestionIndex > this.test.questions.length) {
            clearInterval(this.interval);
            this.complete();
            return;
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1;
            item.classList.remove('complete');
            item.classList.remove('active');

            if (currentItemIndex === this.currentQuestionIndex) {
                item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
                item.classList.add('complete');
            }
        });

        this.showQuestion();
    }

    async complete() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/pass', 'POST',
                {
                    userId: userInfo.userId,
                    results: this.userResult
                });
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                 location.href = '#/result';
            }
        } catch (error) {
            console.log(error);
        }
    }
}

