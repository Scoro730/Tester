document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const deckSelect = document.getElementById("deck-select");

    const quizContainer = document.getElementById("quiz-container");
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const resultsElement = document.getElementById("results");
    const nextButton = document.getElementById("next-button");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    startButton.addEventListener("click", function() {
        const selectedDeck = deckSelect.value;
        if (selectedDeck) {
            fetchDeck(selectedDeck);
        } else {
            alert("Por favor, selecciona un mazo antes de iniciar.");
        }
    });

    function fetchDeck(deckName) {
        fetch(`data/decks/${deckName}.json`)
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                startQuiz();
            })
            .catch(error => console.error("Error al cargar el mazo:", error));
    }

    function startQuiz() {
        document.getElementById("deck-selection").style.display = "none";
        quizContainer.style.display = "block";
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
        nextButton.style.display = "none";

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', function() {
                if (index === currentQuestion.answer) {
                    score++;
                }
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            });
            optionsElement.appendChild(button);
        });
    }

    function showResults() {
        quizContainer.style.display = "none";
        resultsElement.style.display = "block";
        resultsElement.textContent = `Puntaje: ${score} / ${questions.length} (${(score / questions.length) * 100}%)`;
    }
});
