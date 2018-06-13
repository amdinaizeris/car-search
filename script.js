"use strict"
// global
let searchResults = [];
let cars = [];
let newCar = {};
loadRemote();
// checks if enter is pressed for search
document.getElementById("search").addEventListener("keyup", function (e) {
    if (e.keyCode == 13) { search(); }
}, false);

// loads data from JSON-Server
function loadRemote() {
    fetch(`http://localhost:3000/cars`)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    cars = data;
                    for (let i in cars) {
                        showEntry(cars[i]);
                    }
                })
        });
}

// saves data to JSON-Server
function saveRemote(car) {
    fetch("http://localhost:3000/cars", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(car)
    })
        .then(function (data) {
            console.log("Išsaugota sėkmingai");
        })
        .catch(function (error) {
            console.log("Nepavyko išsaugoti", error);
        });
}

// saves edited data to JSON-Server
function saveRemoteEdited(id, car) {
    fetch(`http://localhost:3000/cars/${id}/`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(car)
    })
        .then(function (data) {
            console.log("Ištrinta sėkmingai");
        })
        .catch(function (error) {
            console.log("Nepavyko ištrinti", error);
        });
    clear();
    loadRemote();
    location.reload();
}

// removes entry from JSON-Server
function deleteRemote(id) {

    let answer = confirm("Are you sure?");
    if (answer === true) {
        fetch(`http://localhost:3000/cars/${id}/`, {
            method: "DELETE",
        })
            .then(function (data) {
                console.log("Ištrinta sėkmingai");
            })
            .catch(function (error) {
                console.log("Nepavyko ištrinti", error);
            });
        clear();
        loadRemote();
        location.reload();
    } else {
    }
}

// clears visible entries
function clear() {
    document.getElementById("collection").innerHTML = "";
}

// prints an entry on the main page
function showEntry(data) {
    let current = document.getElementById("collection").innerHTML;
    let newItem = `<div class="margin col-lg-6"><div class="item" onclick="showCar(${data.id})">
    <div class="overflow">
    <div class="cover">
    <img src="${data.picture}">
</div></div>
<div class="description">
    <div><h4>${data.make} ${data.model}</h4></div>
    <div><b>Year:</b> ${data.year}</div>
    <div><b>Auctioned for:</b> $${data.price}</div>
</div></div>`;
    document.getElementById("collection").innerHTML = current + newItem;
}

// opens car's modal window
function showCar(numb) {
    let data = cars.filter(x => x.id === numb)[0];
    let label = document.getElementById("showCarLabel").innerHTML = `${data.make} ${data.model}`;
    let car = document.getElementById("carDescription").innerHTML = `
    <div class="modalPhoto">
    <img src="${data.picture}">
    </div>
    <div class="modalDescription">
    <div><h3>${data.make} ${data.model}</h3></div>
    <div><b>Year:</b> ${data.year}</div>
    <div><b>Auctioned for:</b> $${data.price}</div>
    <br>
        <div>${data.description}</div>
    </div>
    `;
    document.getElementById("editButton").onclick = function () { editEntry(data.id) };
    document.getElementById("wikiButton").onclick = function () { wikiEntry(data.id) };
    $("#showCar").modal("show");
}

// saves an entry to the array and then uploads to JASON-Server
function saveEntry() {
    let make = document.getElementById("make").value;
    let model = document.getElementById("model").value;
    let year = document.getElementById("year").value;
    let price = document.getElementById("price").value;
    let picture = document.getElementById("picture").value;
    let description = document.getElementById("description").value;
    picture = `img/${model}.jpg`;
    newCar = { make, model, year, price, picture, description };
    saveRemote(newCar);
    location.reload();
    loadRemote();
}

// opens edit modal window
function editEntry(numb) {
    $("#editCar").modal("show");
    let data = cars.filter(x => x.id === numb)[0];
    document.getElementById("makeEdit").value = data.make;
    document.getElementById("modelEdit").value = data.model;
    document.getElementById("yearEdit").value = data.year;
    document.getElementById("priceEdit").value = data.price;
    document.getElementById("descriptionEdit").value = data.description;
    document.getElementById("removeEdit").onclick = function () { deleteRemote(numb) };
    document.getElementById("saveEdit").onclick = function () { saveEdited(numb) };
}

// saves edited entry and uploads to JSON-Server
function saveEdited(numb) {
    let picture = cars.filter(x => x.id === numb)[0].picture;
    let make = document.getElementById("makeEdit").value;
    let model = document.getElementById("modelEdit").value;
    let year = document.getElementById("yearEdit").value;
    let price = document.getElementById("priceEdit").value;
    let description = document.getElementById("descriptionEdit").value;
    newCar = { make, model, year, price, picture, description };
    saveRemoteEdited(numb, newCar);
}

// searches items by make and model, clears current view and shows the search results
function search() {
    let word = document.getElementById("search").value;
    if (word == "") {
        location.reload();
    }
    clear();
    let cars2 = cars.slice();
    let result;
    let index;
    for (const i in cars) {
        result = cars2.find(x => x.model.toLowerCase() == word.toLowerCase());
        index = cars2.map(x => x.model.toLowerCase()).indexOf(word.toLowerCase());
        if (result == null) {
            result = cars2.find(x => x.make.toLowerCase() == word.toLowerCase());
            index = cars2.map(x => x.make.toLowerCase()).indexOf(word.toLowerCase());
        }
        cars2.splice(0, index + 1);
        if (result != null) {
            searchResults[i] = result;
        }
    }
    for (const i in searchResults) {
        showEntry(searchResults[i]);
    }
}

// generates and URL of wiki page
function wikiEntry(numb) {
    let data = cars.filter(x => x.id === numb)[0];
    let url = `https://en.wikipedia.org/wiki/${data.make}_${data.model}`;
    window.open(url, '_blank');
}