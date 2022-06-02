///////////////////// AUDIO INITIALIZATION ///////////////////////////////////////////////////////////////
const audio = new Audio("Swing_Music_by_LSmith.mp3"); //gives me a 404 error on line "favicon.ico.1" when I use audio; doesn't seem to affect anything; learned this is a Chrome-only error and I have to adding a specific line to my HTML file (it's on line 9)

//provided by Zapsplat.com
const cheer = new Audio("human_crowd_approx_150_people_cheer_indoors.mp3");
const dropBeads = new Audio(
  "zapsplat_foley_bead_plastic_small_single_drop_onto_plastic_004_69840.mp3"
);
const pickUpBeads = new Audio(
  "zapsplat_foley_money_coins_handful_handling_movement_single_hand_001_43249.mp3"
);
const endTurn = new Audio("julien_matthey_foley_movie_clapperboard.mp3");

///////////////////// STATE ///////////////////////////////////////////////////////////////
//in initial state, board should be set with 0s and 4s, winning/tie/turn messages should be erased, and input boxes should be cleared of contents

const holesArray = Array.from(document.querySelectorAll(".hole")); //. because uses CSS selectors and its a class; use Array.from because collections aren't true arrays

function createBoard() {
  const board = {
    //starts from id1 counter clockwise to id2
    P1Hole: 0,
    P2Hole: 0,
    holes: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  };

  return board;
}

function buildInitialState() {
  const initialState = {
    numHeld: 0,
    amtInHole: 0,
    holeClicked: "", //might need to be changed to 0 var type
    board: createBoard(), //grabs board from function createBoard
    isPlaying: false,
  };

  for (let i = 0; i < initialState.board.holes.length; i++) {
    holesArray[i].innerText = initialState.board.holes[i]; //confirmed that this can't be .value, must be .innerHTML or .innerText
    // holesArray[i].dataset.jellyCount = initialState.board.holes[i]; // I don't think dataset is good here. Upon research, element.dataset.jellyCount will ALWAYS be converted to a string. I'm guessing that's why I can't add or subtract with it.
  }
  //array has id's arranged like so: [1,2,3,7,8,9,4,5,6,10,11,12]

  //make goal holes their own thing
  const P1Hole = document.getElementById("P1Hole");
  const P2Hole = document.getElementById("P2Hole");
  P1Hole.innerHTML = initialState.board.P1Hole;
  P2Hole.innerHTML = initialState.board.P2Hole;
  // P1Hole.dataset.jellyCount = initialState.board.P1Hole;
  // P2Hole.dataset.jellyCount = initialState.board.P2Hole;

  //remove pop-up messages
  document.getElementById("turnOrder").style.display = "none";
  document.getElementById("winnerMessage").style.display = "none";
  document.getElementById("tieMessage").style.display = "none";

  return initialState;
}
let state = buildInitialState();
// document.querySelector('.hole').innerText = 100000;

const cursor = document.querySelector(".cursorNum");
cursor.innerText = state.numHeld;

///////////////////// UTILITY ///////////////////////////////////////////////////////////////
//reset button
const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  state.numHeld = 0;
  cursor.innerText = state.numHeld;
  currentCursorColor = "black";
  state = buildInitialState();
  Array.from(document.querySelectorAll("input")).forEach((input) => {
    input.value = "";
  });
});

///////////////////// START GAME ///////////////////////////////////////////////////////////////
//upon the start of the game, the player can choose one of the six holes located on "their" side of the board (id's 1-3,7-9 for P1 and id's 4-6,10-12 for P2). They can then only click one hold over in a counter-clockwise direction. If it's P1's turn, the cycle includes P1Hole but not P2Hole; same-but-opposite for P2's turn.
let currentTurn = 0; //1 will equal P1's turn, 0 will equal P2's turn
let currentCursorColor = ""; //for changing cursor color per turn
let turnCounter = 0; //counts number of turns, starting at 1 when the game starts

const startBtn = document.getElementById("startGame");

startBtn.addEventListener("click", () => {
  audio.play();
  turnOrder();

  state.isPlaying = true;
  turnCounter = 1;
});

let player1Input = "";
let player2Input = "";

function turnOrder() {
  //grab names
  //if P2's input box is blank, enter CPU mode
  //don't start game if P1's input box is blank
  player1Input = document.getElementById("player1").value;

  if (!player1Input) {
    return;
  }

  player2Input = document.getElementById("player2").value;

  if (!player2Input) {
    player2Input = "CPU"; //while P2 will be called "CPU", no CPU functionality has been written at this time
    // Ideally: if in "CPU Mode", P2's turn will be automatic/random, passing back to P1's turn once it finishes
  }

  //randomly decide who goes first, P1 or P2
  let randomNum = Math.floor(Math.random() * 2);

  document.getElementById("turnOrder").style.display = "flex";

  if (randomNum) {
    document.getElementById("turnOrder").innerHTML = `${player1Input}'s turn`;
    currentTurn = 1;
    document.querySelector(".cursorNum").style.color = "aqua";
    currentCursorColor = "aqua";
  } else {
    document.getElementById("turnOrder").innerHTML = `${player2Input}'s turn`;
    currentTurn = 0;
    document.querySelector(".cursorNum").style.color = "red";
    currentCursorColor = "red";
  }
}

