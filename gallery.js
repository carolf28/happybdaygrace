// swaps the letter in the welcome box for the photo gallery, using the links in the navigation box
const letter = document.getElementById("letter");
const gallery = document.getElementById("gallery");
const welcomeInner = document.querySelector(".welcome-inner");

function showPage() {
	const showGallery = location.hash === "#gallery";
	letter.hidden = showGallery;
	gallery.hidden = !showGallery;
	document.querySelector('nav a[href="#home"]').classList.toggle("active", !showGallery);
	document.querySelector('nav a[href="#gallery"]').classList.toggle("active", showGallery);
	welcomeInner.scrollTop = 0; // start at the top of the box
}
window.addEventListener("hashchange", showPage);
showPage();

// clicking a photo opens it big; clicking anywhere closes it
const viewer = document.getElementById("photo-viewer");
const viewerImg = document.getElementById("photo-viewer-img");

gallery.addEventListener("click", function (event) {
	const link = event.target.closest(".gallery-grid a");
	if (!link) return;
	event.preventDefault();
	viewerImg.src = link.href;
	viewer.hidden = false;
});
viewer.addEventListener("click", function () {
	viewer.hidden = true;
});
document.addEventListener("keydown", function (event) {
	if (event.key === "Escape") viewer.hidden = true;
});

