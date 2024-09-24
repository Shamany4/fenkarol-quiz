document.addEventListener('DOMContentLoaded', (qualifiedName, value) => {
  const fenkarolQuiz = document.querySelector('#fenkarol-quiz');

  const changeView = () => {
    const quizPages = fenkarolQuiz.querySelectorAll('.view[data-quiz-id]');
    const changeViewButtons = fenkarolQuiz.querySelectorAll('.btn[data-action="change-view"]');
    const viewsBlock = fenkarolQuiz.querySelector('.views');

    changeViewButtons.forEach((button, buttonIndex) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        window.scrollTo(0, 0);

        let dataView = button.getAttribute('data-view');

        const getNumberView = (dataView) => {
          return Number(dataView);
        }

        const clearAllAnswers = () => {
          quizPages.forEach((quizPage) => {
            let quizNumberPage = Number(quizPage.getAttribute('data-quiz-id'));
            localStorage.removeItem(`quiz_id-${quizNumberPage}`);
          });
          window.location.reload();
        }

        viewsBlock.classList.remove(`v${getNumberView(dataView) - 1}`);
        viewsBlock.classList.add(`v${getNumberView(dataView)}`);

        if (button.getAttribute('data-finish') === 'true') clearAllAnswers();
      });
    });
  }

  const changeOptionButtons = (input, quizNumberPage, rightAnswer) => {
    const quizPage = fenkarolQuiz.querySelector(`.view[data-quiz-id="${quizNumberPage}"]`);
    const buttonNextPage = quizPage.querySelector('.btn[data-action="change-view"]');
    const buttonSendAnswer = quizPage.querySelector('.btn[data-action="send-answers"]');
    const inputControls = quizPage.querySelectorAll('.input-control > input');
    const hiddenBlock = quizPage.querySelector('.quiz-layout__hidden');
    const contentBlock = quizPage.querySelector('.quiz-layout__content');
    const libraryBlock = quizPage.querySelector('.library');
    const explanationAnswerBlock = quizPage.querySelector('.explanation-answer');

    if (quizNumberPage === 1 || quizNumberPage === 6) {
      if (buttonSendAnswer) {
        buttonSendAnswer.removeAttribute('disabled');
        buttonSendAnswer.addEventListener('click', (e) => {
          e.preventDefault();

          buttonSendAnswer.style.display = 'none';
          if (quizNumberPage === 1) {
            hiddenBlock.style.display = 'flex';
            contentBlock.style.display = 'none';
          }

          if (buttonNextPage) {
            buttonNextPage.removeAttribute('disabled');
            buttonNextPage.style.display = 'flex';
          }

          if (quizNumberPage === 6) {
            explanationAnswerBlock.classList.add('visible');
            libraryBlock.classList.add('visible');
            quizPage.querySelectorAll('.input-control > input').forEach((input) => {
              input.setAttribute('disabled', 'true');
              input.classList.add('check-result');
              console.log(input)
            })
          }
        });
      }

      return;
    }

    if (buttonNextPage) buttonNextPage.removeAttribute('disabled');

    inputControls.forEach((inputControl) => {
      if (input.getAttribute('name') === `quiz-${quizNumberPage}_answers`) inputControl.setAttribute('disabled', 'true');
    });

    const setResultAnswer = () => {
      let result = explanationAnswerBlock.querySelector('.explanation-answer__result');

      if (rightAnswer === 'true') {
        result.innerText = 'Ваш ответ верный!';
        result.classList.add('color-turquoise');
      }

      if (rightAnswer === 'false') {
        result.innerText = 'Ваш ответ неверный!';
        result.classList.add('color-red');
      }
    }


    setResultAnswer();
    explanationAnswerBlock.classList.add('visible');
    libraryBlock.classList.add('visible');
  }

  const saveAnswers = () => {
    const quizPages = fenkarolQuiz.querySelectorAll('.view[data-quiz-id]');
    quizPages.forEach((quizPage) => {
      let quizNumberPage = Number(quizPage.getAttribute('data-quiz-id'));
      let inputControls = quizPage.querySelectorAll('.input-control > input');
      let tempAnswer = {
        quiz_id: null,
        results: []
      }

      inputControls.forEach((input) => {
        input.addEventListener('change', (e) => {
          if (e.target.checked) {
            tempAnswer.quiz_id = quizNumberPage;
            tempAnswer.results.push(e.target.value);
            localStorage.setItem(`quiz_id-${tempAnswer.quiz_id}`, tempAnswer.results);
          }

          if (!e.target.checked) {
            tempAnswer.results.forEach((answer, answerIndex) => {
              if (answer === e.target.value) tempAnswer.results.splice(answerIndex, 1);
              localStorage.setItem(`quiz_id-${tempAnswer.quiz_id}`, tempAnswer.results);
              if (localStorage.getItem(`quiz_id-${tempAnswer.quiz_id}`).length === 0) localStorage.removeItem(`quiz_id-${tempAnswer.quiz_id}`);
            });
          }

          changeOptionButtons(input, quizNumberPage, input.getAttribute('data-right-answer'));
        });
      });
    });
  }

  changeView();
  saveAnswers();
});