///////////////////// GAMEPLAY ///////////////////////////////////////////////////////////////
function changeTurn() {
  turnCounter += 1;

  if (currentTurn === 1) {
    currentTurn = 0;
    document.getElementById("turnOrder").innerHTML = `${player2Input}'s turn`;
    currentCursorColor = "red";
  } else if (currentTurn === 0) {
    currentTurn = 1;
    document.getElementById("turnOrder").innerHTML = `${player1Input}'s turn`;
    currentCursorColor = "aqua";
  }
}

///////////////////// TESTING ZONE ///////////////////////////////////////////////////////////////
// const countDownNum = document.getElementById("testClicks");
// countDownNum.addEventListener("click", (event) => {
//   event.target.innerText -= 1; //WORKS! increments 5 down by 1 with each click
//   document.querySelector(".cursorNum").innerText += 1; //treats cursor.innerText as a string and adds 1 to the end (i.e. 011...). Need to switch to a number...????
// });
///////////////////// TESTING ZONE ///////////////////////////////////////////////////////////////

//controls what happens when you click on a little or big hole
let gameboardFull = document.getElementById("gameBoardFull");
gameboardFull.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("hole") ||
    event.target.id === "P1Hole" ||
    event.target.id === "P2Hole"
  ) {
    //if what you clicked "contains" hole or has id of P1Hole or P2Hole
    let { amtInHole, holeClicked } = state;

    amtInHole = Number(event.target.innerText);
    holeClicked = event.target;
    handleTurn(amtInHole, holeClicked);
  }
});

//might have to make if statement for little holes and big holes separately
function handleTurn(amtInHole, holeClicked) {
  if (!state.isPlaying) {
    console.log("No cheating! :)");
    return;
  }

  let { numHeld } = state;

  // console.log(`I'm currently holding ${numHeld} beans`);
  // console.log(typeof amtInHole);
  // console.log(typeof numHeld);
  // console.log(`this hole has ${amtInHole} beans inside`);
  // console.log(
  //   `the hole we're currently talking about is hole ${holeClicked.id}`
  // );
  //success: each click, we know what you're currently holding, how many beans are in this hole, and which id number this hole is

  //direction example starting at id1 and it's P1's turn and holding 4 marbles:
  //      id1>P1Hole>id7>id8>id9
  //      where now id1=0, P1Hole=1, id7=5, id8=5, and id9=5
  //currently not implemented as a strict, "the computer won't let you do anything else" rule

  //CURRENT STATE: Success!!
  if (numHeld === 0 && !holeClicked.classList.contains("hole")) {
    //prevents picking up beans from either mancala
    return;
  } else if (numHeld === 0 && amtInHole > 0) {
    //picks up all beans in hole
    playPickUp();
    state.numHeld = amtInHole;
    amtInHole = 0;
    holeClicked.innerText = amtInHole;
  } else if (
    numHeld === 1 &&
    amtInHole === 0 &&
    holeClicked.id !== "P1Hole" &&
    holeClicked.id !== "P2Hole"
  ) {
    //turn ends, switches to other player's turn
    playDropEffect();
    playEndTurn();
    state.numHeld -= 1;
    amtInHole += 1;
    holeClicked.innerText = amtInHole;
    // console.log(`that was player ${currentTurn}'s turn`);
    changeTurn();
    // console.log(`now it's player ${currentTurn}'s turn`);
  } else if (numHeld > 0 && amtInHole >= 0) {
    //drops one bean into hole from your hand; includes dropping your last bean into your mancala (which doesn't end your turn)
    playDropEffect();
    state.numHeld -= 1;
    amtInHole += 1;
    holeClicked.innerText = amtInHole;
  } else if (numHeld === 0 && amtInHole === 0) {
    //nothing happens
    return;
  } else {
    //for edge cases
    console.log("error");
    return;
  }

  cursor.innerText = state.numHeld; //successfully changes cursor to reflect numHeld

  checkWin(player1Input, player2Input);
}

//functions that play sound effect files
function playDropEffect() {
  dropBeads.play();
  dropBeads.currentTime = 0; //prevents sound from not playing if you click faster than the audio file has time to finish
}
function playPickUp() {
  pickUpBeads.play();
  pickUpBeads.currentTime = 0;
}
function playEndTurn() {
  //creates delay between "dropping beans" and "switching turns"
  setTimeout(function () {
    endTurn.play();
  }, 200);
  endTurn.currentTime = 0;
}

