import dummyData from "/02-esc/static/dummy-data.js";

const form = document.querySelector("form");
const searchInput = document.querySelector("input[type='search']");
const outputElement = document.querySelector("#output");
let filteredData = [];

function displayData(array) {
	if (array.length == 0) {
		outputElement.innerHTML = "<h2>No matching challenges.</h2>";
		return;
	}
	let dataString = "";
	array.forEach((data) => {
		// placeholder room data output
		dataString += `<p>
    <b>${data.title}</b><br /> 
    ${data.min_participants} - ${data.max_participants} participants<br />
    rating: ${data.rating}<br />
    ${data.description} <br />
    type: ${data.type}<br />
    tags: ${data.tags}<br />
    </p>`;
	});
	outputElement.innerHTML = dataString;
}

displayData(dummyData);

form.addEventListener("change", filterResults);
form.addEventListener("submit", doNotReload);
searchInput.addEventListener("keyup", filterResults);

function doNotReload(e) {
	// do not want the form to reload the browser window if submitted
	e.preventDefault();
}

function closeFilterModal() {
	// this function should restore all filters and use the original array to display the rooms
}

function filterResults(e) {
	filteredData = [];
	const formData = new FormData(form);

	dummyData.forEach((entry) => {
		// If an entry matches these criteria, add to array of entries to display

		// if rating selected: exclude if rating is smaller than min, or bigger than max
		// if tags selected: tags exist in entry.tag[]
		// if search term: exclude if title/description does not include the search term
		// if type selected: type:online matches OR type onsite matches

		let searchMatches = true;
		let ratingMatches = true;
		let typeMatches = true;
		let tagsMatches = true;

		let titleAndDescription = entry.title + " " + entry.description;
		titleAndDescription = titleAndDescription.split(/[ ,]+/);
		// splits string using regex on a space or a comma

		for (const [key, value] of formData) {
			// check tags
			if (
				(key == "tag:web" && !entry.tags.includes("web")) ||
				(key == "tag:crypto" && !entry.tags.includes("crypto")) ||
				(key == "tag:linux" && !entry.tags.includes("linux")) ||
				(key == "tag:coding" && !entry.tags.includes("coding"))
			) {
				tagsMatches = false;
			}

			// check types of rooms
			if (key == "type:online" && entry.type != "online") {
				typeMatches = false;
			}
			if (key == "type:onsite" && entry.type != "on-site") {
				typeMatches = false;
			}

			// check rating
			if (
				(key == "rating:min" && +entry.rating < +value) ||
				(key == "rating:max" && +entry.rating > +value)
			) {
				ratingMatches = false;
			}

			// check search input
			if (key == "search") {
				const valueArray = value.toLowerCase().split(/[ ,]+/);

				valueArray.forEach((searchTerm) => {
					const index = titleAndDescription.findIndex((element) => {
						if (element.includes(searchTerm)) {
							return true;
						}
					});

					if (index == -1) {
						searchMatches = false;
					}
				});
			}
		}

		// if both onsite and online are clicked
		if (formData.has("type:onsite") && formData.has("type:online")) {
			typeMatches = true;
		}

		// add the room to the displayArray if it matches all criteria
		if (typeMatches && tagsMatches && searchMatches && ratingMatches) {
			filteredData.push(entry);
		}
	});

	displayData(filteredData);
}
