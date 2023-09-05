/*(function () {*/
const Answers = {
    quiz: null,
    userResult: [],

    init() {
        /*checkUserData();*/
        const url = new URL(location.href);
        const testId = url.searchParams.get('id');
        const name = url.searchParams.get('name');
        const lastName = url.searchParams.get('lastName');
        const email = url.searchParams.get('email');

        if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                    console.log(this.quiz);
                } catch (e) {
                    /* location.href = 'index.html';*/
                    console.log('**********************щшибка catch');
                }
                this.showAnswers();
            } else {
                /*location.href = 'index.html';*/
                console.log('****************1 else');
            }
        } else {
            /*location.href = 'index.html';*/
        }
    },
    showAnswers() {
        document.getElementById('answers-pre-title-span').innerText = this.quiz.name;

        const completedQuestions = this.quiz.questions;

        for (let i = 0; i < completedQuestions.length; i++) {
            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'correct-answer';

            const answerTitle = document.createElement('div');
            answerTitle.className = 'correct-answer-title';
            answerTitle.className = 'common-title';
            answerTitle.innerHtml = '<span>Вопрос  ' + (i + 1)
                + ':</span> ' + completedQuestions[i].question;

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
            })
        }
    },
    showRightWrongAnswers() {

    }
}

Answers.init();
/*
})();*/