# Gemini Drum PAL

Welcome to Gemini Drum PAL, an AI-powered virtual drum machine keychain inspired by 90s electronic toys. This project combines a retro aesthetic with modern AI capabilities to create a unique and fun musical experience.

## Project Overview

Gemini Drum PAL is a web-based application built with React, TypeScript, and Vite. It leverages the Google Gemini API to dynamically generate drum sounds based on user prompts. The application's state is managed through a system of custom React hooks, and it uses `tone.js` for audio synthesis and playback. The user interface is designed to resemble a classic 90s handheld electronic toy, complete with an LCD "pixel screen" and tactile buttons.

## Features

- **AI Sound Generation:** Describe a sound, and the Gemini API will generate a unique Tone.js configuration to produce it.
- **Customizable Kits:** Save and load your favorite sound kits.
- **Sequencer:** Record, play back, and loop your beats.
- **Theming:** Customize the look of your Drum PAL with different shell colors and transparency options.
- **Stickers:** Add a personal touch with custom stickers.
- **Shareable Kits:** Generate a unique URL to share your creations with others.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Audio:** `tone.js`
- **AI:** Google Gemini API
 - **Backend:** Local development server (Express) or a production backend of your choice.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemini-drum-pal.git
    cd gemini-drum-pal
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

 3.  **Set up environment variables (development):**

     Create a `.env` file in the root of the project and add your Gemini API key:

     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     GEMINI_API_KEY=your_api_key_here
     ```

### Running the Development Server

To start the local development server and the backend server, run the following commands in separate terminals:

```bash
pnpm run start:server
pnpm dev
```

The application will be available at `http://localhost:3000` (configured in `vite.config.ts`).

## How to Use

- **Power On:** Click the power button to turn on the device.
- **Play:** Click the drum pads to play sounds. You can also use your keyboard (Q, W, E, A, S, D, Z, X, C, Space).
- **Edit a Sound:**
    1. Click the "MENU" button.
    2. Click the pad you want to edit.
    3. Type a description of the sound you want in the text area.
    4. Click the pad again to generate the new sound.
- **Save a Kit:**
    1. Click the "KITS" button.
    2. Enter a name for your kit and click "Save".
- **Load a Kit:**
    1. Click the "KITS" button.
    2. Click the "Load" button next to the kit you want to load.
- **Record a Sequence:**
    1. Click the red "●" button to start recording.
    2. Play a sequence on the drum pads.
    3. Click the "●" button again to stop recording.
- **Play a Sequence:**
    1. Click the green "▶" button to play back your recorded sequence.
    2. Click the "■" button to stop playback.

## Project Structure

The project is organized into the following main directories:

-   `src/`: Contains the main source code for the application.
    -   `components/`: Reusable UI components.
    -   `config/`: Application configuration files.
    -   `constants/`: Constant values used throughout the application.
    -   `hooks/`: Custom React hooks for managing state and logic.
    -   `services/`: Services for interacting with external APIs and browser features.
    -   `toys/`: The main components for each toy.
    -   `types/`: TypeScript type definitions.
    -   `utils/`: Utility functions.
-   `server/`: Contains a local Express development backend used for `/api/*` endpoints.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.