///////////////////// WIN CONDITION ///////////////////////////////////////////////////////////////
//game ends when all little holes are empty BUT ONLY directly after a player's turn. At end of turn, call this function and return win as true if the game should end or as false if game should continue.

function checkWin(player1Input, player2Input) {
  let win = false;

  let combinedBigHoles = Number(P1Hole.innerText) + Number(P2Hole.innerText);

  if (combinedBigHoles === 48) {
    console.log("game is finished!");
    document.getElementById("turnOrder").style.display = "none"; //removes turn statement
    state.isPlaying = false; //prevents further play

    //stop music and play cheering sound effect
    audio.pause();
    audio.currentTime = 0;

    cheer.play();
    cheer.volume = 0.5;

    if (P1Hole.innerText > P2Hole.innerText) {
      document.getElementById("winnerMessage").style.display = "flex";

      if (turnCounter === 1) {
        document.getElementById(
          "winnerMessage"
        ).innerHTML = `${player1Input} won!! This game took ${turnCounter} turn. Click "Reset" to try again.`;
      } else {
        document.getElementById(
          "winnerMessage"
        ).innerHTML = `${player1Input} won!! This game took ${turnCounter} turns. Click "Reset" to try again.`;
      }
    }

    if (P1Hole.innerText < P2Hole.innerText) {
      document.getElementById("winnerMessage").style.display = "flex";

      if (turnCounter === 1) {
        document.getElementById(
          "winnerMessage"
        ).innerHTML = `${player2Input} won!! This game took ${turnCounter} turn. Click "Reset" to try again.`;
      } else {
        document.getElementById(
          "winnerMessage"
        ).innerHTML = `${player2Input} won!! This game took ${turnCounter} turns. Click "Reset" to try again.`;
      }
    }

    if (P1Hole.innerText === P2Hole.innerText) {
      document.getElementById("tieMessage").style.display = "flex";
      if (turnCounter === 1) {
        document.getElementById(
          "tieMessage"
        ).innerHTML = `It's a tie! This game took ${turnCounter} turns. Click "Reset" to try again.`;
      } else {
        document.getElementById(
          "tieMessage"
        ).innerHTML = `It's a tie! This game took ${turnCounter} turns. Click "Reset" to try again.`;
      }
    }

    win = true;
    return win;
  } else {
    // console.log("game is ongoing");
    return win;
  }
}

//used by Lauren to test if win condition was working correctly
function testWin() {
  for (let i = 0; i < 12; i++) {
    holesArray[i].innerHTML = 0;
  }

  P1Hole.innerText = 23;
  P2Hole.innerText = 25;

  //for the purposes of this test
  const player1Name = "Johnny";
  const player2Name = "Bravo";

  checkWin(player1Name, player2Name);
}
// testWin();

///////////////////// LAUREN'S NOTES ///////////////////////////////////////////////////////////////
//if player 2's input box is blank, go to CPU mode
//if player 1's input box is blank, do nothing
//grab names from input boxes and put them into turnOrder phrase
//game continues with same player if lastHoleClicked>0 or if lastHoleClicked=P1Hole or P2Hole
//if all little holes are empty, big hole with largest number wins; allow for a tie
//once it's co-op, give CPU a brain and try what a solo game would look like // not necessary for this assignment

///////////////////// CUSTOM CURSOR ///////////////////////////////////////////////////////////////
document.addEventListener("mousemove", (e) => {
  cursor.setAttribute(
    "style",
    "top: " +
      (e.pageY + 5 - scrollY) +
      "px; left: " +
      (e.pageX + 5 - scrollX) +
      "px;"
  );
  document.querySelector(".cursorNum").style.color = currentCursorColor;
});

//this might allow that number element to change in value?? right now it pulses the number element when a hole is selected
document.addEventListener("click", () => {
  cursor.classList.add("pickUp");
  setTimeout(() => {
    cursor.classList.remove("pickUp");
  }, 200);
});

///////////////////// AUDIO/VOLUME ///////////////////////////////////////////////////////////////
//initial volume
audio.volume = 0.5;
cheer.volume = 0.5;
dropBeads.volume = 0.5;
pickUpBeads.volume = 0.5;
endTurn.volume = 0.5;

//loops main music
audio.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);

//changes volumne on music and sound effects
let volume = document.querySelector("#volume-control");

volume.addEventListener("change", function (e) {
  audio.volume = e.currentTarget.value / 100;
  cheer.volume = e.currentTarget.value / 100;
  dropBeads.volume = e.currentTarget.value / 100;
  pickUpBeads.volume = e.currentTarget.value / 100;
  endTurn.volume = e.currentTarget.value / 100;
});
