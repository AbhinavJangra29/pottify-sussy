document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const musicPlayerContainer = document.getElementById('musicPlayerContainer');
    let midiBase64 = '';

    generateButton.addEventListener('click', async function () {
        try {
            const response = await fetch('https://pottify-backend.onrender.com/getmidi');
            const data = await response.json();

            if (data.midi_base64) {
                // Save the base64 data
                midiBase64 = data.midi_base64;

                // Decode base64 data and save as output.mid
                const decodedData = b64toBlob(midiBase64, 'audio/midi');
                const url = URL.createObjectURL(decodedData);

                // Generate and append the music player components here
                generateMusicPlayer(url);

                // Show the "Generate Another Tune" button and prompt
                showGenerateAnotherButton();
            } else {
                console.error('Base64 data not found in the response:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function generateMusicPlayer(midiUrl) {
        // Create the MIDI player and visualizer components
        const midiPlayer = document.createElement('midi-player');
        midiPlayer.setAttribute('src', midiUrl);
        midiPlayer.setAttribute('sound-font', '');
        midiPlayer.setAttribute('visualizer', '#myVisualizer');

        const midiVisualizer = document.createElement('midi-visualizer');
        midiVisualizer.setAttribute('type', 'piano-roll');
        midiVisualizer.setAttribute('id', 'myVisualizer');

        // Clear previous content in the musicPlayerContainer
        musicPlayerContainer.innerHTML = '';

        // Append the new components to the container
        musicPlayerContainer.appendChild(midiPlayer);
        musicPlayerContainer.appendChild(midiVisualizer);
    }

    function showGenerateAnotherButton() {
        // Create "Generate Another Tune" button and associated prompt
        const generateAnotherButton = document.createElement('button');
        generateAnotherButton.setAttribute('id', 'generateAnotherButton');
        generateAnotherButton.innerText = 'Generate Another Tune';
        generateAnotherButton.addEventListener('click', function () {
            // Reset the music player and initiate the process again
            const midiPlayer = musicPlayerContainer.querySelector('midi-player');
            if (midiPlayer) {
                midiPlayer.stop(); // Stop the currently playing music
                musicPlayerContainer.removeChild(midiPlayer);
            }

            generateAnotherButton.style.display = 'none';
            promptMessage.style.display = 'none';
        });

        const promptMessage = document.createElement('div');
        promptMessage.setAttribute('id', 'promptMessage');
        promptMessage.innerText = "Looking for a different vibe? Click the button to jazz it up!";

        // Append the new prompt to the container
        musicPlayerContainer.appendChild(promptMessage);

        // Append the new button after the prompt
        musicPlayerContainer.appendChild(generateAnotherButton);
    }

    function b64toBlob(base64, contentType = '') {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }
});
