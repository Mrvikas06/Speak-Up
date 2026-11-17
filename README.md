# SpeakUp

SpeakUp is a browser-based speech practice and pronunciation learning application designed for children. The application leverages the Web Speech API (SpeechRecognition and SpeechSynthesis) alongside the Web Audio API to deliver real-time speech evaluation, audio pronunciation playback, and interactive feedback without requiring external backend servers.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage Instructions](#usage-instructions)
- [Keyboard Navigation](#keyboard-navigation)
- [Speech Evaluation Algorithm](#speech-evaluation-algorithm)
- [Browser Compatibility](#browser-compatibility)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

SpeakUp provides structured speech practice across three core categories: Vowels, Common Words, and Everyday Phrases. Users listen to accurate pronunciations and practice speaking into their microphone. The app evaluates spoken input using a multi-strategy matching pipeline combining phonetic alias mapping, normalized token matching, and Levenshtein edit distance calculations.

## Key Features

- Real-Time Speech Recognition: Evaluates verbal pronunciations through standard browser SpeechRecognition interfaces.
- Clear Audio Playback: Uses the browser SpeechSynthesis engine with pitch and rate adjustments tuned for early language learners.
- Web Audio Synthesizer: Generates dynamic audio cues (success chimes, try-again indicators, button clicks, and completion chords) via native oscillators without external audio asset downloads.
- Inline Microphone Diagnostic: Dedicated on-page diagnostic utility allows users to verify hardware connectivity and browser permissions prior to beginning practice sessions.
- Multi-Strategy Matching: Resilient matching engine accounts for single-letter phonetic transcriptions (e.g., vowels), contractions, phrase aliases, and close acoustic approximations.
- Full Keyboard Accessibility: Keyboard shortcuts enable navigation and practice control without mouse dependency.
- Zero External Runtime Dependencies: Self-contained static web application capable of running locally or deployed to any static host.
- Comprehensive Test Coverage: Unit tests validate category datasets, Levenshtein distance metrics, and speech matching algorithms using the Node.js native test runner.

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript (ES2022)
- Audio and Speech APIs: Web Speech API (SpeechRecognition, SpeechSynthesis), Web Audio API (AudioContext, OscillatorNode, GainNode)
- Testing Framework: Node.js native test runner (`node:test`, `node:assert/strict`)
- Tooling: Node.js (syntax verification and test execution)

## Architecture Overview

The application follows a modular client-side architecture:

1. View Layer (`index.html`, `css/style.css`): Semantic HTML structure managing the Home, Practice, Result Overlay, and Completion screens with responsive layouts and CSS transitions.
2. Data Layer (`js/data.js`): Declarative data store defining practice sets, emojis, child-friendly hints, phonetic pronunciations, and accepted aliases.
3. Audio Synthesis Layer (`js/audio.js`): Pure Web Audio API tone generator creating feedback sounds and managing user sound preferences.
4. Speech Processing Layer (`js/speech.js`): Interfaces with browser speech synthesis and recognition engines, implementing text normalization and Levenshtein distance evaluation.
5. Application Controller (`js/app.js`): Coordinates application state, DOM event listeners, navigation routing, particle visual effects, and microphone diagnostic routines.

## Project Structure

```
Speakup/
├── css/
│   └── style.css            # Responsive layout and application stylesheets
├── js/
│   ├── app.js               # Main application controller and UI state management
│   ├── audio.js             # Web Audio API sound effects synthesizer
│   ├── data.js              # Practice categories, words, and phonetic aliases
│   └── speech.js            # Speech recognition, speech synthesis, and match algorithms
├── tests/
│   ├── data.test.js         # Dataset validation and structure tests
│   ├── levenshtein.test.js  # String metric algorithm unit tests
│   └── matching.test.js     # Speech recognition matching and alias tests
├── favicon.svg              # Scalable vector application icon
├── index.html               # Main application entry point
├── manifest.json            # Web App Manifest for progressive web capabilities
├── package.json             # Project metadata, test scripts, and repository details
└── README.md                # Project documentation
```

## Installation and Setup

### Prerequisites

- A modern web browser supporting the Web Speech API (Google Chrome, Microsoft Edge, or Apple Safari).
- Node.js (version 18 or newer) is optional, required only for running automated test suites.

### Running Locally

Option 1: Direct Browser Launch
Open `index.html` directly in your browser:
- Double-click `index.html` in your file explorer, or
- Drag and drop `index.html` into an open browser window.

Option 2: Local HTTP Server
```bash
# Using Python 3 built-in server
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Navigate to `http://localhost:8000` in your web browser.

## Usage Instructions

1. Verify Audio Input:
   - On the Home screen, click "Test Microphone First".
   - Speak into the microphone when prompted. The diagnostic box confirms input detection and reports the recognized phrase.

2. Select a Practice Category:
   - Vowels: 5 vowel items (A, E, I, O, U) with phonetic sound mapping.
   - Words: 10 everyday vocabulary items (Cat, Dog, Ball, Sun, Tree, Fish, Bird, Star, Moon, Rain).
   - Phrases: 6 conversational phrases (Hello, Thank you, Good morning, I love you, Please, Sorry).

3. Practice Flow:
   - Click "Listen" to hear the word pronounced aloud.
   - Click "Speak" to activate the microphone, then pronounce the word clearly.
   - The status bar indicates listening progress and captures spoken input.
   - The result dialog displays whether the pronunciation matched, providing options to continue or retry.
   - Upon completing all items, the performance screen displays the total score, percentage, and summary.

4. Audio Controls:
   - Use the "Sound: ON/OFF" button in the upper-right corner to toggle sound effects.

## Keyboard Navigation

SpeakUp supports keyboard operation:

- Spacebar: Toggle microphone recording on the practice page.
- L: Replay pronunciation audio for the active word.
- Enter / Right Arrow: Advance to the next word when the result dialog is open.
- R: Retry the current word from the result dialog.
- Escape: Return to the home screen or dismiss the dialog.
- Tab / Enter: Navigate and activate category selection cards.

## Speech Evaluation Algorithm

The recognition evaluation pipeline in `js/speech.js` processes input through four sequential checks:

1. Text Normalization: Strips non-alphanumeric characters, converts input to lowercase, and condenses whitespace.
2. Exact Matching: Compares the normalized phrase against the target word and preconfigured phonetic aliases (e.g., "ay" for vowel "A", "thanks" for "Thank you").
3. Token and Substring Inclusion: Evaluates individual spoken tokens to recognize target words spoken with hesitation or filler words (e.g., "the cat" or "cat please").
4. Levenshtein Edit Distance: Calculates edit distance for words of three or more characters, allowing an edit distance tolerance of 1 to accommodate slight pronunciation variations.

## Browser Compatibility

| Browser | Speech Recognition | Speech Synthesis | Web Audio API | Overall Support |
| :--- | :--- | :--- | :--- | :--- |
| Google Chrome | Yes | Yes | Yes | Fully Supported |
| Microsoft Edge | Yes | Yes | Yes | Fully Supported |
| Apple Safari | Yes (iOS 14.5+, macOS 11+) | Yes | Yes | Fully Supported |
| Mozilla Firefox | Partial (flag-dependent) | Yes | Yes | Limited Speech Input |
| Opera | Yes | Yes | Yes | Fully Supported |

Note: A working microphone and active internet connection are required by browser speech recognition engines for transcription processing.

## Testing

SpeakUp includes unit tests executed using the Node.js native test runner.

Run the test suite:
```bash
npm test
```

Run JavaScript syntax validation:
```bash
npm run lint
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/improvement-name`
3. Implement your changes following established modular structure.
4. Run tests and linting: `npm test && npm run lint`
5. Commit your changes: `git commit -m "Add descriptive message"`
6. Push to your branch and submit a pull request.

## License

This project is licensed under the MIT License.
