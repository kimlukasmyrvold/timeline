function getJSON(path = "", functionCall) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            functionCall(json);
        })
        .catch(() => {
            this.dataError = true;
        })
}


function addEvents(data) {
    const timeline = document.querySelector(".timeline");
    const container = timeline.querySelector(".container");
    let eventCount = timeline.querySelectorAll(".event").length;

    for (const key in data) {
        const empty = document.createElement("div");
        empty.classList.add("marker");

        const middle = document.createElement("div");
        middle.classList.add("middle");

        const event = document.createElement("div");
        event.classList.add("event");
        event.dataset.event = key;
        event.addEventListener("click", (e) => {
            e.preventDefault();
            scrollTo(document.querySelector("#eventViewer"));
            updateEventViewer(data[e.target.dataset.event]);
        });


        /* Hero section */
        const hero = document.createElement("div");
        hero.classList.add("hero");

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = data[key].Name;

        const time = document.createElement("p");
        time.classList.add("time");
        time.textContent = (data[key].StartTime === data[key].EndTime) ? data[key].StartTime : `${data[key].StartTime} - ${data[key].EndTime}`;

        hero.append(title, time);
        /* End of Hero section */


        /* Description section */
        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = data[key].Description;
        /* End of Description section */


        eventCount++;
        event.append(hero, description);

        if (eventCount % 2) container.append(empty, middle, event);
        else container.append(event, middle, empty);
    }

    updateEventViewer(data[Object.keys(data)[0]]);
}

function updateEventViewer(data) {
    if (!data) {
        console.error("No data was given to updateEventViewer()!");
        return;
    }

    const eventViewer = document.querySelector("#eventViewer");

    const title = eventViewer.querySelector(".eventViewer__container__hero__title");
    const time = eventViewer.querySelector(".eventViewer__container__hero__time");
    const description = eventViewer.querySelector(".eventViewer__container__content__description");
    const images = eventViewer.querySelector(".eventViewer__container__content__images");

    title.textContent = data.Name;
    time.textContent = (data.StartTime === data.EndTime) ? data.StartTime : `${data.StartTime} - ${data.EndTime}`;
    description.textContent = data.Description;
    addImagesToEventViewer(images, data.Images);
}


function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = () => {
        callback(true);
    };
    img.onerror = (e) => {
        e.preventDefault();
        callback(false);
    };
    img.src = url;
}

function addImagesToEventViewer(container, data) {
    container.innerHTML = "";

    for (const key in data) {
        const imageUrl = `./assets/images/sami/${data[key]}`;

        checkImageExists(imageUrl, (exists) => {
            if (exists) {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("eventViewer__container__content__images__image");

                const img = document.createElement("img");
                img.src = imageUrl;

                imgContainer.addEventListener("click", OpenImageModal);

                imgContainer.append(img);
                container.append(imgContainer);
            } else {
                console.error(`Failed to load image: ${imageUrl}`);
            }
        });
    }
}



function OpenImageModal(e) {
    const ImageModal = document.querySelector("#expandedImageModal");
    ImageModal.classList.add("open");

    const image = ImageModal.querySelector(".image img");
    image.src = e.target.querySelector("img").getAttribute("src");

    document.addEventListener("keydown", temp);

    function temp(e) {
        if (e.key === "Escape") CloseImageModal();
        document.removeEventListener("keydown", temp);
    }
}

function CloseImageModal() {
    const ImageModal = document.querySelector("#expandedImageModal");
    ImageModal.classList.remove("open");
}



function scrollTo(target) {
    target.scrollIntoView({ behavior: "smooth" });
}

function scrollToTopInit() {
    document.querySelectorAll(".button.scrollToTop").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            scrollTo(document.querySelector("#main"));
        });
    });

    // Makes scroll to top button visible or invisible depending on scroll.
    const scrollToTopButton = document.querySelector("#scrollToTop");
    window.addEventListener("scroll", (e) => {
        e.preventDefault();
        if (window.scrollY >= 500) scrollToTopButton.classList.add("active");
        else scrollToTopButton.classList.remove("active");
    });
}


window.onload = () => {
    document.querySelector('#expandedImageModal .close').addEventListener("click", CloseImageModal);
    document.querySelector("#footer .copyright .time").textContent = new Date().getFullYear();
    scrollToTopInit();

    getJSON("./assets/json/events.json", (data) => {
        addEvents(data);
    });
}