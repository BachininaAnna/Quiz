/*(function () {*/
const Test = {
    questionTitleElement: null,
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
        this.questionTitleElement = document.getElementById('title');
         console.log(this.quiz);

        this.showQuestion();
    },
    showQuestion() {
           const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
           this.questionTitleElement.innerHTML = '<span>Вопрос  ' +  this.currentQuestionIndex
               + ':</span> ' + activeQuestion.question;
    }

}

Test.init();
/*
})();*/