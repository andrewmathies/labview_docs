let req = new XMLHttpRequest();
const url='http://saturten.com/api/vi';
req.open("GET", url);
req.send();

const viDict

req.onreadystatechange = (event) => {
    if(req.readyState !== XMLHttpRequest.DONE || req.status !== 200 || !req.responseText) {
        return
    }

    let response = req.responseText
    let viList = JSON.parse(response)
	autocomplete(document.getElementById("search_bar"), viList)
	
	viDict = viList.reduce((map, vi) => {
		map[vi.name] = vi.id
		return map
	}, {})
	console.log(viDict)
}

window.onload = () => {
	document.getElementById('search_button').addEventListener('click', () => {
		search()
	})
}

// get whatever is in the search bar and redirect to doc page with that value as param
const search = () => {
	const search_bar = document.getElementById('search_bar')
	window.location.href = '/doc?id=' + viDict[search_bar.value]
}

const autocomplete = (inputElement, data) => {
	let currentFocus;

	// when user types into textbox
	inputElement.addEventListener("input", function(e) {
		let itemContainer, curMatch, i, val = this.value;
		
		closeAllLists();

		if (!val)
			return false;

		currentFocus = -1;
		itemContainer = document.createElement("DIV");
		itemContainer.setAttribute("id", this.id + "autocomplete-list");
		itemContainer.setAttribute("class", "autocomplete-items");
		
		this.parentNode.appendChild(itemContainer);

        // TODO: binary search variant
		for (i = 0; i < data.length; i++) {
            let cur = data[i].name
			if (cur.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				curMatch = document.createElement("DIV");
				curMatch.innerHTML = "<strong>" + cur.substr(0, val.length); + "</strong>";
				curMatch.innerHTML += cur.substr(val.length);
				curMatch.innerHTML += "<input type='hidden' value='" + cur + "'>";
				
				curMatch.addEventListener("click", function(e) {
					
					inputElement.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});

				itemContainer.appendChild(curMatch);
			}
		}
	});

	// when user presses a key
	inputElement.addEventListener("keydown", function(e) {
		let autoList = document.getElementById(this.id + "autocomplete-list");
		
		if (autoList)
			autoList = autoList.getElementsByTagName("div");

		if (e.keyCode == 40) {
			// down is pressed
			currentFocus++;
			addActive(autoList);
		} else if (e.keyCode == 38) {
			// up is pressed
			currentFocus--;
			addActive(autoList);
		} else if (e.keyCode == 13) {
			// enter is pressed
			e.preventDefault();

			if (currentFocus > -1 && autoList) {
                autoList[currentFocus].click();
            }
            
			search()
		}
	});

	function addActive(autoList) {
		if (!autoList)
			return false;

		removeActive(autoList);

		if (currentFocus >= autoList.length)
			currentFocus = 0;
		else if (currentFocus < 0)
			currentFocus = autoList.length - 1;

		autoList[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(autoList) {
		for (let i = 0; i < autoList.length; i++)
			autoList[i].classList.remove("autocomplete-active");
	}

	function closeAllLists(element) {
		let items = document.getElementsByClassName("autocomplete-items");

		for (let i = 0; i < items.length; i++) { 
			if (element != items[i] && element != inputElement)
				items[i].parentNode.removeChild(items[i]);
		}
	}

	// if user clicks somewhere that isn't autocomplete list then close the list
	document.addEventListener("click", function(e) {
		closeAllLists(e.target);
	});
}
