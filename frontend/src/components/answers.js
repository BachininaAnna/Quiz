import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.correctAnswers = null;
        this.fullName = null;
        this.email = null;
        this.testId = null;
        this.personInfo = null;
        this.test = null;

        this.fullName = Auth.getUserInfo().fullName;
        this.email = localStorage.getItem('email');
        this.testId = sessionStorage.getItem('testId');

        this.init();
    }
    async init() {
        if (this.testId) {
            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/';
            }
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.test = result.test;
                    this.showRightWrongAnswers();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    showRightWrongAnswers() {
        document.getElementById('answers-pre-title-span').innerText = this.test.name;
        this.correctAnswers = document.getElementById('correct-answers');
        this.correctAnswers.innerHTML = '';

        this.personInfo = document.getElementById('answers-person-info-span');
        this.personInfo.innerHTML = '';
        this.personInfo.innerText = `${this.fullName}, ${this.email}`;

        const completedQuestions = this.test.questions;
        for (let i = 0; i < completedQuestions.length; i++) {
            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'correct-answer';

            const answerTitle = document.createElement('div');
            answerTitle.className = 'correct-answer-title';
            answerTitle.classList.add('common-title');

            const answerTitleSpan = document.createElement('span');
            answerTitleSpan.innerText = 'Вопрос ' + (i + 1) + ': ';
            answerTitle.appendChild(answerTitleSpan);/*+++*/

            const answerTitleText = document.createElement('p');
            answerTitleText.innerText = completedQuestions[i].question;
            answerTitle.appendChild(answerTitleText);

            correctAnswer.appendChild(answerTitle);

            completedQuestions[i].answers.forEach(answer => {
                const answerOption = document.createElement('div');
                answerOption.className = 'correct-answer-option';

                const answerCircle = document.createElement('div');
                answerCircle.className = 'correct-answer-option-circle';

                const answerText = document.createElement('div');
                answerText.className = 'correct-answer-option-text';
                answerText.innerText = answer.answer;

                answerOption.appendChild(answerCircle);
                answerOption.appendChild(answerText);
                correctAnswer.appendChild(answerOption);

                if (answer.correct === true) {
                    answerCircle.classList.add('correct-circle');
                    answerText.classList.add('correct-text');
                } else if (answer.correct === false) {
                    answerCircle.classList.add('wrong-circle');
                    answerText.classList.add('wrong-text');
                }
            })
            this.correctAnswers.appendChild(correctAnswer);
        }
    }
}
