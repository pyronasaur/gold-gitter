var url = window.location.pathname;
var playerAvatar;
var playerName;

//var state = "NEW";

var currentPlayer;
var currentRoom;
var currentOptions = [];
var questionResponse;
var currentItem;

$(document).ready(function () {

  var name = localStorage.getItem("name");
  var avatar = localStorage.getItem("avatar");
  console.log(name, avatar);

  $("h5#playerName").text(name);
  $("img.avatarimg").attr("id", avatar);

  if (url.indexOf("game/") !== -1) {
    playerId = url.split("/")[2];
    loadGame(playerId);
  }
})



/* #region Game Objects  */

function Player(playerId, name, teamId, itemId, lives, gold) {
  this.playerId = playerId;
  this.name = name;
  this.teamId = teamId;
  this.itemId = itemId;
  this.lives = lives;
  this.gold = gold;
}

function Room(roomId, roomName, enterText, optionListId) {
  this.roomId = roomId;
  this.roomName = roomName;
  this.enterText = enterText;
  this.optionListId = optionListId;
}

function GameOptions(optionId, optionText, optionListId, responseId, reqItemId) {
  this.optionId = optionId;
  this.optionText = optionText;
  this.optionListId = optionListId;
  this.responseId = responseId;
  this.reqItemId = reqItemId;
}

function GameResponse(responseId, responseText, optionListId, isDoorway, goldMultiplier, isDeath, newItemId) {
  this.responseId = responseId;
  this.responseText = responseText;
  this.optionListId = optionListId;
  this.isDoorway = isDoorway;
  this.goldMultiplier = goldMultiplier;
  this.isDeath = isDeath;
  this.newItemId = newItemId;
}

function Item(itemId, itemName, itemText) {
  this.itemId = itemId;
  this.itemName = itemName;
  this.itemText = itemText;
}

/* #endregion End Game Objects*/

/* #region UI update function section  */

//update player elements gold, lives, item based on changes to player object
function updatePlayerElements(player) {
  $("#lifeCount").text(player.lives);
  $("#goldCount").text(player.gold);
  updatePlayerItem(player.itemId);
}

//add new response text to text scroller UI
function updateResponse(responseText) {
  var text = "<p id='responseText'>" + responseText + "</p>"

  $("#textScroller").append(text)
}

//add new options to radio selection in UI
function updateOptions(optionList) {
  var form = $("#gameOptions")
  //form.remove(".radioInput")
  form.empty();

  var radioIdValue = "resId_";

  for (var i = 0; i < optionList.length; i++) {
    form.append("<input class='radioInput' type='radio' name='options' value='" + radioIdValue + optionList[i].responseId + "'>" + optionList[i].optionText + "<br>")
  }
}

//add new enter text to text scroller UI
function updateEnterText(enterText) {
  var entry = "<p id='enterText'>" + enterText + "</p>"

  $("#textScroller").append(entry)
}


//room pic needs to be updated on room change
function updateNewRoom(roomId) {
  roomId -= 1;
  var roomImageId = ["room1", "room2", "room3", "room4", "room5"];
  var roomImage = ["Great Hall", "Library", "Guard Chamber", "Solar", "Chapel"];

  $("img.room").attr("id", roomImageId[roomId]);
  $("p#roomName").text(roomImage[roomId]);
}

//Give some gold to the player
function scoreGold(multiplier) {
  var gold = Math.ceil(Math.random() * 100) * multiplier;

  var text = "<p id='responseText'>You found " + gold + " gold!</p>";
  currentPlayer.gold += gold;
  $("#textScroller").append(text);
}

//function that returns player to start, or ends game based on life counter
function dead() {
  alert("GAME OVER");
  window.location.href = "/";
}

function updatePlayerItem(itemId) {
  if(itemId == null) {
    itemId = 3;
  }
  else {
    itemId -= 1;
  }
  console.log(itemId);
  var items = ["toaster", "crossbow", "sword", "none", "golden_toaster", "golden_crossbow", "golden_sword"];
  var itemName = ["Toaster", "Crossbow", "Sword", "Nothing", "Golden Toaster", "Golden Crossbow", "Golden Sword"];

  $("img.item").attr("src", "/assets/images/" + items[itemId] + ".png");
  $("p.item").text(itemName[itemId]);
}

/* #endregion End UI update function section*/


/* #region  Game API call section */


const getPlayer = async (playerId) => {

  try {

    let response = await $.get("/api/player/" + playerId);
    return await response;

  } catch (err) {
    console.log("Failed to get player with id: " + playerId + " " + err);
  }

}

