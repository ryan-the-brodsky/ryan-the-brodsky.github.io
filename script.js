document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for sticky nav height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Interactive Elements ---

    // 1. Word Scramble Game
    const wordScrambleGame = () => {
        const words = [
            { word: "EDUCATION", fact: "Ryan spent 7 years as a college English teacher!" },
            { word: "TECHNOLOGY", fact: "Ryan is an Implementation Manager for an EdTech company." },
            { word: "STRATEGY", fact: "Strategic thinking is one of Ryan's top skills." },
            { word: "JAVASCRIPT", fact: "This site is built with vanilla JavaScript!" },
            { word: "COMMUNICATE", fact: "Ryan excels at bridging technical and non-technical communication." }
        ];
        let currentWordData;
        const scrambledWordEl = document.getElementById('scrambled-word');
        const guessInputEl = document.getElementById('scramble-guess');
        const submitButtonEl = document.getElementById('scramble-submit');
        const feedbackEl = document.getElementById('scramble-feedback');
        const funFactEl = document.getElementById('scramble-fun-fact');

        function scrambleWord(word) {
            let arr = word.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr.join('');
        }

        function loadNewWord() {
            currentWordData = words[Math.floor(Math.random() * words.length)];
            let scrambled = scrambleWord(currentWordData.word);
            // Ensure scrambled word is different from original
            while (scrambled === currentWordData.word && currentWordData.word.length > 1) {
                scrambled = scrambleWord(currentWordData.word);
            }
            scrambledWordEl.textContent = scrambled;
            feedbackEl.textContent = '';
            funFactEl.textContent = '';
            funFactEl.style.display = 'none';
            guessInputEl.value = '';
        }

        if (scrambledWordEl && guessInputEl && submitButtonEl && feedbackEl && funFactEl) {
            submitButtonEl.addEventListener('click', () => {
                const guess = guessInputEl.value.toUpperCase();
                if (guess === currentWordData.word) {
                    feedbackEl.textContent = 'Correct!';
                    feedbackEl.style.color = 'green';
                    funFactEl.textContent = currentWordData.fact;
                    funFactEl.style.display = 'block';
                    setTimeout(loadNewWord, 3000); // Load new word after 3 seconds
                } else {
                    feedbackEl.textContent = 'Try again!';
                    feedbackEl.style.color = 'red';
                }
            });
            loadNewWord(); // Initial load
        }
    };

    // 2. "Build the Perfect Project" Drag-and-Drop Game
    const projectBuilderGame = () => {
        const draggableElements = document.querySelectorAll('.draggable-element');
        const dropzone = document.getElementById('project-dropzone');
        const feedbackEl = document.getElementById('project-builder-feedback');
        const requiredElements = ['el-req', 'el-collab', 'el-tech', 'el-strat'];
        let droppedElements = [];

        if (!dropzone) return;

        draggableElements.forEach(elem => {
            elem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                e.target.style.opacity = '0.5';
            });
            elem.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            dropzone.style.backgroundColor = '#e8f5e9'; // Highlight dropzone
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.backgroundColor = '#fffaf0'; // Revert background
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.backgroundColor = '#fffaf0';
            const id = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);

            if (draggable && !droppedElements.includes(id)) {
                const clone = draggable.cloneNode(true);
                clone.style.cursor = 'default';
                clone.removeAttribute('draggable');
                dropzone.appendChild(clone);
                if (dropzone.textContent === "Drop elements here") {
                    dropzone.textContent = ""; // Clear initial text
                    // Re-add children if any were removed by textContent change
                    droppedElements.forEach(existingId => dropzone.appendChild(document.getElementById(existingId).cloneNode(true)));
                }
                dropzone.appendChild(clone);


                droppedElements.push(id);
                draggable.style.display = 'none'; // Hide original from pool

                if (droppedElements.length === requiredElements.length) {
                    let allRequiredDropped = requiredElements.every(reqId => droppedElements.includes(reqId));
                    if (allRequiredDropped) {
                        feedbackEl.textContent = "Project assembled! That's how Ryan builds impactful solutions!";
                        feedbackEl.style.color = 'green';
                    } else {
                        // This case should ideally not be hit if logic is correct
                        feedbackEl.textContent = "Almost there, but something's missing for the perfect project!";
                        feedbackEl.style.color = 'orange';
                    }
                } else {
                     feedbackEl.textContent = `${draggable.textContent} added! What's next?`;
                     feedbackEl.style.color = 'blue';
                }
            }
        });

        // Initial state
        if (dropzone.children.length === 0) {
            dropzone.textContent = "Drop elements here";
        }
        feedbackEl.textContent = "Drag the components to the dropzone.";
    };

    // 3. Weightlifting Challenge
    const weightliftingChallenge = () => {
        const liftButton = document.getElementById('lift-button');
        const liftFeedback = document.getElementById('lift-feedback');
        const liftBoast = document.getElementById('lift-boast');
        const liftMeterFill = document.getElementById('lift-meter-fill');
        const targetWeight = 425;
        let currentLift = 0;
        const liftPowerPerClick = 15; // How much each click adds
        const decayRate = 2; // How much weight "decays" per interval if not clicking
        const decayInterval = 100; // Milliseconds
        let decayTimer;

        if (!liftButton || !liftFeedback || !liftBoast || !liftMeterFill) return;

        function updateLiftDisplay() {
            liftFeedback.textContent = `Current Lift: ${Math.round(currentLift)} lbs`;
            const percentage = Math.max(0, (currentLift / targetWeight) * 100);
            liftMeterFill.style.width = `${percentage}%`;

            if (currentLift >= targetWeight) {
                liftFeedback.textContent = `Current Lift: ${targetWeight} lbs!`;
                liftBoast.style.display = 'block';
                liftButton.disabled = true;
                liftButton.textContent = "Max Lift!";
                if (decayTimer) clearInterval(decayTimer);
            } else if (currentLift < 0) {
                currentLift = 0; // Prevent negative lift
                 liftFeedback.textContent = `Current Lift: 0 lbs`;
                 liftMeterFill.style.width = `0%`;
            }
        }

        function startDecay() {
            if (decayTimer) clearInterval(decayTimer); // Clear existing timer
            decayTimer = setInterval(() => {
                if (currentLift > 0 && !liftButton.disabled) {
                    currentLift -= decayRate;
                    if (currentLift < 0) currentLift = 0;
                    updateLiftDisplay();
                } else if (currentLift <= 0) {
                     clearInterval(decayTimer);
                     decayTimer = null;
                }
            }, decayInterval);
        }

        liftButton.addEventListener('click', () => {
            if (currentLift >= targetWeight) return;

            currentLift += liftPowerPerClick;
            currentLift = Math.min(currentLift, targetWeight); // Cap at targetWeight
            updateLiftDisplay();

            // Restart decay timer on click to simulate continuous effort needed
            if (!decayTimer && currentLift > 0 && currentLift < targetWeight) {
                 startDecay();
            }
            // If already decaying, the interval will continue.
            // Optionally, reset the interval timer on each click for more aggressive decay effect:
            // startDecay(); 
        });
        
        // Initial display
        updateLiftDisplay();
    };

    // 4. Logan's Museum Adventures (Tamagotchi-like)
    const loganMuseumExplorer = () => {
        const moodEl = document.getElementById('logan-mood');
        const hungerEl = document.getElementById('logan-hunger');
        const learningEl = document.getElementById('logan-learning');
        const activityFeedbackEl = document.getElementById('logan-activity-feedback');
        const loganSpriteIconEl = document.getElementById('logan-sprite-icon'); // Changed ID
        const actionButtons = document.querySelectorAll('#logan-actions button');

        if (!moodEl || !hungerEl || !learningEl || !activityFeedbackEl || !loganSpriteIconEl) return; // Changed variable

        let logan = {
            mood: 10, // 0-10 (10 is happiest)
            hunger: 0, // 0-10 (0 is not hungry, 10 is very hungry)
            learning: 5, // 0-10 (10 is super learned)
            maxMood: 10,
            maxHunger: 10,
            maxLearning: 10,
            // Define icon classes instead of image paths
            baseIconClass: "fas fa-child", // Toddler icon
            sadIconClass: "fas fa-sad-cry", // Sad icon
            // Other states might just use the base icon and rely on text
        };

        const moodStates = ["Grumpy", "Okay", "Happy", "Joyful"];
        const hungerStates = ["Full", "Peckish", "Hungry", "Starving"];
        const learningStates = ["Bored", "Curious", "Engaged", "Genius!"];

        function updateStatusDisplay() {
            moodEl.textContent = moodStates[Math.floor(logan.mood / (logan.maxMood / moodStates.length + 0.1))];
            hungerEl.textContent = hungerStates[Math.floor(logan.hunger / (logan.maxHunger / hungerStates.length + 0.1))];
            learningEl.textContent = learningStates[Math.floor(logan.learning / (logan.maxLearning / learningStates.length + 0.1))];

            // Update icon based on state
            let currentIconClass = logan.baseIconClass;
            if (logan.mood < 3) { // If mood is very low, show sad icon
                currentIconClass = logan.sadIconClass;
            }
            // Ensure the base classes for Font Awesome are always present
            loganSpriteIconEl.className = `fas ${currentIconClass.replace('fas ', '')} logan-icon-base-style`; // Add a base style class if needed for CSS

            // Add a little bounce effect (can be done with CSS animations too)
            loganSpriteIconEl.style.transform = 'scale(1.1)';
            setTimeout(() => { loganSpriteIconEl.style.transform = 'scale(1)'; }, 150);
        }

        function performAction(action) {
            let feedbackText = "";
            // Natural decay/increase
            logan.hunger = Math.min(logan.maxHunger, logan.hunger + 1);
            logan.mood = Math.max(0, logan.mood - 0.5);


            switch (action) {
                case 'feed':
                    logan.hunger = Math.max(0, logan.hunger - 4);
                    logan.mood = Math.min(logan.maxMood, logan.mood + 1);
                    feedbackText = "Logan enjoyed a yummy snack!";
                    break;
                case 'play-science':
                    logan.mood = Math.min(logan.maxMood, logan.mood + 3);
                    logan.learning = Math.min(logan.maxLearning, logan.learning + 2);
                    logan.hunger = Math.min(logan.maxHunger, logan.hunger + 1);
                    feedbackText = "Wow, dinosaurs at the Science Museum! Logan is thrilled and learned something new.";
                    break;
                case 'play-art':
                    logan.mood = Math.min(logan.maxMood, logan.mood + 2);
                    logan.learning = Math.min(logan.maxLearning, logan.learning + 1);
                    logan.hunger = Math.min(logan.maxHunger, logan.hunger + 1);
                    feedbackText = "The colors at the Art Museum were so pretty! Logan feels inspired.";
                    break;
                case 'learn':
                    if (logan.mood > 3 && logan.hunger < 7) {
                        logan.learning = Math.min(logan.maxLearning, logan.learning + 3);
                        logan.mood = Math.min(logan.maxMood, logan.mood + 1);
                        feedbackText = "Logan learned a new word! So smart!";
                    } else {
                        feedbackText = "Logan is too grumpy or hungry to learn right now.";
                        logan.mood = Math.max(0, logan.mood -1);
                    }
                    break;
            }
            activityFeedbackEl.textContent = feedbackText;
            updateStatusDisplay();
        }

        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                performAction(button.dataset.action);
            });
        });

        // Initial state
        updateStatusDisplay();
        activityFeedbackEl.textContent = "What should Logan do today?";

        // Simulate time passing (optional, can be complex)
        // setInterval(() => {
        //     logan.hunger = Math.min(logan.maxHunger, logan.hunger + 0.5);
        //     logan.mood = Math.max(0, logan.mood - 0.2);
        //     if (logan.hunger > 7 || logan.mood < 3) {
        //         activityFeedbackEl.textContent = logan.hunger > 7 ? "Logan is getting hungry..." : "Logan seems a bit bored...";
        //     }
        //     updateStatusDisplay();
        // }, 15000); // Every 15 seconds
    };


    // Initialize all games/interactive elements
    wordScrambleGame();
    projectBuilderGame();
    weightliftingChallenge();
    loganMuseumExplorer();
});
