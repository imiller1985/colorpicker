// creates random colors for left and right boxes. Second color has an opacity
// of 0.1 higher or lower than the first box
function randomColors() {
    var colors = new Color();
    $('.color-1').css('background-color', colors.firstColor);
    $('.color-2').css('background-color', colors.secondColor);
};

    function findOpacity(target) {
        return target.css('background-color').split(',')[3].trim();
    };

function selectionChecker (event) {
// DRY function for finding opacity level
    var $target = $(event.target)

    function borderReset(target) {
        return target.css('border', '2px solid black')
    };

    function scoreBoxColor() {
        console.log(currentGame.score)
        if (currentGame.score > 10) {
            $('#score-box').css('background-color', 'red');
        }
    };
// Checks if correct box is clicked. Incements/ decrements score.
    if (currentGame.remainingTime >= 0) {
        if ($target.hasClass('color-1')){
            var opacityClicked = findOpacity($target);
            var otherOpacity = findOpacity($('.color-2'));
            if (opacityClicked > otherOpacity) {
                currentGame.addPoint();
                currentGame.addTime();
                $('.color-1').css('border', '10px solid #2DFA56');
                borderReset($('.color-2'));
                $('#score').html(currentGame.score);
            }else{
                currentGame.subtractPoint();
                currentGame.subtractTime();
                $('.color-1').css('border', '10px solid #F33F1B');
                borderReset($('.color-2'));
                $('#score').html(currentGame.score);
            };
        }else if ($target.hasClass('color-2')){
            var opacityClicked = findOpacity($target);
            var otherOpacity = findOpacity($('.color-1'));
            if (opacityClicked > otherOpacity){
                currentGame.addPoint();
                currentGame.addTime();
                $('.color-2').css('border', '10px solid #2DFA56');
                borderReset($('.color-1'));
                $('#score').html(currentGame.score);
            }else {
                currentGame.subtractPoint();
                currentGame.subtractTime();
                $('.color-2').css('border', '10px solid #F33F1B');
                borderReset($('.color-1'));
                $('#score').html(currentGame.score);
            };
        };
        randomColors();
        $('#level').html(currentGame.level);
    };
};

function newGame () {
    currentGame = new Game();
    var backgroundColor = 0;
    randomColors();
//resets the color box scores, borders, and text
    $('#score').html(currentGame.score);
    $('#level').html(currentGame.level);
    $('.colors-box').css('border', 'none');
    $('.color-1').html('');
    $('.color-2').html('');
    timer();

// changes the color of the timer box depending on time remaining
    function timerColor(rgb, previousTime) {
        // var backgroundColor = [250,0,0];
        var difference = currentGame.remainingTime - previousTime;
        if (rgb[1] >= 0 && rgb[1] < 250) {
            rgb[1] += difference * 2;
        }else if (rgb[0] > 0) {
            rgb[0] += difference * 20;
        };
        console.log(rgb[1]);

        var timerColor = rgb.toString();
        $('#score-box').css('background-color', '(' + timerColor + ')');

        return rgb;
    };
//runs the timer
    function timer () {
        var intervalId = setInterval(function() {
            var rgb = [250,0,0];
            var previousTime = 150;
            var endTime = currentGame.endTime;
            var currentTime = Date.now();

            if (currentGame.remainingTime >= 0) {
                $('#timer').html(currentGame.remainingTimeString);
                rgb = timerColor(rgb, previousTime);
                previousTime = currentGame.remainingTime;
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
// stops the timer
        function clearTimer (intervalId) {
            clearInterval(intervalId);
        };
    };
};

class Color {
    constructor() {
        this.red = Math.round(Math.random() * 256);
        this.green = Math.round(Math.random() * 256);
        this.blue = Math.round(Math.random() * 256);
        this.leftOpacity = (Math.floor(Math.random() * 8) + 2 );
        this.rightOpacity = secondOpacity(this.leftOpacity);

        function secondOpacity(firstOpacity){
// creates random boolean used to
// used to keep order of brighter darker color random
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
//resets clock
    resetClock() {
        this.endTime += 10000;
    }
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
