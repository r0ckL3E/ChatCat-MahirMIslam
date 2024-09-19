// Get references to DOM elements
let uploadButton = document.getElementById("upload-button");
let container = document.querySelector(".container");
let error = document.getElementById("error");
let imageDisplay = document.getElementById("chat-window");

const dbName = "imageStorage";
let db;

// Define the database name and a variable to hold the database instance
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);


        // Event triggered if the database needs to be created or upgraded
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            db.createObjectStore("images", { keyPath: "name" });
        };

        // Event triggered when the database is successfully opened
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };


        // Event triggered if there is an error opening the database
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};


// Function to save an image to the database
const saveImageToDB = (name, dataURL) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");
        const request = store.put({ name, dataURL });



        // Event triggered when the image is successfully saved
        request.onsuccess = () => {
            resolve();
        };

        // Event triggered if there is an error saving the image
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};


// Function to load all images from the database
const loadImagesFromDB = () => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const request = store.getAll();



        // Event triggered when the images are successfully loaded
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        // Event triggered if there is an error loading the images
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};


// Function to delete an image from the database
const deleteImageFromDB = (name) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");
        const request = store.delete(name);


        // Event triggered when the image is successfully deleted
        request.onsuccess = () => {
            resolve();
        };


        // Event triggered if there is an error deleting the image
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};



// Function to handle file uploads
const fileHandler = (file, name, type) => {
    if (type.split("/")[0] !== "image") {

        // Display an error if the file is not an image
        error.innerText = "Please upload an image file";
        return false;
    }


    error.innerText = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {


        // Create a container for the image
        let imageContainer = document.createElement("figure");
        let img = document.createElement("img");
        img.src = reader.result;
        imageContainer.appendChild(img);


        // Create a wrapper for the caption and delete button
        let captionWrapper = document.createElement("div");
        captionWrapper.style.display = "flex";
        captionWrapper.style.justifyContent = "space-between";
        captionWrapper.style.alignItems = "center";


        // Create a caption for the image
        let caption = document.createElement("figcaption");
        caption.innerText = name;
        captionWrapper.appendChild(caption);

        // Create a delete button for the image
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.margin = "5px 0";
        deleteButton.addEventListener("click", () => {
            imageDisplay.removeChild(imageContainer);
            deleteImageFromDB(name);
        });

        captionWrapper.appendChild(deleteButton);
        imageContainer.appendChild(captionWrapper);
        imageDisplay.appendChild(imageContainer);

        // Save image to IndexedDB
        saveImageToDB(name, reader.result);
    };
};

// Event listener for file uploads via the upload button
uploadButton.addEventListener("change", () => {
    Array.from(uploadButton.files).forEach((file) => {
        fileHandler(file, file.name, file.type);
    });
    uploadButton.value = "";
});


// Event listeners for drag-and-drop functionality
container.addEventListener(
    "dragenter",
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add("active");
    },
    false
);

container.addEventListener(
    "dragleave",
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.remove("active");
    },
    false
);

container.addEventListener(
    "dragover",
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.add("active");
    },
    false
);

container.addEventListener(
    "drop",
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.remove("active");
        let draggedData = e.dataTransfer;
        let files = draggedData.files;
        Array.from(files).forEach((file) => {
            fileHandler(file, file.name, file.type);
        });
    },
    false
);

// Event listener for pasting images
document.addEventListener("paste", (e) => {
    let items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
            let file = items[i].getAsFile();
            fileHandler(file, file.name, file.type);
        }
    }
});

// Load images from the database when the window loads
window.onload = async () => {
    error.innerText = "";
    await openDB();
    const images = await loadImagesFromDB();
    images.forEach(({ name, dataURL }) => {
        let imageContainer = document.createElement("figure");
        let img = document.createElement("img");
        img.src = dataURL;
        imageContainer.appendChild(img);

        let captionWrapper = document.createElement("div");
        captionWrapper.style.display = "flex";
        captionWrapper.style.justifyContent = "space-between";
        captionWrapper.style.alignItems = "center";

        let caption = document.createElement("figcaption");
        caption.innerText = name;
        captionWrapper.appendChild(caption);

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.style.margin = "5px 0";
        deleteButton.addEventListener("click", () => {
            imageDisplay.removeChild(imageContainer);
            deleteImageFromDB(name);
        });

        captionWrapper.appendChild(deleteButton);
        imageContainer.appendChild(captionWrapper);
        imageDisplay.appendChild(imageContainer);
    });
};

// Download all images as ZIP
document.getElementById('download-zip-button').addEventListener('click', async () => {
    const zip = new JSZip();
    const imagesFolder = zip.folder("images");

    // Open the database and load images
    await openDB();
    const images = await loadImagesFromDB();

    // Add each image to the ZIP file
    images.forEach(({ name, dataURL }) => {
        const base64Data = dataURL.split(',')[1];
        imagesFolder.file(name, base64Data, { base64: true });
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "images.zip";
        link.click();
    });
});