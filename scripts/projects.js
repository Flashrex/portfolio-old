if(projects !== undefined) {
    // console.log(`Found ${projects.length} projects.`);

    for(var i = 0; i < projects.length; i++) {
        addItemToDomTree(projects[i]);
    }
}

function addItemToDomTree(item) {


    const elem = document.createElement("div");
    elem.classList.add("item");
    elem.classList.add(darkmode ? "bg-dark-contrast" : "bg-light-contrast");

    let fontcolor = darkmode ? "font-darkmode-white" : "font-lightmode-black";

    let tags = "";
    for(var i = 0; i < item.tags.length; i++) {
        tags += `<div class="tag">${item.tags[i]}</div>`;
    }

    elem.innerHTML = `
        <img src="${item.image_url}" alt=img_${item.headline}>
        <div class="item-info ${fontcolor}">
            <h3>${item.headline}</h3>
            <p>${item.description}</p>
            <div class="tag-container">${tags}</div>
            <div class="btn-container">
                ${item.file !== "" ? `<button class="button"><a href=${item.file}>Try Out</a></button>` : ``}
                ${item.repository.includes("github") ? '<button class="button"><a href="' +item.repository +'" target="_blank">Show Code</a></button>' : '<button class="button"><a href="' +item.repository +'" target="_blank">Open on Gitlab</a></button>'}
            </div>
        </div>
    `;

    document.getElementById("project_container").appendChild(elem);
}


/* Suche nach Tag */
function onSearchInput() {
    if(projects === undefined) return;

    document.querySelector("#project_container").innerHTML = "";

    let input = document.querySelector("#input_tag").value.toLowerCase();

    for(var i = 0; i < projects.length; i++) {
        if(projects[i].headline.toLowerCase().includes(input) || projects[i].tags.find(t => t.toLowerCase().includes(input))) {
            addItemToDomTree(projects[i]);
        }
    }
}