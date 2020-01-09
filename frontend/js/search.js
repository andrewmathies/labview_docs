const req = new XMLHttpRequest();
const url='http://saturten.com/api/vi';
req.open("GET", url);
req.send();

let viList

req.onreadystatechange = (err) => {
    if (err) {
        console.log('request for VI data failed', err)
        return
    }

    if(req.readyState !== XMLHttpRequest.DONE && req.status !== 200) {
        console.log('request for VI data was not successful', req.status)
        return
    }

    let response = req.responseText
    viList = JSON.parse(response)
    console.log(viList)
    autocomplete(document.getElementById("search_bar"), viList)
}

function autocomplete(inputElement, arr) {
	var currentFocus;

	// when user types into textbox
	inputElement.addEventListener("input", function(e) {
		var itemContainer, curMatch, i, val = this.value;
		
		closeAllLists();

		if (!val)
			return false;

		console.log("this is:");
		console.log(this);

		currentFocus = -1;
		itemContainer = document.createElement("DIV");
		itemContainer.setAttribute("id", this.id + "autocomplete-list");
		itemContainer.setAttribute("class", "autocomplete-items");
		
		this.parentNode.appendChild(itemContainer);

		// TODO: binary search variant
		for (i = 0; i < names.length; i++) {
			if (names[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				console.log("matched " + names[i] + " with " + val);

				curMatch = document.createElement("DIV");
				curMatch.innerHTML = "<strong>" + names[i].substr(0, val.length); + "</strong>";
				curMatch.innerHTML += names[i].substr(val.length);
				curMatch.innerHTML += "<input type='hidden' value='" + names[i] + "'>";
				
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
		var autoList = document.getElementById(this.id + "autocomplete-list");
		
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
                console.log('go to docs page with: ' + autoList[currentFocus])
			}
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
		for (var i = 0; i < autoList.length; i++)
			autoList[i].classList.remove("autocomplete-active");
	}

	function closeAllLists(element) {
		var items = document.getElementsByClassName("autocomplete-items");

		for (var i = 0; i < items.length; i++) { 
			if (element != items[i] && element != inputElement)
				items[i].parentNode.removeChild(items[i]);
		}
	}

	// if user clicks somewhere that isn't autocomplete list then close the list
	document.addEventListener("click", function(e) {
		closeAllLists(e.target);
	});
}