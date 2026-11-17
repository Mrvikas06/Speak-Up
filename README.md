# SpeakUp

SpeakUp is an interactive, browser-based speech practice and pronunciation learning application designed for children. The platform utilizes the Web Speech API (SpeechRecognition and SpeechSynthesis) alongside the Web Audio API to deliver real-time speech evaluation, progressive phonics training, live waveform visualization, and gamified sticker rewards without requiring backend infrastructure.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Curriculum Structure](#curriculum-structure)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage Instructions](#usage-instructions)
- [Keyboard Navigation](#keyboard-navigation)
- [Speech Evaluation and Rating Algorithm](#speech-evaluation-and-rating-algorithm)
- [Accessibility and Themes](#accessibility-and-themes)
- [Browser Compatibility](#browser-compatibility)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

SpeakUp delivers a comprehensive language learning curriculum organized into three progressive tiers: Beginner, Intermediate, and Advanced. Children can listen to natural pronunciations at standard or slowed speech rates, examine phonetic sound breakdowns, click individual syllables, and speak into the microphone to receive real-time pronunciation feedback, star ratings, and collectible badges.

## Key Features

- Comprehensive Curriculum: Nine specialized practice modules covering foundational vowels, the full A-Z alphabet, numbers, colors, everyday vocabulary, animals, action verbs, conversational phrases, and tongue twisters.
- Dual-Speed Pronunciation Playback: Offers both standard listening (0.72x speed) and slowed articulation ("Turtle Mode" at 0.48x speed) to help young learners discern individual phonemes and consonant clusters.
- Interactive Syllable and Sentence Guidance: Displays clickable syllable pills that pronounce each syllable independently, alongside contextual example sentences.
- Real-Time Live Audio Waveform Visualizer: Uses an AnalyserNode from the Web Audio API to capture microphone stream data and dynamically scale visualizer bars in response to vocal amplitude.
- Pronunciation Accuracy Scoring: Computes confidence metrics to award a 1-to-3 star rating for each speech attempt, differentiating exact matches, phonetic aliases, and partial pronunciations.
- Unlockable Sticker Book and Reward System: Children earn persistent badges stored in localStorage as they complete categories and achieve high scores.
- Visual Themes and Dyslexia Support: Includes Pastel, High Contrast, and Dyslexia-Friendly visual modes with customized typography and spacing.
- Zero External Runtime Dependencies: Functions entirely in modern web browsers as a self-contained static application with offline capabilities.
- Automated Test Suite: Complete test coverage validating curriculum integrity, algorithm metrics, and speech matching via the Node.js native test runner.

## Curriculum Structure

The learning content is divided into three difficulty tiers:

1. Beginner:
   - Vowels: 5 foundational vowel sounds (A, E, I, O, U) with phonetic sound mapping.
   - Alphabet: 26 letters (A to Z) with letter names, phonics sounds, and representative words.
   - Numbers: Counting digits and words from One to Ten.
   - Colors: 10 primary and secondary color words.

2. Intermediate:
   - Words: 10 essential everyday nouns (Cat, Dog, Ball, Sun, Tree, Fish, Bird, Star, Moon, Rain).
   - Animals: 10 friendly animal names with distinct phonetic patterns.
   - Actions: 10 common verbs and physical movement words (Jump, Run, Sing, Dance, Read, Eat, Drink, Sleep, Smile, Play).

3. Advanced:
   - Phrases: 6 conversational polite expressions (Hello, Thank you, Good morning, I love you, Please, Sorry).
   - Twisters: 5 alliteration and speech clarity challenges designed to refine articulation.

## Technology Stack

- Frontend: HTML5, CSS3 (Custom Properties, Flexbox, CSS Grid), JavaScript (ES2022)
- Audio and Speech APIs: Web Speech API (SpeechRecognition, SpeechSynthesis), Web Audio API (AudioContext, MediaStreamSource, AnalyserNode, OscillatorNode, GainNode)
- Storage: Browser localStorage for sticker badges and theme preferences
- Testing Framework: Node.js native test runner (`node:test`, `node:assert/strict`)
- Tooling: Node.js (syntax verification and test execution)

## Architecture Overview

The application follows a modular separation of concerns:

1. View Layer (`index.html`, `css/style.css`): Manages the Home view, practice cards, feedback overlay, complete view, and sticker modal with responsive layouts and theme styles.
2. Data Layer (`js/data.js`): Declarative store containing curriculum definitions, category metadata, phonetic spellings, syllable arrays, and example sentences.
3. Audio Synthesis Layer (`js/audio.js`): Pure Web Audio API tone generator and real-time AnalyserNode visualizer.
4. Speech Processing Layer (`js/speech.js`): Handles SpeechSynthesis utterance creation, SpeechRecognition events, string normalization, Levenshtein distance calculations, and star evaluation.
5. Application Controller (`js/app.js`): Orchestrates application state, category filtering, user interactions, sticker collection, and lifecycle cleanup.

## Project Structure

```
Speakup/
├── css/
│   └── style.css            # Application styles, themes, and animations
├── js/
│   ├── app.js               # Application state, UI controller, and event handlers
│   ├── audio.js             # Web Audio API tone synthesizer and live visualizer
│   ├── data.js              # Curriculum data sets and category metadata
│   └── speech.js            # Speech evaluation, pronunciation, and accuracy metrics
├── tests/
│   ├── data.test.js         # Dataset integrity and structure tests
│   ├── levenshtein.test.js  # String edit distance algorithm tests
│   └── matching.test.js     # Speech recognition and accuracy evaluator tests
├── favicon.svg              # Application icon
├── index.html               # Main entry point
├── manifest.json            # Web App Manifest
├── package.json             # Scripts and metadata
└── README.md                # Project documentation
```

## Installation and Setup

### Prerequisites

- A modern web browser supporting the Web Speech API (Google Chrome, Microsoft Edge, or Apple Safari).
- Node.js (version 18 or newer) is optional, required only for running unit tests.

### Running Locally

Option 1: Direct File Launch
Open `index.html` directly in your browser:
- Double-click `index.html` in your file manager, or
- Drag and drop `index.html` into any browser window.

Option 2: Local HTTP Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js npx
npx serve .
```
Navigate to `http://localhost:8000` in your web browser.

## Usage Instructions

1. Test Microphone Input:
   - On the Home view, click "Test Microphone First".
   - Speak into your microphone. The diagnostic card confirms audio detection without modal popups.

2. Select a Topic and Filter:
   - Use the filter tabs (All Topics, Beginner, Intermediate, Advanced) to narrow down categories.
   - Click any category card to begin practicing.

3. Practice Workflow:
   - Click "Listen" to hear the standard pronunciation.
   - Click "Slow" (Turtle Mode) to hear the word articulated slowly.
   - Tap individual syllable tags to hear parts of multi-syllable words.
   - Click the example sentence box to hear the word in context.
   - Click "Speak" and articulate the target word. The live audio waveform reacts to your voice volume.
   - View your pronunciation accuracy (1 to 3 stars) and continue to the next item.

4. Rewards and Sticker Book:
   - Click "Stickers" in the top navigation bar to open the Sticker Book.
   - Badges are awarded automatically upon completing practice sets and achieving high scores.

## Keyboard Navigation

- Spacebar: Start or stop speech recording.
- L: Play pronunciation at normal speed.
- Enter / Right Arrow: Advance to the next item from the result dialog.
- R: Retry the current word from the result dialog.
- Escape: Close modal dialogs or return to the home screen.
- Tab / Enter: Navigate and select category cards and filter buttons.

## Speech Evaluation and Rating Algorithm

The evaluation pipeline in `js/speech.js` evaluates spoken input through sequential analysis:

1. Text Normalization: Strips non-alphanumeric symbols, converts to lowercase, and condenses whitespace.
2. Exact Matching: Compares the normalized phrase against target words and accepted phonetic aliases (e.g., vowel letter names and contractions). Awards 3 Stars (100% score).
3. Token and Substring Inclusion: Inspects individual words in the transcript to identify target words spoken alongside filler words (e.g., "the cat" or "cat please"). Awards 2 to 3 Stars (85-95% score).
4. Levenshtein Edit Distance: Allows an edit distance tolerance of 1 for words of 3 or more characters to accept minor pronunciation variations. Awards 2 Stars (80% score).
5. Unmatched Inputs: Provides constructive feedback with 1 Star, prompting the learner to retry.

## Accessibility and Themes

SpeakUp provides three visual modes accessible via the "Theme" button in the navigation bar:

- Pastel Mode (Default): Low-fatigue soft palette designed for children.
- High Contrast Mode: Deep slate background with high-luminosity text and bright accent borders for visual clarity.
- Dyslexia-Friendly Mode: Enhanced letter spacing (`0.08em`), word spacing (`0.15em`), line height (`1.6`), and rounded fonts to improve readability.

## Browser Compatibility

| Browser | Speech Recognition | Speech Synthesis | Web Audio API | Overall Support |
| :--- | :--- | :--- | :--- | :--- |
| Google Chrome | Yes | Yes | Yes | Fully Supported |
| Microsoft Edge | Yes | Yes | Yes | Fully Supported |
| Apple Safari | Yes (iOS 14.5+, macOS 11+) | Yes | Yes | Fully Supported |
| Mozilla Firefox | Partial (flag-dependent) | Yes | Yes | Limited Speech Input |
| Opera | Yes | Yes | Yes | Fully Supported |

Note: An active microphone and internet connectivity are required by browser speech recognition engines for transcription.

## Testing

Execute the unit test suite:
```bash
npm test
```

Execute JavaScript syntax validation:
```bash
npm run lint
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/topic-name`
3. Implement your changes following established modular structure.
4. Verify tests: `npm test && npm run lint`
5. Commit your work: `git commit -m "Descriptive message"`
6. Push to your branch and submit a pull request.

## License

This project is licensed under the MIT License.
