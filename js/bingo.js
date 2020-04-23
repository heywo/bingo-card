const GAMEBOARD = [];
const MAXNUMBER = 75;
const COLUMNS = 5;
const IMAGECOUNT = 24;
const USEDIMAGES = [];
const POINTS = [];
const POINTMAX = 1;
const IMG_PREFIX = "images/image_";
const IMG_FREE = "images/free_spot.png";
const HEAD_COUNT = 4;

const MARQUEE_ENABLED = false;
const MOUSETRAIL_ENABLED = true;

var mouse = {
  x: 0,
  y: 0,
};

const MARQUEEMESSAGES = [
  "AN EXAMPLE MARQUEE MESSAGE",
  "ANOTHER EXAMPLE MARQUEE MESSAGE",
];

var Dot = function () {
  this.x = 0;
  this.y = 0;
  this.node = (function () {
    var n = document.createElement("div");
    n.className = "trail";
    const imgNumber = getRandomNumber(1, HEAD_COUNT);
    n.style.backgroundImage = "url('images/head_" + imgNumber + ".png')";
    document.body.appendChild(n);
    return n;
  })();
};

Dot.prototype.draw = function () {
  this.node.style.left = this.x + "px";
  this.node.style.top = this.y + "px";
};

var initializeGameBoard = function () {
  let pickedNumbers = [];
  for (var i = 0; i < COLUMNS; i++) {
    var min = i * 15 + 1;
    let numbers = [];
    for (var j = 0; j < 5; j++) {
      if (i != 2 || j != 2) {
        var number = getRandomNumber(min, min + 14);
        while (pickedNumbers.some((a) => a == number)) {
          number = getRandomNumber(min, min + 14);
        }
        numbers.push({ number, selected: 0 });
        pickedNumbers.push(number);
      } else {
        numbers.push({ number: "FREE", selected: 0 });
      }
    }
    GAMEBOARD[i] = numbers;
  }

  renderGameBoard();

  if (MARQUEE_ENABLED) initializeMarquee();
  if (MOUSETRAIL_ENABLED) initializeMouseTrail();

  animateMouseTrail();
};

var initializeMarquee = function () {
  pickMarqueeMessage(0);
  setTimeout(function () {
    pickMarqueeMessage();
  }, 20000);
};

var initializeMouseTrail = function () {
  for (var i = 0; i < POINTMAX; i++) {
    var d = new Dot();
    POINTS.push(d);
  }

  document.addEventListener("mousemove", function (event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  });
};

var animateMouseTrail = function () {
  drawMouseTrail();
  requestAnimationFrame(animateMouseTrail);
};

var pickMarqueeMessage = function (index) {
  var randIndex = getRandomNumber(0, MARQUEEMESSAGES.length - 1);
  var marqueeText = document.getElementById("marquee-text");
  marqueeText.innerHTML = MARQUEEMESSAGES[index || randIndex];
};

var hookupListeners = function () {
  [].forEach.call(
    document.querySelectorAll(".card"),
    function (el) {
      el.onclick = onClickCard;
      el.classList.toggle("new");
      el.style.animation = "";
    },
    false
  );
};

var renderGameBoard = function () {
  for (var i = 0; i < COLUMNS; i++) {
    addCard(i);
  }
};

var drawMouseTrail = function () {
  var x = mouse.x;
  var y = mouse.y;

  POINTS.forEach(function (dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];

    dot.x = x;
    dot.y = y;
    dot.draw();
    x += (nextDot.x - dot.x) * 0.6;
    y += (nextDot.y - dot.y) * 0.6;
  });
};

var addCard = function (rowNumber) {
  for (var i = 0; i < COLUMNS; i++) {
    const number = GAMEBOARD[i][rowNumber];
    createCard(i, rowNumber, number.number);
  }

  hookupListeners();
};

var createCard = function (rowNumber, columnNumber, number) {
  let board = document.getElementById("board");
  let cardElement = document.createElement("div");
  let imgElement = document.createElement("img");
  imgElement.src = "";
  cardElement.id = "card-" + rowNumber + "-" + columnNumber;
  cardElement.className = number === "FREE" ? "card new free" : "card new";
  cardElement.innerHTML = number;
  cardElement.append(imgElement);
  board.appendChild(cardElement);
};

var onClickCard = function (element) {
  let id = element.target.id;
  let splitId = id.split("-");
  toggleChip(element.target, splitId[1], splitId[2]);
};

var toggleChip = function (card, row, column) {
  let selected = !GAMEBOARD[row][column].selected;

  GAMEBOARD[row][column].selected = selected;

  const img = card.children[0];

  if (selected) {
    let isFree = GAMEBOARD[row][column].number === "FREE";

    if (isFree) {
      img.src = IMG_FREE;
    } else {
      let imgNumber = getRandomNumber(1, IMAGECOUNT);
      while (
        USEDIMAGES.some((a) => a === imgNumber) &&
        USEDIMAGES.length < IMAGECOUNT + 1
      ) {
        imgNumber = getRandomNumber(1, IMAGECOUNT);
      }

      USEDIMAGES.push(imgNumber);
      GAMEBOARD[row][column].imageNumber = imgNumber;

      img.src = IMG_PREFIX + imgNumber + ".png";
    }
  } else {
    img.src = "";
    let index = USEDIMAGES.findIndex(
      (a) => a === GAMEBOARD[row][column].imageNumber
    );
    if (index > -1) {
      USEDIMAGES.splice(index, 1);
    }
  }

  card.classList.toggle("selected");
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var addPoint = function (x, y) {
  const point = new Point(x, y);
  POINTS.push(point);
};

var $ = function (selector) {
  return document.querySelector(selector);
};
