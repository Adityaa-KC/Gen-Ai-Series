document.addEventListener('DOMContentLoaded', () => {
    // Page sections
    const landingPage = document.getElementById('landing-page');
    const chatContainer = document.getElementById('chat-container');

    // Buttons
    const launchBtn = document.getElementById('launch-cta');
    const backBtn = document.getElementById('back-btn');
    const sendBtn = document.getElementById('send-btn');

    // Chat elements
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // --- View Switching Logic ---

    const showChat = () => {
        landingPage.classList.add('hidden');
        chatContainer.classList.remove('hidden');
    };

    const showLanding = () => {
        chatContainer.classList.add('hidden');
        landingPage.classList.remove('hidden');
    };

    // Event listeners for switching views
    launchBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the link from navigating
        showChat();
    });

    backBtn.addEventListener('click', () => {
        showLanding();
    });


    // --- Chatting Logic ---

    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        // A simple way to render newlines from the bot
        messageElement.innerText = message; 

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the latest message
    };

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }
            
            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error:', error);
            addMessage(`Error: ${error.message}`, 'bot');
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

});