let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let fileName = document.getElementById("file-name");
let container = document.querySelector(".container");
let error = document.getElementById("error");
let imageDisplay = document.getElementById("chat-window");

const fileHandler = (file, name, type) => {
  if (type.split("/")[0] !== "image") {
    // File Type Error
    error.innerText = "Please upload an image file";
    return false;
  }
  error.innerText = "";
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    // Image and file name
    let imageContainer = document.createElement("figure");
    let img = document.createElement("img");
    img.src = reader.result;
    imageContainer.appendChild(img);

    // Create caption and delete button wrapper
    let captionWrapper = document.createElement("div");
    captionWrapper.style.display = "flex";
    captionWrapper.style.justifyContent = "space-between";
    captionWrapper.style.alignItems = "center";

    // Create caption
    let caption = document.createElement("figcaption");
    caption.innerText = name;
    captionWrapper.appendChild(caption);

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.margin = "5px 0";
    deleteButton.addEventListener("click", () => {
      imageDisplay.removeChild(imageContainer);
    });

    captionWrapper.appendChild(deleteButton);
    imageContainer.appendChild(captionWrapper);
    imageDisplay.appendChild(imageContainer);
  };
};

// Upload Button
uploadButton.addEventListener("change", () => {
  Array.from(uploadButton.files).forEach((file) => {
    fileHandler(file, file.name, file.type);
  });
  uploadButton.value = "";
});

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

// Paste Event
document.addEventListener("paste", (e) => {
  let items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file") {
      let file = items[i].getAsFile();
      fileHandler(file, file.name, file.type);
    }
  }
});

window.onload = () => {
  error.innerText = "";
};

