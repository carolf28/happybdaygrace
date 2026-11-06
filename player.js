// little music player in the box under the profile
// add more songs to this list: { title: "artist - song", src: "assets/music/file.mp3" }
// keep file names simple (no spaces or accents) so every browser can find them
const tracks = [
	{
		title: "kelela - new life forms (feat. fousheé)",
		src: "assets/music/new-life-forms.mp3"
	}
];

const audio = document.getElementById("audio-element");
const titleEl = document.getElementById("track-title");
const timeEl = document.getElementById("time-display");
const bar = document.getElementById("progress-bar");
const progress = document.getElementById("progress-container");
const playBtn = document.getElementById("btn-play");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");

let current = 0;

// turns seconds into 00:00
function formatTime(seconds) {
	if (!isFinite(seconds)) return "00:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function showTime() {
	timeEl.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
	const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
	bar.style.width = percent + "%";
}

function loadTrack(index, autoplay) {
	current = (index + tracks.length) % tracks.length; // wraps around at both ends
	audio.src = tracks[current].src;
	titleEl.textContent = tracks[current].title;
	showTime();
	if (autoplay) audio.play().catch(() => {});
}

// shows a short message on the player screen when a song can't play
function showProblem(message) {
	titleEl.textContent = message;
}

// when the song won't load, checks whether the file can be reached at all
function explainLoadError() {
	fetch(audio.src, { method: "HEAD" })
		.then((response) => {
			if (response.ok) showProblem("file found, but this browser can't play it");
			else showProblem("song file not found (" + response.status + ")");
		})
		.catch(() => showProblem("can't load song (open the page in chrome or safari)"));
}

playBtn.addEventListener("click", () => {
	if (audio.paused) {
		audio.play().catch((error) => {
			if (audio.error) explainLoadError();
			else showProblem("can't play: " + error.name);
		});
	} else {
		audio.pause();
	}
});

// previous restarts the song if it's a few seconds in, otherwise goes back one
prevBtn.addEventListener("click", () => {
	if (audio.currentTime > 3) audio.currentTime = 0;
	else loadTrack(current - 1, !audio.paused);
});

nextBtn.addEventListener("click", () => loadTrack(current + 1, !audio.paused));

// click anywhere on the bar to jump to that point
progress.addEventListener("click", (event) => {
	if (!audio.duration) return;
	const rect = progress.getBoundingClientRect();
	audio.currentTime = ((event.clientX - rect.left) / rect.width) * audio.duration;
});

const playIcon = document.getElementById("play-icon");

audio.addEventListener("play", () => {
	playIcon.className = "icon icon-pause";
	playBtn.setAttribute("aria-label", "pause");
});
audio.addEventListener("pause", () => {
	playIcon.className = "icon icon-play";
	playBtn.setAttribute("aria-label", "play");
});
audio.addEventListener("timeupdate", showTime);
audio.addEventListener("loadedmetadata", showTime);
audio.addEventListener("ended", () => loadTrack(current + 1, true));
audio.addEventListener("error", explainLoadError);

loadTrack(0, false);
