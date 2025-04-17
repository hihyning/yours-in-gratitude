window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    container.classList.add('active');

    const emoji = document.getElementById('toggle-emoji');
const close = document.getElementById('toggle-close');
const slideText = document.getElementById('slide-text');

emoji.addEventListener('click', () => {
    emoji.style.display = 'none';
    close.style.display = 'block';
    slideText.style.display = 'block';
});

close.addEventListener('click', () => {
    emoji.style.display = 'block';
    close.style.display = 'none';
    slideText.style.display = 'none';
});
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    let timeout;

    function updateGradient(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        const gradient = `radial-gradient(
            circle at ${x}% ${y}%,
            var(--gradient-primary) 0%,
            var(--gradient-secondary) 45%,
            var(--gradient-accent) 75%,
            var(--gradient-dark) 100%
        )`;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            body.style.background = gradient;
        }, 5); // Small delay for performance
    }

    document.addEventListener('mousemove', updateGradient);

    // Initialize gradient at center on load
    body.style.background = `radial-gradient(
        circle at 50% 50%,
        var(--gradient-primary) 0%,
        var(--gradient-secondary) 45%,
        var(--gradient-accent) 75%,
        var(--gradient-dark) 100%
    )`;
});
window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    const card = document.querySelector('.card');
    
    // Show container first
    container.style.display = 'block';
    
    // Small delay before starting fade in
    setTimeout(() => {
        container.classList.add('active');
        card.classList.add('active');
    }, 100);
});
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const verificationScreen = document.getElementById('verificationScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const lettersScreen = document.getElementById('lettersScreen');
    const letterScreen = document.getElementById('letterScreen');
    const nameInput = document.getElementById('nameInput');
    const submitNameBtn = document.getElementById('submitNameBtn');
    const errorMessage = document.getElementById('errorMessage');
    const questionContainer = document.getElementById('questionContainer');


    // Screen transition function
    function switchScreen(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.style.opacity = '0';
            setTimeout(() => {
                fromScreen.classList.remove('active');
                toScreen.classList.add('active');
                setTimeout(() => {
                    toScreen.style.opacity = '1';
                }, 50);
            }, 800);
        } else {
            toScreen.classList.add('active');
            setTimeout(() => {
                toScreen.style.opacity = '1';
            }, 50);
        }
    }

    // Name verification
    function findUserByName(inputName) {
        const normalizedInput = inputName.trim().toLowerCase();
        for (let key in lettersData) {
            if (key.toLowerCase() === normalizedInput) {
                return lettersData[key];
            }
        }
        return null;
    }

    function verifyName() {
        const inputName = nameInput.value.trim();
        const userData = findUserByName(inputName);
        errorMessage.textContent = '';

        if (userData) {
            displayVerificationQuestions(userData);
        } else {
            errorMessage.textContent = 'name not found. please try again.';
            questionContainer.innerHTML = '';
        }
    }

    // Question handling
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

        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', (e) => handleAnswerSelection(e, userData));
        });
    }

    function handleAnswerSelection(event, userData) {
        const button = event.target;
        const questionId = button.dataset.question;
        
        document.querySelectorAll(`#question-${questionId} .choice-btn`)
            .forEach(btn => btn.classList.remove('selected'));
        
        button.classList.add('selected');
        checkAllAnswers(userData);
    }

    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        return new Promise((resolve) => {
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    async function checkAllAnswers(userData) {
        const selectedAnswers = document.querySelectorAll('.choice-btn.selected');
        
        if (selectedAnswers.length === 3) {
            const allCorrect = Array.from(selectedAnswers)
                .every(button => button.dataset.correct === "true");
            
                if (allCorrect) {
                    // Get elements
                    const container = document.querySelector('.container');
                    const loadingScreen = document.getElementById('loadingScreen');
                    const loadingMessage = document.querySelector('.loading-message h2');
                        // Define the array of random loading phrases
                    const loadingPhrases = [
            "making sure every word is just right...",
            "wrapping up your personal letter...",
            "curating the perfect message for you...",
            "almost there... putting the finishing touches",
            "hold on tight, crafting your message..."
        ];
                        // Function to get a random loading phrase
                    function getRandomLoadingPhrase() {
                    const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
                    return loadingPhrases[randomIndex];
                }
                    // First clear loading message since we'll type into it
                    loadingMessage.innerHTML = '';
                    
                    // Fade out container
                    verificationScreen.style.opacity = '0';
                    container.style.opacity = '0';
                    
                    // Wait for fade out
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    // Hide container completely
                    container.style.display = 'none';
                    verificationScreen.style.display = 'none';
                    
                    // Show loading screen with display flex first
                    loadingScreen.style.display = 'flex';
                    // Force reflow
                    loadingScreen.offsetHeight;
                    // Then add active class for opacity transition
                    loadingScreen.classList.add('active');
                    
                    // Small delay to ensure loading screen is visible
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                    // Set a random loading message from the array
        const randomLoadingMessage = getRandomLoadingPhrase();

        // Type out random loading message
        await typeWriter(loadingMessage, randomLoadingMessage);
                    
                    // Hold message
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Hide loading screen with fade
                    loadingScreen.style.opacity = '0';
                    await new Promise(resolve => setTimeout(resolve, 500));
                    loadingScreen.style.display = 'none';
                    loadingScreen.classList.remove('active');
                  
// Reset container state
container.style.opacity = '0';
container.style.display = 'block';

// Small delay to ensure DOM updates
await new Promise(resolve => setTimeout(resolve, 50));

const card = document.querySelector('.card');
card.style.display = 'none';  // or card.style.display = 'none'; if you want to hide it

// Show letters screen and fade in container
lettersScreen.classList.add('active');
container.style.opacity = '1';

// Initialize letters content
displayLetters(userData);
                
            } else {
                errorMessage.textContent = 'Some answers were incorrect. Please try again.';
                setTimeout(() => {
                    displayVerificationQuestions(userData);
                }, 1500);
            }
        }
    }
    async function displayLetters(userData) {
    lettersScreen.innerHTML = `
    <div class="card"></div>
            <div class="envelope-container">
                <div class="envelope initial-envelope">
                    <div class="envelope-front"></div>
                    <div class="envelope-flap"></div>
                    <div class="letter-content">
                        <div class="letter-text">${userData.letters[0].content}</div>
                    </div>
                    <span class="envelope-text">Click to open</span>
                </div>
            </div>
        </div>
    `;

    const envelope = lettersScreen.querySelector('.envelope');
    const container = lettersScreen.querySelector('.envelope-container');
    const envelopeText = lettersScreen.querySelector('.envelope-text');
    let isAnimating = false;
    let isOpen = false;

    envelope.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        if (!isOpen) {
            // Opening animation
            envelope.classList.add('opening');
            container.classList.add('shift-down');
            envelopeText.textContent = 'click to close';
        } else {
            // Closing animation
            envelope.classList.remove('opening');
            container.classList.remove('shift-down');
            envelopeText.textContent = 'click to open';
        }
        if (userData.name === "letters") {
    envelope.setAttribute('data-name', 'letters');
}

        // Toggle state
        isOpen = !isOpen;

        // Reset animation flag after animations complete
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    });

     // Fetch the content from JSON (for this example, we directly use the object)
     const letterContent = letterData.letters[0].content;

     // Convert the \n to <br> for line breaks
     const formattedContent = letterContent.replace(/\n/g, '<br>');

     // Inject the formatted content into the <pre> element
     document.getElementById('letter-content').innerHTML = formattedContent;
}

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
});