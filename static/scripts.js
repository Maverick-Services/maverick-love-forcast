
    let currentStep = 1;
    const totalSteps = 6;

    function updateProgress() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.className = `dot ${index < currentStep ? 'completed' : ''} ${index === currentStep - 1 ? 'active' : ''}`;
        });
    }

    function showQuestion(step) {
        document.querySelectorAll('.question').forEach(q => {
            q.classList.remove('active');
            if (parseInt(q.dataset.step) === step) {
                q.classList.add('active');
            }
        });

        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (step === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    document.getElementById('nextBtn').addEventListener('click', () => {
        const currentTextarea = document.querySelector(`.question[data-step="${currentStep}"] textarea`);
        if (currentTextarea.value.trim() === '') {
            currentTextarea.classList.add('error');
            return;
        }

        if (currentStep < totalSteps) {
            currentStep++;
            updateProgress();
            showQuestion(currentStep);
        }
    });

    document.getElementById('predictionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const responses = [
            formData.get('response1'),
            formData.get('response2'),
            formData.get('response3'),
            formData.get('response4'),
            formData.get('response5'),
            formData.get('response6')
        ];
    
        console.log("Responses to be sent:", responses); // Check if responses are collected correctly
    
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ responses }),
            });
    
            const result = await response.json();
            console.log("Result from backend:", result); // Log the result received from the backend
            showResult(result.prediction);
        } catch (error) {
            console.error('Error:', error);
            // Fallback for demo
            showResult(Math.random() > 0.5 ? 'Love' : 'Not Love');
        }
    });
    

    function showResult(prediction) {
        const questionCard = document.getElementById('questionCard');
        const resultCard = document.getElementById('resultCard');
        const resultTitle = document.querySelector('.result-title');
        const resultMessage = document.querySelector('.result-message');
        const resultIcon = document.querySelector('.result-svg');

        if (prediction === 'Love') {
            resultTitle.textContent = 'True Love Awaits ✨';
            resultMessage.textContent = 'The stars have aligned, and your hearts beat as one. Your destiny is written in the celestial dance of love.';
            resultIcon.style.color = '#ec4899';
            document.querySelector('.icon-glow').style.backgroundColor = '#ec4899';
        } else {
            resultTitle.textContent = 'Your Heart\'s Journey Continues';
            resultMessage.textContent = 'Like the phases of the moon, love\'s path is ever-changing. Your true destiny still awaits among the stars.';
            resultIcon.style.color = '#60a5fa';
            document.querySelector('.icon-glow').style.backgroundColor = '#60a5fa';
        }

        questionCard.style.display = 'none';
        resultCard.style.display = 'block';
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
        currentStep = 1;
        document.getElementById('predictionForm').reset();
        updateProgress();
        showQuestion(currentStep);
        document.getElementById('questionCard').style.display = 'block';
        document.getElementById('resultCard').style.display = 'none';
    });

    // Generate floating stars
    const starsContainer = document.querySelector('.stars-container');
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `%% Math.random() * 100 %% %`;
        star.style.top = `%% Math.random() * 100 %% %`;
        star.style.animationDelay = `%% Math.random() * 5 %% s`;
        star.style.animationDuration = `%% 5 + Math.random() * 10 %% s`
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('d', i % 2 === 0 
            ? 'M12 3a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 12 3zm0 15a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 12 18zM3 12a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 3 12zm15 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 18 12z'
            : 'M6 12l6-6 6 6-6 6-6-6z');
        
        svg.appendChild(path);
        star.appendChild(svg);
        starsContainer.appendChild(star);
    }

