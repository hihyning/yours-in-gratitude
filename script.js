document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const verificationScreen = document.getElementById('verificationScreen');
    const lettersScreen = document.getElementById('lettersScreen');
    const letterScreen = document.getElementById('letterScreen');
    const nameInput = document.getElementById('nameInput');
    const submitNameBtn = document.getElementById('submitNameBtn');
    const errorMessage = document.getElementById('errorMessage');
    const questionContainer = document.getElementById('questionContainer');
    const envelopesContainer = document.getElementById('envelopesContainer');
    const letterContent = document.getElementById('letterContent');

    // Event Listeners
    submitNameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        verifyName();
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyName();
        }
    });

    // Name Verification Functions
    function verifyName() {
        const inputName = nameInput.value.trim();
        const userData = findUserByName(inputName);

        errorMessage.textContent = '';

        if (userData) {
            displayVerificationQuestions(userData);
        } else {
            errorMessage.textContent = 'Name not found. Please try again.';
            questionContainer.innerHTML = '';
        }
    }

    function findUserByName(inputName) {
        const normalizedInput = inputName.toLowerCase();
        for (let key in lettersData) {
            if (key.toLowerCase() === normalizedInput) {
                return lettersData[key];
            }
        }
        return null;
    }

    // Question Display and Verification
    function displayVerificationQuestions(userData) {
        questionContainer.innerHTML = '';
        
        const questions = [...userData.verificationQuestions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <p class="question-text">${question.question}</p>
                <div class="multiple-choice" id="question-${index}">
                    ${question.options.map((option, i) => `
                        <button class="choice-btn" 
                                data-correct="${option === question.correctAnswer}"
                                data-question="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
            questionContainer.appendChild(questionDiv);
        });

        // Add click handlers to choice buttons
        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', (e) => handleAnswerSelection(e, userData));
        });
    }

    function handleAnswerSelection(event, userData) {
        const button = event.target;
        const questionId = button.dataset.question;
        
        // Clear previous selection in this question group
        document.querySelectorAll(`#question-${questionId} .choice-btn`)
            .forEach(btn => btn.classList.remove('selected'));
        
        // Select clicked button
        button.classList.add('selected');
        
        // Check answers
        checkAllAnswers(userData);
    }

    function checkAllAnswers(userData) {
        const selectedAnswers = document.querySelectorAll('.choice-btn.selected');
        
        if (selectedAnswers.length === 3) {
            const allCorrect = Array.from(selectedAnswers)
                .every(button => button.dataset.correct === "true");
            
            if (allCorrect) {
                displayLetters(userData);
            } else {
                errorMessage.textContent = 'Some answers were incorrect. Please try again.';
                setTimeout(() => {
                    displayVerificationQuestions(userData);
                }, 1500);
            }
        }
    }

    // Letter Display Functions
    function displayLetters(userData) {
        // Switch screens
        verificationScreen.classList.remove('active');
        lettersScreen.classList.add('active');

        // Clear and prepare envelope container
        envelopesContainer.innerHTML = '';

        // Create envelopes
        userData.letters.forEach((letter, index) => {
            const envelope = document.createElement('div');
            envelope.className = 'envelope glowing';
            envelope.innerHTML = '<span class="envelope-text">Click to open</span>';
            
            envelope.addEventListener('click', () => openLetter(letter));
            envelopesContainer.appendChild(envelope);
        });
    }

    function openLetter(letter) {
        // Switch screens
        lettersScreen.classList.remove('active');
        letterScreen.classList.add('active');

        // Set letter content and background
        letterContent.innerHTML = `
            <h3>Your Letter</h3>
            <div class="letter-text">${letter.content}</div>
        `;
        letterContent.style.background = letter.gradient;

        // Trigger envelope opening animation
        setTimeout(() => {
            document.querySelector('.envelope-body').classList.add('envelope-open');
        }, 100);
    }
});