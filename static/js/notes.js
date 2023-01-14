var updateForm = document.getElementById("update-form-container");

var closeForm = document.getElementById("update-close-btn");
closeForm.addEventListener("click", () => {
    updateForm.classList.toggle("activated");
});

var updateButton = document.getElementById("updateUser");
updateButton.addEventListener("click", () => {
    updateForm.classList.toggle("activated");
});

var searchForm = document.getElementById("reminder-form-container");
var closeForm = document.getElementById("form-close-btn");
closeForm.addEventListener("click", () => {
    searchForm.classList.toggle("activated");
});

const idUser = document.getElementById("txtId").value;

//Creación de notas
const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content, note.color, note.fondo);
    notesContainer.insertBefore(noteElement, notesContainer);
});

//Añadir notas por medio del boton
addNoteButton.addEventListener("click", () => addNote());

//Obtener las notas
function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
    //Arroja un arreglo
}

//Guardar las notas
function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
    //Recibe un JASON
}

//Crea el elemento de la nota
//Me retorna un textarea
function createNoteElement(id, content, color, fondo) {
//Pruebas de agregar personalización

//CREACIÓN DE ELEMENTOS
    const noteContainer = document.createElement("div");
    const caja = document.createElement("ul");
    const gotita = document.createElement("li");
    const reloj = document.createElement("li");
    //CREACIÓN DE IMAGENES
    const gotitaImg = document.createElement("img");
    const relojImg = document.createElement("img");
    gotitaImg.setAttribute("src", "../static/images/notas/gotita-icono.jpg");
    relojImg.setAttribute("src", "../static/images/notas/reloj-icono.png");
    caja.classList.add("funciones-nota");
    gotita.classList.add("icono-gotita");
    reloj.classList.add("icono-reloj");
    gotita.append(gotitaImg);
    reloj.append(relojImg);
    caja.append(gotita);
    caja.append(reloj);
    //CREACIÓN DE ELEMENTO TXT
    const element = document.createElement("textarea");
    element.classList.add("note");
    element.value = content;
    element.placeholder = "Nota vacia";
    element.style.color = fondo;
    element.style.backgroundColor = color;
    noteContainer.style.backgroundColor = color;

    //EVENTOS LISTENER
    element.addEventListener("change", () => {
        updateNote(id, element.value);
    });

    element.addEventListener("dblclick", () => {
        const doDelete = confirm("¿Seguro que quieres borrar la nota?");
        if (doDelete) {
            deleteNote(id, noteContainer);
        }
    });

    //CLICK LISTENER DE EL ICONO DE LA GOTITA
    gotita.addEventListener("click", () => {
        var colorEscogido = cambiarColor();
        var fondo;
        if (colorEscogido == "FF8C32" || colorEscogido == "4700D8" || colorEscogido == "9900F0") {
            element.style.color = "white";
            fondo = "white";
        } else {
            element.style.color = "black";
            fondo = "black";
        }
        element.style.backgroundColor = "#"+colorEscogido;
        noteContainer.style.backgroundColor = "#"+colorEscogido;
        updateColor(id, colorEscogido, fondo);
    });

    //CLICK LISTENER DEL ICONO DE RELOJ
    reloj.addEventListener("click", () => {
        searchForm.classList.toggle("activated");
    });
    
    //Adjuntar los elemenetos dentro del note-container
    noteContainer.classList.add("note-container");
    noteContainer.append(caja);
    noteContainer.append(element);
    return noteContainer;
}

//Añade la nota (AL PRESIONAR EL BOTÓN)
function addNote() {
    const notes = getNotes();
    const noteObject = {
        id_note: Math.floor(Math.random() * 100000) + "",
        contenido: "",
        color: "",
        fondo: ""
    };
    const noteElement = createNoteElement(noteObject.id_note, noteObject.contenido, noteObject.color, noteObject.fondo);
    notesContainer.insertBefore(noteElement, addNoteButton);
    notes.push(noteObject);
    saveNotes(notes);
    sendInfo(noteObject.id_note,noteObject.contenido,noteObject.color,noteObject.fondo,idUser);
}

// AÑADE LAS NOTAS EXTREYENDOLAS DE LA BD
function addNotesFromDB(noteObject) {
    const notes = getNotes();
    const noteElement = createNoteElement(noteObject.id_nota, noteObject.contenido, "#"+noteObject.color, noteObject.fondo);
    notesContainer.insertBefore(noteElement, addNoteButton);
    notes.push(noteObject);
    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id_nota == id)[0];
    targetNote.contenido = newContent;
    saveNotes(notes);
    sendInfo(id,targetNote.contenido,targetNote.color,targetNote.fondo,idUser);
}

function updateColor(id, color, fondo) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id_nota == id)[0];
    targetNote.color = color;
    targetNote.fondo = fondo;
    saveNotes(notes);
    sendInfo(id,targetNote.contenido,color,fondo,idUser);
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id_note != id);
    saveNotes(notes);
    notesContainer.removeChild(element);
    sendInfo(id,null,null,null,0);
}

//Funcion de color random
function cambiarColor() {
//azul     morado    morado    amarillo   naranja
    var colores = ["00C3FF", "4700D8", "9900F0", "FFC600", "FF8C32", "FFFFFF"];
    var numeroRandom = Math.floor(Math.random() * colores.length);
    var colorEscogido = colores[numeroRandom];
    return colorEscogido;
}

//LIMPIAR LOCAL STORAGE SIEMPRE QUE SE CARGUE LA PAGINA
window.onbeforeunload = function (){
    localStorage.removeItem('stickynotes-notes');
};

//ENVIAR INFORMACIÓN CON AJAX
var request;
function sendInfo(id,contenido,color,fondo,id_usuario){

    let url = "/notas/operacion-notas?id_nota="+id+"&contenido="+contenido+"&color="+color+"&fondo="+fondo+"&id_usuario="+id_usuario;

    const request = new XMLHttpRequest();
    request.open("PUT",url,true);
    request.send();
    
} 