const getStartingRoom = async () => {

  try {

    let response = await $.get("/api/start")
    return await response;

  } catch (err) {
    console.log("Failed to get player with id: " + playerId + " " + err);
  }
}

const getNextRoom = async (roomId) => {

  try {
    let response = await $.get("/api/next/" + roomId)
    return await response;

  } catch (err) {
    console.log("Failed to get the next room with roomId: " + roomId);
  }
}

const getOptions = async (optionListId) => {

  try {
    let response = await $.get("/api/options/" + optionListId)
    return await response;

  } catch (err) {
    console.log("Failed to get options with id: " + OptionListId);
  }
}

const getResponses = async (responseId) => {

  try {
    let response = await $.get("/api/responses/" + responseId)
    return await response;
  } catch (err) {
    console.log("Failed to get response with id: " + responseId);
  }

}

const getItem = async (itemId) => {

  try {
    let response = await $.get("/api/item/" + itemId)
    return await response;
  } catch (err) {
    console.log("Failed to get item with id: " + itemId);
  }
}

const setItem = async (playerId, itemId) => {

  try {
    let response = await $.post("/api/player/", { PlayerId: playerId, ItemId: itemId })
    return await response;
  } catch (err) {
    console.log("Failed to set item to player");
  }
}


/* #endregion End Game API call section*/


/* #region Game loop section  */

const loadGame = async (playerId) => {
  $("#textScroller").append("\n ~-------------------------------------~ \n");

  //get player info to start from id in URL and store in currentPlayer global var
  const gotPlayer = await getPlayer(playerId);
  console.log(gotPlayer);
  currentPlayer = new Player(gotPlayer.PlayerId, gotPlayer.Name, gotPlayer.TeamId, gotPlayer.ItemId, gotPlayer.Lives, gotPlayer.Gold);


  //get initial room to start and store in currentRoom global var
  const gotRoom = await getStartingRoom();
  currentRoom = new Room(gotRoom.RoomId, gotRoom.RoomName, gotRoom.EnterText, gotRoom.OptionListId);

  //load entrance text to page and update UI
  updateEnterText(currentRoom.enterText);

  $("#textScroller").append("\n ~-------------------------------------~ \n");
  $("#textScroller").scrollTop($("#textScroller").prop("scrollHeight"));

  //update UI elements based on player status
  updatePlayerElements(currentPlayer);

  // get options for player based on starting room optionlist
  const gotOptions = await getOptions(currentRoom.optionListId);
  gotOptions.forEach(element => {
    currentOptions.push(new GameOptions(element.OptionId, element.OptionText, element.OptionListId, element.ResponseId, element.ReqItemId));
  });

  //load options onto page for player
  updateOptions(currentOptions);


  //console.log("currentOptions are " + currentOptions);
  logObjectInfo();
}

