/*jslint browser: true, devel: true, white: true, eqeq: true, plusplus: true, sloppy: true, vars: true*/
/*global $ */

/*************** General ***************/

var updateOutput = function (e) {
  var list = e.length ? e : $(e.target),
      output = list.data('output');
  if (window.JSON) {
    if (output) {
      output.val(window.JSON.stringify(list.nestable('serialize')));
    }
  } else {
    alert('JSON browser support required for this page.');
  }
};

var nestableList = $("#nestable > .dd-list");

/***************************************/


/*************** Delete ***************/

var deleteFromMenuHelper = function (target) {
  if (target.data('new') == 1) {
    // if it's not yet saved in the database, just remove it from DOM
    target.fadeOut(function () {
      target.remove();
      updateOutput($('#nestable').data('output', $('#json-output')));
    });
  } else {
    // otherwise hide and mark it for deletion
    target.appendTo(nestableList); // if children, move to the top level
    target.remove();
    target.fadeOut();
  }
};

var deleteFromMenu = function () {
  var targetId = $(this).data('owner-id');
  var target = $('[data-id="' + targetId + '"]');

  var result = confirm("Delete " + target.data('name') + " and all its subitems ?");
  if (!target) {
    return;
  }

  // Remove children (if any)
  target.find("li").each(function () {
    deleteFromMenuHelper($(this));
  });

  // Remove parent
  deleteFromMenuHelper(target);

  // update JSON
  updateOutput($('#nestable').data('output', $('#json-output')));
};

/***************************************/


/*************** Edit ***************/

var menuEditor = $("#menu-editor");
var editButton = $("#editButton");
var editInputName = $("#editInputName");
var editInputSlug = $("#editInputSlug");
var currentEditName = $("#currentEditName");

// Prepares and shows the Edit Form
var prepareEdit = function () {
  var targetId = $(this).data('owner-id');
  var target = $('[data-id="' + targetId + '"]');

  editInputName.val(target.data("name"));
  editInputSlug.val(target.data("slug"));
  currentEditName.html(target.data("name"));
  editButton.data("owner-id", target.data("id"));

  console.log("[INFO] Editing Menu Item " + editButton.data("owner-id"));

  menuEditor.fadeIn();
};

// Edits the Menu item and hides the Edit Form
var editMenuItem = function () {
  var targetId = $(this).data('owner-id');
  var target = $('[data-id="' + targetId + '"]');

  var newName = editInputName.val();
  var newSlug = editInputSlug.val();

  target.data("name", newName);
  target.data("slug", newSlug);

  target.find("> .dd-handle").html(newName);

  menuEditor.fadeOut();

  // update JSON
  updateOutput($('#nestable').data('output', $('#json-output')));
};

/***************************************/


/*************** Add ***************/

var addToMenu = function (name, slug) {
  var newName = name ? name : $('#addInputName').val();
  var newSlug = slug ? slug : $('#addInputSlug').val();
  var newId = Date.now();

  nestableList.append(
    '<li class="dd-item" ' +
    'data-id="' + newId + '" ' +
    'data-name="' + newName + '" ' +
    'data-slug="' + newSlug + '" ' +
    'data-new="1" ' +
    'data-deleted="0">' +
    '<div class="dd-handle">' + newName + '</div> ' +
    '<span class="button-delete btn btn-danger btn-sm" ' +
    'data-owner-id="' + newId + '"> ' +
    '<i class="fas fa-trash-alt"></i>' +
    '</span>' +
    '<span class="button-edit btn btn-info btn-sm" data-toggle="modal" data-target=".modal-edit" ' +
    'data-owner-id="' + newId + '">' +
    '<i class="fas fa-pencil-alt"></i>' +
    '</span>' +
    '</li>'
  );

  // update JSON
  updateOutput($('#nestable').data('output', $('#json-output')));

  // set events
  $("#nestable .button-delete").on("click", deleteFromMenu);
  $("#nestable .button-edit").on("click", prepareEdit);
};



/***************************************/



$(function () {

  // output initial serialised data
  updateOutput($('#nestable').data('output', $('#json-output')));

  // set onclick events
  editButton.on("click", editMenuItem);

  $("#nestable .button-delete").on("click", deleteFromMenu);

  $("#nestable .button-edit").on("click", prepareEdit);

  $("#menu-editor").submit(function (e) {
    e.preventDefault();
  });

  $("#menu-add").submit(function (e) {
    e.preventDefault();
    addToMenu();
  });

});

