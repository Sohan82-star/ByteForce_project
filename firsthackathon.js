let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progress = (currentStep - 1) / (totalSteps - 1) * 100;
    document.getElementById('progress').style.width = `${progress}%`; // Fix string interpolation
}

function startAssessment() {
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('assessment-form').classList.remove('hidden');
    updateProgress();
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById(`step${step}`).classList.remove('hidden'); // Fix string interpolation
}

function nextStep(currentStepNum) {
    const currentStepElement = document.getElementById(`step${currentStepNum}`); // Fix string interpolation
    const inputs = currentStepElement.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.required && !input.value) {
            isValid = false;
            input.classList.add('error');
        }
    });

    if (!isValid) {
        showError('Please fill in all required fields');
        return;
    }

    currentStep = currentStepNum + 1;
    showStep(currentStep);
    updateProgress();
}

function prevStep(currentStepNum) {
    currentStep = currentStepNum - 1;
    showStep(currentStep);
    updateProgress();
}

function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        document.querySelector('.form-card').prepend(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.opacity = '1';
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
    }, 3000);
}

document.getElementById('career-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedInterests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(checkbox => checkbox.value);

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        education: {
            level: document.getElementById('education-level').value,
            field: document.getElementById('field-of-study').value
        },
        interests: selectedInterests,
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim())
    };

    try {
        document.querySelector('.submit-btn').disabled = true;
        document.querySelector('.submit-btn').textContent = 'Processing...';

        const response = await fetch('http://localhost:8000/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Failed to get recommendations');
        }

        const data = await response.json();
        
        localStorage.setItem('careerRecommendations', JSON.stringify(data.recommendations));
        window.location.href = '/results.html';
    } catch (error) {
        showError('An error occurred. Please try again.');
        console.error('Error:', error);
    } finally {
        document.querySelector('.submit-btn').disabled = false;
        document.querySelector('.submit-btn').textContent = 'Get Recommendations';
    }
});

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
    });
});
