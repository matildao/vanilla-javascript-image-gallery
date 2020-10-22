const galleryContainer = document.getElementById("gallery-container");
const isIE = /*@cc_on!@*/ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;
const itemLimit = 9;
let currentPhotoQueuePosition = 0;
let fullGallery = [];
let scrollCount = 0;
let showing = [];
let pageId = 1;

/**
 * Adds each photo in gallery to the chosen DOM element that is sent in.
 * @param  {Object Array} gallery Gallery list that comes from Flickr
 * @param  {DOM element} container DOM element fetched by id
 */
const displayImages = (gallery, container) => {
	gallery.forEach(function (photo) {
		let img = document.createElement("img");
		let imgWrapper = document.createElement("div");

		img.className = "gallery-photo";
		img.alt = photo.title;
		img.src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
		imgWrapper.className = "gallery-photo-wrapper";

		imgWrapper.appendChild(img);
		container.appendChild(imgWrapper);
	});
};

/**
 * Displays nextgallery part for infinte scrolling feeling.
 * @param  {Object Array} wholeGallery Full gallery from flickr
 */
const showNextGalleryPart = (wholeGallery, queuePosition, limit) => {
	let nextImages = wholeGallery.slice(queuePosition, queuePosition + limit);

	scrollCount += 1; //Keep track on how many times the scroll is passed
	currentPhotoQueuePosition += limit;

	return nextImages;
};

/**
 * Fetches photos from Flickr API
 * @param  {Number} page Id for the current page of Flickr image search result
 */
const fetchFlickrImages = (page) => {
	let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY_HERE}&tags=dog&page=${page}&format=json&nojsoncallback=1`;
	const warning = document.getElementById("warning");

	https: fetch(url)
		.then((res) => res.json())
		.then((data) => {
			if (!data.photos) {
				warning.textContent = "The gallery can't be loaded at the moment.";
			} else {
				const photos = data.photos.photo;
				const showingGallery = photos.slice(0, itemLimit);

				warning.textContent = "";

				//Check if its first time fetching or infinite scroll and cache depending on case.
				if (fullGallery.length === 0 && !isEdge) {
					fullGallery = photos;
					localStorage.setItem("imageGallery", JSON.stringify(photos));
					currentPhotoQueuePosition = itemLimit;
				} else if (!isEdge) {
					fullGallery = fullGallery.concat(photos);
					localStorage.setItem("imageGallery", JSON.stringify(fullGallery));
				}

				displayImages(showingGallery, galleryContainer);
			}
		})
		.catch((err) => {
			warning.textContent = "The gallery can't be loaded at the moment.";
			throw err;
		});
};

(() => {
	let storedData;

	//only use localstorage if not Edge
	if (!isEdge) {
		storedData = localStorage.getItem("imageGallery");
	}

	//Fetch images from localstorage if exists otherwise fetch
	if (storedData && !isEdge) {
		showing = JSON.parse(storedData).slice(0, itemLimit);
		currentPhotoQueuePosition = itemLimit;
		fullGallery = JSON.parse(storedData);

		displayImages(showing, galleryContainer);
	} else {
		fetchFlickrImages(pageId);
	}
})();

//Add eventlistener that checks for scrolling position for infinite scroll
window.addEventListener("scroll", function (e) {
	if (
		window.scrollY > 1000 * scrollCount &&
		currentPhotoQueuePosition < fullGallery.length
	) {
		let showNext = showNextGalleryPart(
			fullGallery,
			currentPhotoQueuePosition,
			itemLimit
		);

		displayImages(showNext, galleryContainer);
	} else if (
		window.scrollY > 1000 &&
		currentPhotoQueuePosition > fullGallery.length //If queue position is at end of gallery fetch more
	) {
		pageId += 1;
		fetchFlickrImages(pageId);
	}
});
