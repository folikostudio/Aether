let cameraStream;
let micActive = true;
let cameraActive = true;

// --- Камера 1 FPS ---
async function initCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { frameRate: 1 }, audio: true });
        document.getElementById('camera').srcObject = cameraStream;
    } catch (err) {
        console.error("Ошибка доступа к камере/микрофону:", err);
    }
}

// --- Кнопки управления ---
document.getElementById('toggle-mic').onclick = () => {
    if(!cameraStream) return;
    micActive = !micActive;
    cameraStream.getAudioTracks().forEach(track => track.enabled = micActive);
};

document.getElementById('toggle-camera').onclick = () => {
    if(!cameraStream) return;
    cameraActive = !cameraActive;
    cameraStream.getVideoTracks().forEach(track => track.enabled = cameraActive);
};

document.getElementById('pause').onclick = () => {
    document.getElementById('camera').pause();
};

document.getElementById('restart').onclick = () => {
    document.getElementById('camera').play();
};

// --- Чат и сохранение ---
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
chatHistory.forEach(msg => addMessage(msg));

sendBtn.addEventListener('click', async () => {
    const text = inputEl.value.trim();
    if(!text) return;
    addMessage({ sender: 'user', text });
    inputEl.value = '';

    const aiReply = await fakeAI(text);
    addMessage({ sender: 'ai', text: aiReply });
});

function addMessage(msg) {
    const div = document.createElement('div');
    div.textContent = `${msg.sender === 'user' ? 'Ты' : 'AI'}: ${msg.text}`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    chatHistory.push(msg);
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// --- Заглушка AI ---
async function fakeAI(input) {
    return "Пример ответа AI: " + input;
}

// --- Инициализация ---
initCamera();
