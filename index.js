// Theme handling
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
} else {
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    document.body.setAttribute('data-theme', systemTheme);
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab') === 'text' ? 'textInput' : 'fileInput';
        document.getElementById(tabId).classList.add('active');
    });
});

// Constants
const MAX_INPUT_LENGTH = 5000;
const MIN_INPUT_LENGTH = 10;

// Elements
const inputText = document.getElementById('inputText');
const resultDiv = document.getElementById('result');
const summarizeBtn = document.getElementById('summarizeButton');
const clearBtn = document.getElementById('summarizeButtonClear');

// Character counter
inputText.addEventListener('input', () => {
    const remaining = MAX_INPUT_LENGTH - inputText.value.length;
    document.getElementById('charCount').textContent = `${inputText.value.length}/${MAX_INPUT_LENGTH} characters`;
});

function updateCharCount() {
    const text = inputText.value;
    document.getElementById('charCount').textContent = `${text.length}/${MAX_INPUT_LENGTH} characters`;
}

summarizeBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    
    // Input validation
    if (text.length < MIN_INPUT_LENGTH) {
        resultDiv.innerHTML = `<div class="error">Please enter at least ${MIN_INPUT_LENGTH} characters.</div>`;
        return;
    }
    if (text.length > MAX_INPUT_LENGTH) {
        resultDiv.innerHTML = `<div class="error">Text exceeds maximum length of ${MAX_INPUT_LENGTH} characters.</div>`;
        return;
    }

    // Show loading state
    summarizeBtn.disabled = true;
    resultDiv.innerHTML = '<div class="loading">Generating summary...</div>';

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
            },
            body: JSON.stringify({ inputs: text }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const summary = data[0].summary_text;
        
        resultDiv.innerHTML = `
            <div class="summary-container">
                <strong>Summary:</strong> 
                <p>${summary}</p>
                <button onclick="copyToClipboard(this)" class="copy-btn">Copy Summary</button>
            </div>`;
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `
            <div class="error">
                ${error.message === 'Failed to fetch' 
                    ? 'Network error. Please check your internet connection.'
                    : 'An error occurred while generating the summary. Please try again.'}
            </div>`;
    } finally {
        summarizeBtn.disabled = false;
    }
});

clearBtn.addEventListener('click', () => {
    inputText.value = '';
    resultDiv.innerHTML = '';
    document.getElementById('charCount').textContent = `0/${MAX_INPUT_LENGTH} characters`;
});

// Copy to clipboard functionality
function copyToClipboard(button) {
    const summaryText = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(summaryText)
        .then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = originalText, 2000);
        })
        .catch(() => {
            button.textContent = 'Failed to copy';
            setTimeout(() => button.textContent = 'Copy Summary', 2000);
        });
}
