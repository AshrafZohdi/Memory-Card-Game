const cards = document.querySelectorAll(".card");

let gameMode = "relaxed";
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timerInterval;
let elapsedTime = 0;
let countdownTime = 120;
let flipCount = 0;

// Function to show card previews for half a second
function previewCards() {
  // Flip all cards to show their images
  cards.forEach((card) => {
    card.classList.add("flip");
  });

  // Schedule a timeout to hide the cards after half a second (500 milliseconds)
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("flip");
    });
  }, 500); // Adjust the duration as needed
}

// Function to update the timer display
function updateTimer() {
  const timerElement = document.getElementById("timer");

  if (gameMode === "challenge") {
    if (countdownTime <= 0) {
      // Timer reached zero, end the game in challenge mode
      clearInterval(timerInterval);
      disableDeck = true; // Disable further card clicks
      setTimeout(() => {
        // Display a game-over message
        alert("Game Over - Challenge Mode");
      }, 1000); // Wait for 1 second before showing the message
    } else {
      const minutes = Math.floor(countdownTime / 60);
      const seconds = countdownTime % 60;
      const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      timerElement.textContent = formattedTime;
      countdownTime--; // Decrease the countdown time

      // Check if the player has matched all cards (beat the challenge)
      if (matched == 8) {
        clearInterval(timerInterval); // Stop the timer
        // Display a message or perform any other actions for completing the challenge
        alert("Challenge Completed! Timer Reset.");
        resetGame(); // Reset the game, including the timer
      }
    }
  } else if (gameMode === "relaxed") {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    timerElement.textContent = formattedTime;
    elapsedTime++; // Increase elapsed time
  }
}

// Function to increment the flip counter
function incrementFlipCounter() {
  flipCount++;
  const flipCounterElement = document.getElementById("flip-count");
  flipCounterElement.textContent = flipCount;
}

// Add event listeners to cards to count flips and start the timer
cards.forEach((card) => {
  card.addEventListener("click", function () {
    if (!disableDeck && !this.classList.contains("flip")) {
      incrementFlipCounter();
    }
  });
});

function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
    // Start the timer based on the selected game mode
    if (gameMode === "challenge" && !timerInterval) {
      timerInterval = setInterval(updateTimer, 1000);
    } else if (gameMode === "relaxed" && elapsedTime === 0) {
      timerInterval = setInterval(updateTimer, 1000);
    }
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matched++;
    if (matched == 8) {
      setTimeout(() => {
        return resetGame();
      }, 1000);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `images/img-${arr[i]}.png`;
    card.addEventListener("click", flipCard);
  });
}

function resetGame() {
  // Stop the timer interval and reset elapsed time
  clearInterval(timerInterval);
  elapsedTime = 0;

  // Reset flip counter
  flipCount = 0;
  const flipCounterElement = document.getElementById("flip-count");
  flipCounterElement.textContent = flipCount;

  // Reset the matched count
  matched = 0;

  previewButton.disabled = false;

  // Reset the countdown time for challenge mode
  if (gameMode === "challenge") {
    countdownTime = 120; // Reset the countdown time to 2 minutes (or your desired initial time)
  }

  // Shuffle the cards and reset their state
  shuffleCard();

  // Start the timer based on the selected game mode
  if (gameMode === "challenge") {
    timerInterval = setInterval(updateTimer, 1000);
  } else if (gameMode === "relaxed" && elapsedTime === 0) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

const relaxedModeRadio = document.getElementById("relaxed-mode");
const challengeModeRadio = document.getElementById("challenge-mode");

relaxedModeRadio.addEventListener("change", function () {
  if (gameMode !== "relaxed") {
    gameMode = "relaxed";
    resetGame();
  }
});
challengeModeRadio.addEventListener("change", function () {
  if (gameMode !== "challenge") {
    gameMode = "challenge";
    resetGame();
  }
});

// Add a click event listener to the "Preview" button
const previewButton = document.getElementById("preview-button");
previewButton.addEventListener("click", function () {
  // Check if any cards are currently flipped (game in progress)
  const flippedCards = document.querySelectorAll(".card.flip");
  if (flippedCards.length === 0) {
    // No cards are flipped, so you can proceed with the preview
    // Disable the "Preview" button to prevent multiple clicks
    previewButton.disabled = true;

    // Call the function to show card previews
    previewCards();
  } else {
    // Cards are flipped, so the button remains disabled
    alert("Finish your current game before using the preview feature.");
  }
});

// Add a click event listener to the reset button
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

shuffleCard();

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
