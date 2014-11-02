'use strict';

$(document).ready(function() {
    var start = true;
    var lastGuess = [];
    var count = 0;
    var startTime = 1;
    var remaining = 8;
    var matches = 0;
    var misses = 0;

    //new game button
    $('#newGame').click(function() {
        //initial start of the game
        if (!start) {
            $('#confirm-exit-modal').modal();
        } else {
            createGame();
            start = false;
        }

    }); // modal start game

    //modal function
    $('#confirm-restart-button').click(function() {
        $('#game-board').empty();
        createGame();
        if (startTime > 0) {
            clearInterval(startTime);
            timer();
        }
    }); //modal restart

    function clicker () {
        $('#game-board img').click(function () {
            var img = $(this);
            var tile = img.data('tile');


            if (count < 2 && !tile.flipped) {
                count++;
                flipAction(img, tile);
                //guess #1
                if (count == 1 ) {
                    lastGuess.push(img);
                    lastGuess.push(tile);
                    console.log(lastGuess);
                } else { //guess #2
                    // matching pair
                    if (lastGuess[1].tileNum == tile.tileNum) {
                        alert('You got a match!');
                        matches++;
                        console.log('matches '+matches);
                        remaining--;
                        console.log('remaining ' + remaining);
                        lastGuess.pop();
                        lastGuess.pop();
                        console.log(lastGuess);
                    } else { // not a match
                        console.log(lastGuess);
                        window.setTimeout(function() {
                            flipAction(lastGuess[0], lastGuess[1]);
                            flipAction(img, tile);
                            lastGuess.pop();
                            lastGuess.pop();
                            console.log(lastGuess);

                            //the code in here will run only once after 1 second has elapsed
                        }, 1000);

                    }
                    // reset
                    count = 0;
                }
            }

        }); //on click of gameboard images
    }
    function flipAction(img, tile) {
        //jquery functions besides tile.flipped
        img.fadeOut(100, function () {
            if (tile.flipped) {
                //console.log(tile);
                img.attr('src', 'img/tile-back.png')
            } else {
                //console.log(tile);
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
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
                src: 'img/tile-back.png',
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
    function timer () {
        startTime = _.now();
        var timer = window.setInterval(function () {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text(elapsedSeconds);

            if (elapsedSeconds >= 9999) {
                window.clearInterval(timer);
            }
        }, 1000);
    }
    
    $('#remaining').text(remaining);
    $('#misses').text(misses);
    $('#matches').text(matches);


}); //jQuery Ready Function