//Game loop
const gameLoop = async (optionResponseId) => {
  var optionGrab;
  currentOptions = [];

  const gotResponse = await getResponses(optionResponseId);
  questionResponse = new GameResponse(gotResponse.ResponseId, gotResponse.ResponseText, gotResponse.OptionListId, gotResponse.isDoorway, gotResponse.goldMultiplier, gotResponse.isDeath, gotResponse.NewItemId);

  updateResponse(questionResponse.responseText);  

  if (questionResponse.goldMultiplier > 0) {
    scoreGold(gotResponse.goldMultiplier, currentPlayer);
  }

  $("#textScroller").append("\n ~-------------------------------------~ \n");
  $("#textScroller").scrollTop($("#textScroller").prop("scrollHeight"));

  if (questionResponse.isDeath) {
    //we have a place in db to store lives, but not necessary @version1
    currentPlayer.lives -= 1;
    currentPlayer.itemId = null;
    updatePlayerElements(currentPlayer);
    if (currentPlayer.lives <= 0) {
      dead();
    }
    else {
      //get initial room to start and store in currentRoom global var
      const gotRoom = await getStartingRoom();
      currentRoom = new Room(gotRoom.RoomId, gotRoom.RoomName, gotRoom.EnterText, gotRoom.OptionListId);

      updateNewRoom(currentRoom.roomId);


      //load entrance text to page and update UI
      updateEnterText(currentRoom.enterText);

      $("#textScroller").append("\n ~-------------------------------------~ \n");
      $("#textScroller").scrollTop($("#textScroller").prop("scrollHeight"));

      //update UI elements based on player status
      updatePlayerElements(currentPlayer);

      // get options for player based on starting room optionlist
      const gotOptions = await getOptions(currentRoom.optionListId);
      gotOptions.forEach(element => {
        currentOptions.push(new GameOptions(element.OptionId, element.OptionText, element.OptionListId, element.ResponseId, element.ReqItemId));
      });

      //load options onto page for player
      updateOptions(currentOptions);
    }
  }
  console.log("questionResponse is: " + objInfo(questionResponse));
  console.log(questionResponse.newItemId);
  if (questionResponse.newItemId !== null) {
    console.log("I made it here")
    currentPlayer.itemId = questionResponse.newItemId;
    updatePlayerItem(currentPlayer.itemId);
  }

  if (questionResponse.isDoorway > 0) {
    var newRoomId = currentRoom.roomId + questionResponse.isDoorway;
    console.log(newRoomId);
    const gotRoom = await getNextRoom(newRoomId);
    currentRoom = new Room(gotRoom.RoomId, gotRoom.RoomName, gotRoom.EnterText, gotRoom.OptionListId);
    optionGrab = currentRoom.optionListId;

    updateNewRoom(currentRoom.roomId);
    updateEnterText(currentRoom.enterText);
    $("#textScroller").scrollTop($("#textScroller").prop("scrollHeight"));

  }
  else {
    optionGrab = questionResponse.optionListId;
  }

  const gotOptions = await getOptions(optionGrab);
  gotOptions.forEach(element => {
    if(currentPlayer.itemId !== 1 && element.ReqItemId === 4) { //bandaid fix for design change on carried items
      console.log(currentPlayer.itemId + " " + element.ReqItemId)
      currentOptions.push(new GameOptions(element.OptionId, element.OptionText, element.OptionListId, element.ResponseId, element.ReqItemId));
    }
    else if(currentPlayer.itemId === element.ReqItemId) {
      currentOptions.push(new GameOptions(element.OptionId, element.OptionText, element.OptionListId, element.ResponseId, element.ReqItemId));
    }
    else if(element.ReqItemId == null) {
      currentOptions.push(new GameOptions(element.OptionId, element.OptionText, element.OptionListId, element.ResponseId, element.ReqItemId));
    }
  });

  //load options onto page for player
  updateOptions(currentOptions);

  //update UI elements based on player status
  updatePlayerElements(currentPlayer);

}


/* #endregion End game loop section*/


/* #region  Helper section */


function objInfo(object) {
  const objInfo = Object.entries(object);
  var stringified = "";

  objInfo.forEach(element => {
    let key = element[0];
    let value = element[1];

    stringified = stringified + key + ":" + value + "\n";
  });

  return stringified;
}

function logObjectInfo() {
  var count = 1;
  console.log("currentPlayer is " + objInfo(currentPlayer));
  console.log("currentRoom is " + objInfo(currentRoom));
  currentOptions.forEach(element => {
    console.log("currentOption " + count + " is: " + objInfo(element));
    count++;
  });
  console.log("questionResponse is: " + objInfo(questionResponse));
}



/* #endregion End Helper section*/

/* #region  Listener section */


$("button#next").on("click", function () {
  event.preventDefault();
  //get selected response value and parse out 
  // if($("input:checked").typeof != undefined) 
  // {
    var optionResponseId = $("input:checked").val().split('_')[1];
    console.log(optionResponseId);
    gameLoop(optionResponseId);
  // } 

});

var l = 1;
//this will cycle room images on submit
$("button#nextRoom").on("click", function () {
  event.preventDefault();

  var roomImageId = ["room1", "room2", "room3", "room4", "room5"];
  var roomImage = ["Great Hall", "Library", "Guard Chamber", "Solar", "Chapel"];
  var j = Math.floor(Math.random() * 5);
  $("img.room").attr("id", roomImageId[l]);
  $("p#roomName").text(roomImage[l]);
  l++;
});

var k = 0;
//this will cycle item images on submit
$("button#nextItem").on("click", function () {
  event.preventDefault();
  var items = ["toaster", "crossbow", "sword", "none", "golden_toaster", "golden_crossbow", "golden_sword"];
  var itemName = ["Toaster", "Crossbow", "Sword", "Nothing", "Golden Toaster", "Golden Crossbow", "Golden Sword"];

  $("img.item").attr("src", "/assets/images/" + items[k] + ".png");
  $("p.item").text(itemName[k]);
  if (k === 7) {
    k = 0;
  } else {
    k++;
  }
});

/* #endregion End Listener section*/

// ***Test if jQuery is loading properly***
window.onload = function () {
  if (window.jQuery) {
    console.log('jQuery is loaded');
  }
}
