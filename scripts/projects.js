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

    elem.innerHTML = `
        <img src="${item.image_url}" alt=img_${item.headline}>
        <div class="item-info ${fontcolor}">
            <h3>${item.headline}</h3>
            <p>${item.description}</p>
            <p>Languages: ${item.languages}</p>
            <div class="btn_container">
                ${item.file !== "" ? `<button class="button"><a href=${item.file}>Try Out</a></button>` : ``}
                ${item.repository.includes("github") ? '<button class="button"><a href="' +item.repository +'" target="_blank">Show Code</a></button>' : '<button class="button"><a href="' +item.repository +'" target="_blank">Open on Gitlab</a></button>'}
            </div>
        </div>
    `;

    document.getElementById("project_container").appendChild(elem);
}