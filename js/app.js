'use strict';

$(document).ready(function() {
    var start = true;
    var lastGuess = [];
    var count = 0;
    var startTime = 1;
    var remaining = 8;
    var matches = 0;
    var misses = 0;

    $('#newGame').click(function() {
        //initial start of the game
        if (!start) {
            $('#confirm-exit-modal').modal();
            stopTimer(startTime);
        } else {
            createGame();
            start = false;
        }
    }); // modal start game

    $('#confirm-restart-button').click(function() {
        newGame();
    }); //modal restart

    function clicker () {
        $('#game-board img').click(function () {
            var img = $(this);
            var tile = img.data('tile');

            if (count < 2 && !tile.flipped) {
                count++;
                flipAction(img, tile);
                if (count == 1 ) {
                    $('#charging').trigger('play');
                    lastGuess.push(img);
                    lastGuess.push(tile);
                    console.log(lastGuess);
                    //test for stop time
                    stopTimer(startTime);
                } else {
                    if (lastGuess[1].tileNum == tile.tileNum) {
                        matches++;
                        remaining--;
                        whatsMatch();
                        whatsLeft();
                        lastGuess.pop();
                        lastGuess.pop();
                        if (matches == 8) {
                            stopTimer(startTime);
                            //modal of some type
                            $('#victory').trigger('play');
                            $('#confirm-replay').modal();
                            $('#send-away').click(function() {
                                window.location = 'http://zelda.com/universe/?ref=https://www.google.com/';
                            });
                            $('#confirm-replay').click(function() {
                                newGame();
                            });
                        } else {
                            $('#correct').trigger('play');
                        }
                    } else { // not a match
                        $('#wrong').trigger('play');
                        window.setTimeout(function() {
                            flipAction(lastGuess[0], lastGuess[1]);
                            flipAction(img, tile);
                            lastGuess.pop();
                            lastGuess.pop();
                            console.log(lastGuess);
                            misses++;
                            whatsMissed();
                        }, 1000); //the code in here will run only once after 1 second has elapsed
                    }
                    // reset count
                    count = 0;
                }
            }

        }); //on click of gameboard images
    }
    function flipAction(img, tile) {
        //jquery functions besides tile.flipped
        img.slideUp(100, function () {
            if (tile.flipped) {
                //console.log(tile);
                img.attr('src', 'img/Triforce-back.jpg')
            } else {
                //console.log(tile);
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.slideDown(100);
        }); //after fadeOut
    }

    function createGame () {
        var tiles = [];
        var idx;
        for (idx = 1; idx <= 32; ++idx) {
            tiles.push({
                tileNum: idx,
                src: 'img/tile' + idx + '.jpg'
            });
        }
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0, 8);
        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });

        tilePairs = _.shuffle(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function (tile, elemIndex) {
            if (elemIndex > 0 && /* !(elemIndex % 4)*/0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/Triforce-back.jpg',
                alt: 'image of tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);
        clicker();
        timer();
    }

    // timer
    function timer() {
        startTime = _.now();
        var timer = window.setInterval(function () {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text(elapsedSeconds);

            if (elapsedSeconds >= 9999) {
                window.clearInterval(timer);
            }
        }, 1000);
    }

    function stopTimer(timer) {
        window.clearInterval(timer);
    }
    function whatsLeft() {
        $('#remaining').text(remaining);
    }
    function whatsMissed() {
        $('#misses').text(misses);

    }
    function whatsMatch() {
        $('#matches').text(matches);
    }
    function newGame() {
        $('#game-board').empty();
        $('#victory').trigger('pause');
        remaining = 8;
        matches = 0;
        misses = 0;
        createGame();
        whatsLeft();
        whatsMatch();
        whatsMissed();
        timer();
    }
}); //jQuery Ready Function