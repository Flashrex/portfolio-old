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
                ${item.file !== "" ? `<a class="button" href=${item.file}>Try Out</a>` : ``}
                ${item.repository.includes("github") ? '<a class="button" href="' +item.repository +'" target="_blank">Show Code</a>' : '<a class="button disabled" href="#" onclick="return false;">Show Code</a>'}
            </div>
        </div>
    `;

    document.getElementById("project_container").appendChild(elem);
}


/* Suche nach Name/Tag */
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