// chatbox: messages are shared through Supabase, so everyone sees the same chat
const SUPABASE_URL = "https://xeeusjoxrwkfrdjgqfkv.supabase.co";
const SUPABASE_KEY = "sb_publishable_eZgSO3P8oYAou-xsiulQyg_rTAEikHc"; // public key, safe to be in the site
const MESSAGES_URL = SUPABASE_URL + "/rest/v1/messages";

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatName = document.getElementById("chat-name");
const chatText = document.getElementById("chat-text");

// remember the visitor's name for next time
try {
	chatName.value = localStorage.getItem("grace-chat-name") || "";
} catch (error) {}

function showChat(messages) {
	if (messages.length === 0) return;
	const atBottom = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 5;
	chatMessages.innerHTML = "";
	messages.forEach(function (message) {
		const when = new Date(message.created_at);
		const line = document.createElement("p");
		const name = document.createElement("b");
		name.textContent = message.name + ": ";
		const date = document.createElement("span");
		date.className = "chat-date";
		date.textContent = " " + when.getDate() + "/" + (when.getMonth() + 1);
		line.append(name, message.text, date);
		chatMessages.appendChild(line);
	});
	if (atBottom) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function loadChat() {
	fetch(MESSAGES_URL + "?select=name,text,created_at&order=created_at.asc&limit=300", {
		headers: { apikey: SUPABASE_KEY }
	})
		.then(function (response) { return response.ok ? response.json() : []; })
		.then(showChat)
		.catch(function () {});
}

chatForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const name = chatName.value.trim();
	const text = chatText.value.trim();
	if (!name || !text) return;
	try {
		localStorage.setItem("grace-chat-name", name);
	} catch (error) {}
	chatText.value = "";
	fetch(MESSAGES_URL, {
		method: "POST",
		headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
		body: JSON.stringify({ name: name, text: text })
	})
		.then(loadChat)
		.catch(function () {});
});

loadChat();
setInterval(loadChat, 10000); // check for new messages every 10 seconds
