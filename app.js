// creates random colors for left and right boxes. Second color has an opacity
// of 0.1 higher or lower than the first box.
function randomColors() {
    colors = new Color();
    $('.color-1').css('background-color', colors.firstColor);
    $('.color-2').css('background-color', colors.secondColor);
};

//finds the opacity used for comparing between the selected color and the nonselected
function findOpacity(target) {
    return target.css('background-color').split(',')[3].trim();
};

//resets border color to black. Used for reseting games
function borderReset(target) {
    return target.css('border', '2px solid black')
};

function changeScore() {
    $('#score').html(currentGame.score);
};

// changes the color of the timer box depending on time remaining
function timerColor() {
    if (currentGame.remainingTime > 200) {
        $('#timer-box').css('background-color', 'green');
    }else if (currentGame.remainingTime > 100) {
        $('#timer-box').css('background-color', 'yellow');
    }else {
        $('#timer-box').css('background-color', 'red');
    };
};

// stops the timer
function clearTimer (intervalId) {
    clearInterval(intervalId);
};

//runs the timer, changes timer box color, and resets game when time runs out
function timer () {
    var intervalId = setInterval(function() {
        if (currentGame.remainingTime > 0) {
            $('#timer').html(currentGame.remainingTimeString);
            timerColor();
        } else {
            $('#timer').html('0');
            clearTimer(intervalId);
            $('.color-1').css('background', 'black');
            $('.color-2').css('background', 'black');
            $('.color-1').css('border', '2px solid black');
            $('.color-2').css('border', '2px solid black');
            $('.color-1').html('GAME');
            $('.color-2').html('OVER!');
        };
    }, 100);
};

//compares selected color to unselected. Depending on outcome (darker or lighter color selected), makes appropriate game changes
//including adding/subtracting points, style changes, and changes to the timer
function selectionChecker (event) {
    var $target = $(event.target)

// Checks if correct box is clicked based on opacity. Incements/ decrements score.
    if (currentGame.remainingTime >= 0) {
        if ($target.hasClass('color-1')){
            if (colors.leftOpacity > colors.rightOpacity) {
                currentGame.addPoint();
                currentGame.addTime();
                $('.color-1').css('border', '10px solid #2DFA56');
                borderReset($('.color-2'));
                changeScore();
            }else{
                currentGame.subtractPoint();
                currentGame.subtractTime();
                $('.color-1').css('border', '10px solid #F33F1B');
                borderReset($('.color-2'));
                changeScore();
            };
        }else if ($target.hasClass('color-2')){
            if (colors.rightOpacity > colors.leftOpacity){
                currentGame.addPoint();
                currentGame.addTime();
                $('.color-2').css('border', '10px solid #2DFA56');
                borderReset($('.color-1'));
                changeScore();
            }else {
                currentGame.subtractPoint();
                currentGame.subtractTime();
                $('.color-2').css('border', '10px solid #F33F1B');
                borderReset($('.color-1'));
                changeScore();
            };
        };
        $('#level').html(currentGame.level);
        randomColors();
    };
};

//creates a new game objects and resets styles and game properties
function newGame () {
    currentGame = new Game();
    randomColors();
    changeScore();
    $('#level').html(currentGame.level);
    $('.colors-box').css('border', 'none');
    $('.color-1').html('');
    $('.color-2').html('');
    borderReset($('.color-1'));
    borderReset($('.color-2'));
    timer();
};

class Color {
    constructor() {
        this.red = Math.round(Math.random() * 256);
        this.green = Math.round(Math.random() * 256);
        this.blue = Math.round(Math.random() * 256);
        this.leftOpacity = (Math.floor(Math.random() * 8) + 2 );
        this.rightOpacity = secondOpacity(this.leftOpacity);

        function secondOpacity(firstOpacity){
// creates random boolean used to mix order of darker and lighter colors (left or right side)
            var randomBoolean = Math.random() >= 0.5;
            var opacity = firstOpacity;
// checks if boolean is true or false and then adds or subtracks 0.1 from opacity
//If opacity >= 0.9 it subtracts
            if (randomBoolean || opacity >= 9) {
                 return opacity -= 1;
            } else {
                return opacity += 1;
            };
        };
    };

    get firstColor() {
        return this.calcFirstColor();
    };

    get secondColor() {
        return this.calcSecondColor();
    };

    calcFirstColor() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue +
        ",0." + this.leftOpacity + ")";
    };

    calcSecondColor() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + ",0." +
        this.rightOpacity + ")";
    };
};

class Game {
    constructor() {
        this.endTime = Date.now() + 15000;
        this.score = 0;
    };

    get level() {
        return this.calcLevel();
    };

    get remainingTime() {
        return this.calcRemainingTime();
    };

    get remainingTimeString() {
        return this.calcRemainingTimeString();
    }
// adds time depending on level
    addTime() {
        var level = this.calcLevel();
        if (level == 1) {
            this.endTime += 2000;
        } else if (level == 2) {
            this.endtime += 1500;
        } else if (level == 3) {
            this.endtime += 1200;
        } else if (level == 4) {
            this.endtime += 900;
        } else if (level == 5) {
            this.endtime += 700;
        } else {
            this.endtime += 500;
        };
    };

//subtracts two seconds from time
    subtractTime() {
        this.endTime -= 2000;
    };

//returns amount of time left in game in 10th's of a second
    calcRemainingTime() {
        return (Math.round((currentGame.endTime - Date.now()) / 100));
    };

    calcRemainingTimeString() {
        var remainingTimeString = (Math.round((this.endTime - Date.now()) / 100)).toString();
        var secondRemaining = remainingTimeString.slice(0,-1);
        var tenths = remainingTimeString.slice(-1);
        return secondRemaining + "." + tenths;
    };

    addPoint() {
        this.score ++;
    };

    subtractPoint() {
        this.score --;
    };

    calcLevel() {
        if (this.score < 10) {
            return 1;
        } else if (this.score < 20) {
            return 2;
        } else if (this.score < 30) {
            return 3;
        } else if (this.score < 40) {
            return 4;
        } else if (this.score < 50) {
            return 5;
        } else {
            return 6;
        };
    };
};

$('.colors-box').on('click', function (event){
    selectionChecker(event);
});
