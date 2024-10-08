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

    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    handleJSONData(data);
                } catch (error) {
                    console.error("Error al procesar el archivo JSON:", error);
                    alert("El archivo seleccionado no es un JSON válido.");
                }
            };
            reader.readAsText(file);
        }
    });

    function handleJSONData(data) {
        if (data && data.questions) {
            questions = shuffleArray(data.questions); // Baraja las preguntas
            startQuiz();
        } else {
            alert("El archivo JSON no tiene el formato correcto.");
        }
    }

    function fetchDeck(deckName) {
        fetch(`data/decks/${deckName}.json`)
            .then(response => response.json())
            .then(data => {
                questions = shuffleArray(data.questions); // Baraja las preguntas
                startQuiz();
            })
            .catch(error => console.error("Error al cargar el mazo:", error));
    }

    function startQuiz() {
        document.getElementById("deck-selection").style.display = "none";
        quizContainer.style.display = "block";
        currentQuestionIndex = 0; // Asegúrate de que el índice de preguntas se reinicie
        score = 0; // Asegúrate de reiniciar el puntaje
        showQuestion(); // Comienza a mostrar las preguntas
    }

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = '';
        nextButton.style.display = "none";

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button'); // Asegúrate de que tenga la clase correcta
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

    // Función para barajar el array de preguntas
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
