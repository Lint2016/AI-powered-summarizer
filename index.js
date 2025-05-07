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
const TranslateBtn = document.getElementById('summarizeButtonTranslate');

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

//this is for the translate button
const API_KEY = "AIzaSyBeKVVeR9f3uNvSMOi5XfqEfPPQ3FqRWyU"; // your google api key,
const translateBtn = document.getElementById("translateBtn");
// Reuse the existing inputText variable declared earlier

TranslateBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();

  if (!text) {
   // alert("Please enter text to translate.");
    swal.fire({
        title: "Error",
        text: "Please enter text to translate.",
        icon: "error"
    })
    return;
  }else{
    swal.fire({
        title: "Success",
        text: "Your text has been successfully translated to French",
        icon: "success"
    })
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: [text],          // Google expects an array for 'q'
          target: "fr",       // French
          format: "text"      // (optional) plain text
        })
      }
    );

    const data = await response.json();

    if (data && data.data && data.data.translations) {
      inputText.value = data.data.translations[0].translatedText;
    } else {
      console.error("Unexpected API response:", data);
      alert("Something went wrong with the translation.");
    }

  } catch (error) {
    console.error("Translation error:", error);
    alert("Error translating the text.");
  }
});

// Text-to-speech functionality
const synth = window.speechSynthesis;
let currentChunk = 0;
let textChunks = [];
let isPaused = false;
let isSpeaking = false;

// Split text into sentences for better chunking
function splitIntoSentences(text) {
    // Split by common sentence endings followed by space
    return text.match(/[^.!?]+[.!?]+/g) || [text];
}

// Process text into manageable chunks
function prepareTextChunks(text) {
    const sentences = splitIntoSentences(text);
    const chunks = [];
    let currentChunk = '';
    
    sentences.forEach(sentence => {
        if ((currentChunk + sentence).length < 200) {
            currentChunk += sentence;
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
        }
    });
    
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

// Update the play/pause button state
function updatePlayButtonState(isPlaying) {
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', 'Pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', 'Play');
    }
}

function speakNextChunk() {
    if (currentChunk >= textChunks.length) {
        // All chunks spoken
        isSpeaking = false;
        isPaused = false;
        currentChunk = 0;
        updatePlayButtonState(false);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(textChunks[currentChunk]);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        updatePlayButtonState(true);
    };

    utterance.onend = () => {
        currentChunk++;
        if (!isPaused) {
            speakNextChunk();
        } else {
            updatePlayButtonState(false);
        }
    };

    utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        isSpeaking = false;
        isPaused = false;
        updatePlayButtonState(false);
        swal.fire({
            title: "Error",
            text: "An error occurred while reading the text.",
            icon: "error"
        });
    };

    synth.speak(utterance);
}

function startSpeaking(text) {
    if (synth.speaking) {
        synth.cancel();
    }
    
    textChunks = prepareTextChunks(text);
    currentChunk = 0;
    isSpeaking = true;
    isPaused = false;
    
    speakNextChunk();
}

// Check for browser support
if (!('speechSynthesis' in window)) {
    console.error('Your browser does not support the Web Speech API');
    swal.fire({
        title: "Error",
        text: "Your browser does not support text-to-speech functionality. Please try a modern browser like Chrome or Firefox.",
        icon: "error"
    });
}

// Buttons elements
const playBtn = document.getElementById('frenchAudio');
const pauseBtn = document.getElementById('pauseButton');
const stopBtn = document.getElementById('stopButton');

// Update the play button click handler
playBtn.addEventListener('click', () => {
    const text = inputText.value.trim();
    
    if (!text) {
        swal.fire({
            title: "Error",
            text: "No text to speak. Please enter and translate text first.",
            icon: "error"
        });
        return;
    }
    
    if (isPaused) {
        // Resume from pause
        synth.resume();
        isPaused = false;
        updatePlayButtonState(true);
    } else if (isSpeaking) {
        // Pause if currently speaking
        synth.pause();
        isPaused = true;
        updatePlayButtonState(false);
    } else {
        // Start new speech
        startSpeaking(text);
    }
});

// Stop functionality
stopBtn.addEventListener('click', () => {
    if (isSpeaking || isPaused) {
        synth.cancel();
        isSpeaking = false;
        isPaused = false;
        currentChunk = 0;
        updatePlayButtonState(false);
    }
});

// Clean up when page is unloaded
window.addEventListener('beforeunload', () => {
    if (synth.speaking) {
        synth.cancel();
    }
});