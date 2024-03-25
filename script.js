const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    { name : "C++", image: "c++.png" },
    { name : "csharp", image: "csharp.png" },
    { name : "css", image: "css.png" },
    { name : "html", image: "html.png" },
    { name : "javascript", image: "java script.png" },
    { name : "java", image: "java.png" },
    { name : "python", image: "python.png"} ,
    { name : "MySQL", image: "sql.png" },
    { name : "swift", image: "swift.png" },
    { name : "php", image: "swift.png" },
    { name : "typescript", image: "typescript.png" },
    { name : "xml", image: "xml.png" },
];

//inisialisasi waktu
let seconds = 0,
  minutes = 0;
//inisialiasi perpindahan dan perhitungan menang
let movesCount = 0,
  winCount = 0;

//timer
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format timer sebelum ditampilkan
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//kalkulasi perpindahan
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects dari items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //inisialisasi cardValues array
  let cardValues = [];
  //size berukuran (4*4 matrix) /2 pasangan
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //pengacakan
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (kartu tertutup)
        after => back side (berisi gambar);
        data-card-values berisi atribut acak yang mengandung elemen gambar untuk dicocokkan
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Jika kartu yang dipilih belum cocok, maka jalankan saja (misal, kartu yang sudah cocok saat diklik akan diabaikan)
      if (!card.classList.contains("matched")) {
        //membalik kartu yang telah diklik
        card.classList.add("flipped");
        if (!firstCard) {
          //menjadi kartu pertama
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          //value kartu kedua
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //apabila kartu cocok maka akan diabaikan nantinya 
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //setel kartu pertama sbg false karena kartu selanjutnya akan jadi yang pertama 
            firstCard = false;
            //poin menang bertambah
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2> You Won </h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //apabila kartu tidak cocok 
            //balik kartu ke posisi semula
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
 
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial perpindahan 
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize nilai and fungsi
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};