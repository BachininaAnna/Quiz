export class Answers {

    constructor() {
        this.quiz = null;
        this.correctAnswers = null;
        this.id = null;
        this.name = null;
        this.lastName = null;
        this.email = null;
        this.personInfo = null;
        this.answersFromServer = [];
        this.userResults = [];

        const url = new URL(location.href);
        this.id = sessionStorage.getItem('id');
        this.name = sessionStorage.getItem('name');
        this.lastName = sessionStorage.getItem('lastName');
        this.email = sessionStorage.getItem('email');

        if (this.id) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + this.id, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
                this.getResult();
            } else {
                location.href = 'index.html';
            }
        } else {
            location.href = 'index.html';
        }
    }
    getResult() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.id, false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            this.answersFromServer = JSON.parse(xhr.response);
            this.userResults = JSON.parse(sessionStorage.getItem('userResult'))
            this.showRightWrongAnswers();
        }
    }

    showRightWrongAnswers() {
        document.getElementById('answers-pre-title-span').innerText = this.quiz.name;
        this.correctAnswers = document.getElementById('correct-answers');
        this.correctAnswers.innerHTML = '';

        this.personInfo = document.getElementById('answers-person-info-span');
        this.personInfo.innerHTML = '';
        this.personInfo.innerText = `${this.name} ${this.lastName}, ${this.email}`;

        const completedQuestions = this.quiz.questions;

        for (let i = 0; i < completedQuestions.length; i++) {
            let isCorrectAnswer = false;
            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'correct-answer';

            const answerTitle = document.createElement('div');
            answerTitle.className = 'correct-answer-title';
            answerTitle.classList.add('common-title');

            const answerTitleSpan = document.createElement('span');
            answerTitleSpan.innerText = 'Вопрос ' + (i + 1) + ': ';
            answerTitle.appendChild(answerTitleSpan);

            const answerTitleText = document.createElement('p');
            answerTitleText.innerText = completedQuestions[i].question;
            answerTitle.appendChild(answerTitleText);

            correctAnswer.appendChild(answerTitle);

            if (this.userResults[i] && this.answersFromServer[i] === this.userResults[i].chosenAnswerId) {
                isCorrectAnswer = true;
            } else {
                isCorrectAnswer = false;
            }


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

                if (isCorrectAnswer) {
                    if (answer.id === this.answersFromServer[i]) {
                        answerCircle.classList.add('correct-circle');
                        answerText.classList.add('correct-text');
                    }
                } else {
                    if (this.userResults[i].chosenAnswerId && answer.id === this.userResults[i].chosenAnswerId) {
                        answerCircle.classList.add('wrong-circle');
                        answerText.classList.add('wrong-text');
                    }
                }


            })
            this.correctAnswers.appendChild(correctAnswer);
        }
    }
}
