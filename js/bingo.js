const GAMEBOARD = [];
const MAXNUMBER = 75;
const COLUMNS = 5;
const IMAGECOUNT = 24;
const USEDIMAGES = [];
const POINTS = [];
const POINTMAX = 6;

var mouse = {
  x: 0,
  y: 0,
};

const MARQUEEMESSAGES = [
  "LEADERBOARD: 1. Damon Tindall (2), 2. Anthony Burkeen (1), 3. Mark Ohrin (1)",
  "DAMON IS LEADING? REALLY?",
];

var Dot = function () {
  this.x = 0;
  this.y = 0;
  this.node = (function () {
    var n = document.createElement("div");
    n.className = "trail";
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
  initializeMarquee();
  initializeMouseTrail();

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
    let column = $("#col-" + i);

    addCard(i, column, GAMEBOARD[i]);
  }
};

var drawMouseTrail = function () {
  var x = mouse.x;
  var y = mouse.y;

  POINTS.forEach(function (dot, index, dots) {
    var nextDot = dots[index + 1] || dots[0];

    dot.x = x + 10;
    dot.y = y + 10;
    dot.draw();
    x += (nextDot.x - dot.x) * 0.6;
    y += (nextDot.y - dot.y) * 0.6;
  });
};

var addCard = function (rowNumber, column, numbers) {
  //   var wait = 0;

  // TODO - sometime it would be fun to bring this in in some sort of pattern
  // numbers.forEach(function (obj, index, collection) {
  //   setTimeout(function () {
  //     createCard(index, rowNumber, column, obj.number);

  //     if (index == numbers.length - 1) {
  //       hookupListeners();
  //     }
  //   }, index * 150);
  // });

  for (var i = 0; i < numbers.length; i++) {
    createCard(i, rowNumber, column, numbers[i].number);
  }

  hookupListeners();
};

var createCard = function (rowNumber, columnNumber, column, number) {
  let cardElement = document.createElement("div");
  cardElement.id = "card-" + rowNumber + "-" + columnNumber;
  cardElement.className = number === "FREE" ? "card new free" : "card new";
  cardElement.innerHTML = number;
  column.appendChild(cardElement);
};

var onClickCard = function (element) {
  let id = element.target.id;
  let splitId = id.split("-");
  toggleChip(element.target, splitId[1], splitId[2]);
};

var toggleChip = function (card, row, column) {
  let selected = !GAMEBOARD[row][column].selected;

  GAMEBOARD[row][column].selected = selected;

  if (selected) {
    let isFree = GAMEBOARD[row][column].number === "FREE";

    if (isFree) {
      card.style.backgroundImage = 'url("images/chips/piece_free_chip.png")';
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

      card.style.backgroundImage =
        'url("images/chips/piece_chip_' + imgNumber + '.png")';
    }
  } else {
    card.style.backgroundImage = "";
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
