const fileInput = document.querySelector('input[type="file"]');

const myImage = new Image();
myImage.src= 'img/imagen.jpg';

const myFile = new File([myImage], 'imagen.jpg');

const dataTransfer = new DataTransfer();
dataTransfer.items.add(myFile);
fileInput.files = dataTransfer.files;