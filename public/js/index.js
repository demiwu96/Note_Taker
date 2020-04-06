const noteTitle = $(".note-title");
const noteTextBox = $(".note-textarea");
const saveBtn = $(".save-note");
const newNoteBtn = $(".new-note");
const savedBadge = $("#savedBadge");
const deletedBadge = $("#deletedBadge");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const currentURL = window.location.origin;

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function () {
  saveBtn.hide();

  if (activeNote.id) {
    noteTitle.val(activeNote.title);
    noteTextBox.val(activeNote.text);
  } else {
    noteTitle.val("");
    noteTextBox.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
const saveNote = function () {
  if (activeNote.id) {
    var newNote = {
      title: noteTitle.val(),
      text: noteTextBox.val(),
      id: activeNote.id
    };
    activeNote = newNote;
  } else {
    let noteID = Math.floor(Math.random() * 99999);
    newNote = {
      title: noteTitle.val(),
      text: noteTextBox.val(),
      id: noteID
    };
  };

  $.post(currentURL + "/api/notes", newNote)
    .then(function (data) {
      if (data) {
        getAndRenderNotes();
        renderActiveNote();
      }
    });
};

// Delete the clicked note
const deleteNote = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();
  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }
  let noteID = { "id": note.id };

  $.post("api/deletenotes", noteID)
    .then(function (data) {
      if (true) {
        showDeletedBadge();
        getAndRenderNotes();
        renderActiveNote();
      }
    });
};

// Sets the activeNote and displays it
const NoteDisplay = function () {
  if (!noteTitle.val().trim() || !noteTextBox.val().trim()) {
    activeNote = $(this).data();
    renderActiveNote();
  } else {
    saveNote();
    activeNote = $(this).data();
    renderActiveNote();
  }
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const newNoteDisplay = function () {
  saveNote();
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!noteTitle.val().trim() || !noteTextBox.val().trim()) {
    saveBtn.hide();
  } else {
    saveBtn.show();
  }
};

const showSavedBadge = function () {
  savedBadge.show();
  setTimeout(() => savedBadge.hide(), 1000);
};

const showDeletedBadge = function () {
  deletedBadge.show();
  setTimeout(() => deletedBadge.hide(), 1000);
};

// Render's the list of note titles
const renderNoteList = function (notes) {
  $noteList.empty();

  var noteListItems = [];
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item list-custom'>").data(note);
    $li.attr("data-id", note.id);
    var $span = $("<span>").text(note.title);
    var $delBtn = $("<i class='fas fa-trash-alt float-right delete-note'>");

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }
  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function () {
  $.get(currentURL + "/api/notes", data => {
    renderNoteList(data);
  });
};

saveBtn.on("click", () => {
  saveNote();
  showSavedBadge();
});
$noteList.on("click", ".list-group-item", NoteDisplay);
newNoteBtn.on("click", newNoteDisplay);
$noteList.on("click", ".delete-note", deleteNote);
noteTitle.on("keyup", handleRenderSaveBtn);
noteTextBox.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();