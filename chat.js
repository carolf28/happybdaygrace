// chatbox: messages are kept in this browser only
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatName = document.getElementById("chat-name");
const chatText = document.getElementById("chat-text");

let messages = [];
try {
	messages = JSON.parse(localStorage.getItem("grace-chat")) || [];
} catch (error) {}

function showChat() {
	if (messages.length === 0) return;
	chatMessages.innerHTML = "";
	messages.forEach(function (message) {
		const line = document.createElement("p");
		const name = document.createElement("b");
		name.textContent = message.name + ": ";
		const date = document.createElement("span");
		date.className = "chat-date";
		date.textContent = " " + message.date;
		line.append(name, message.text, date);
		chatMessages.appendChild(line);
	});
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const now = new Date();
	messages.push({
		name: chatName.value.trim(),
		text: chatText.value.trim(),
		date: now.getDate() + "/" + (now.getMonth() + 1)
	});
	try {
		localStorage.setItem("grace-chat", JSON.stringify(messages));
	} catch (error) {}
	chatText.value = "";
	showChat();
});

showChat();
