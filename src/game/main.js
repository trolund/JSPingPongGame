var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'PingPong', {
    preload: preload,
    create: create,
    update: update,
    render: render
});


function preload() {

    game.load.image('paddle', 'src/img/paddle.png');
    game.load.image('ball', 'src/img/ball.png');
    game.load.image('playbtn', 'src/img/Singelplaybtn.png');
    game.load.image('menubg', 'src/img/menuBg.png');
    game.load.image('restartbtn', 'src/img/restartbtn.png');
    game.load.image('Mplaybtn', 'src/img/multiplaybtn.png');

    game.load.image('Easybtn', 'src/img/Easybtn.png');
    game.load.image('medibtn', 'src/img/medibtn.png');
    game.load.image('hardbtn', 'src/img/hardbtn.png');
    game.load.image('unbeatablebtn', 'src/img/unbeatablebtn.png');

    game.load.audio('sound', 'src/audio/numkey.wav');
    game.load.audio('dead', 'src/audio/numkey_wrong.wav');
    game.load.audio('serve', 'src/audio/key.wav');
}



//var image;

var player1Back;
var player2Back;

var player1;
var player2;
var pointsPlayer1;
var pointsPlayer2;
var pointsLabel;

// keys:
var upKey;
var downKey;
var wKey;
var sKey;

var serveKey;

var startButton;

var sound;

var paddleSpeed = 600;

var playbtn;
var singelplayerbtn;

var menuBg;

var singelplayermode = false;
var AImode = 3;

function create() {

    //  Register the keys.
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    serveKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    /*
       //  Stop the following keys from propagating up to the browser
       game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.W, Phaser.Keyboard.S]);
       */
    // text with points!

    pointsPlayer1 = 0;
    pointsPlayer2 = 0;

    var pointText = pointsPlayer1 + " : " + pointsPlayer2;
    var style = {
        font: "65px Arial",
        fill: "#fff",
        align: "center"
    };

    pointsLabel = game.add.text(game.world.centerX - 70, 0, pointText, style);


    //	Here we set-up our audio
    sound = game.add.audio('sound');
    deadSound = game.add.audio('dead');
    serveSound = game.add.audio('serve');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    ball = game.add.sprite(window.innerWidth / 2 - 16, window.innerHeight / 2 - 16, 'ball');
    // add players
    player1 = game.add.sprite(window.innerWidth - 100, window.innerHeight / 2, 'paddle');
    player2 = game.add.sprite(100, window.innerHeight / 2, 'paddle');

    player1Back = game.add.sprite(window.innerWidth - 5, 0, 'paddle');
    player1Back.scale.set(0.1, 10);

    player2Back = game.add.sprite(0, 0, 'paddle');
    player2Back.scale.set(0.1, 10);


    player1.scale.set(0.3, 0.3);
    player2.scale.set(0.3, 0.3);

    ball.scale.set(1, 1);

    game.physics.enable([player1, player2, ball], Phaser.Physics.ARCADE, true);

    game.physics.enable([player1Back, player2Back], Phaser.Physics.ARCADE, false);

    player1.body.immovable = true;
    player2.body.immovable = true;

    player1.body.collideWorldBounds = true;
    player2.body.collideWorldBounds = true;

    //  This makes the game world bounce-able
    ball.body.collideWorldBounds = true;

    //  This sets the image bounce energy for the horizontal
    //  and vertical vectors (as an x,y point). "1" is 100% energy return
    ball.body.bounce.setTo(1, 1);

    ball.body.onCollide = new Phaser.Signal();
    ball.body.onCollide.add(function () {
        sound.play();
    }, this);

    menuBg = game.add.sprite(0, 0, 'menubg');
    menuBg.scale.set(100, 100);

    ShowMainMenu();
}

function ShowMainMenu(){
    game.paused = true;
    playbtn = game.add.button(game.world.centerX - 100, 400, 'Mplaybtn', startGame, this, 2, 0.1, 0);
    playbtn.scale.setTo(0.5, 0.5);
    playbtn.onInputOver.add(over, this);

    singelplayerbtn = game.add.button(game.world.centerX - 100, 340, 'playbtn', startGameSingelplayermode, this, 2, 0.1, 0);
    singelplayerbtn.scale.setTo(0.5, 0.5);
    singelplayerbtn.onInputOver.add(over, this);
}

function over(){

}

function startGameSingelplayermode() {
    singelplayermode = true;

    destroyMainMenu();

    easyAIbtn = game.add.button(game.world.centerX - 100, 300, 'Easybtn', function(){ AImode = 1; console.log('AI mode: ' + AImode); destroyAImenu(); menuBg.destroy();}, this, 2, 0.1, 0);
    easyAIbtn.scale.setTo(0.5, 0.5);
    easyAIbtn.onInputOver.add(over, this);

    mediumAIbtn = game.add.button(game.world.centerX - 100, 400, 'medibtn', function(){ AImode = 2; console.log('AI mode: ' + AImode); destroyAImenu(); menuBg.destroy();}, this, 2, 0.1, 0);
    mediumAIbtn.scale.setTo(0.5, 0.5);
    mediumAIbtn.onInputOver.add(over, this);

    HardAIbtn = game.add.button(game.world.centerX - 100, 500, 'hardbtn', function(){ AImode = 3; console.log('AI mode: ' + AImode); destroyAImenu(); menuBg.destroy();}, this, 2, 0.1, 0);
    HardAIbtn.scale.setTo(0.5, 0.5);
    HardAIbtn.onInputOver.add(over, this);

    unbeatableAIbtn = game.add.button(game.world.centerX - 100, 600, 'unbeatablebtn', function(){ AImode = 4; console.log('AI mode: ' + AImode); destroyAImenu(); menuBg.destroy();}, this, 2, 0.1, 0);
    unbeatableAIbtn.scale.setTo(0.5, 0.5);
    unbeatableAIbtn.onInputOver.add(over, this);
}

function destroyAImenu(){
        easyAIbtn.destroy();
        mediumAIbtn.destroy();
        HardAIbtn.destroy();
        unbeatableAIbtn.destroy();

        startGame();
}

function singlelpayerAI() {
    switch (AImode) {
        case 1:
            AImodeEasy() // easy!
            break;
        case 2:
            AImodeMedimum(); // medium
            break;
        case 3:
            AImodeHard(); // hard
            break;
        default:
            player2.body.y = ball.body.y - 50; // unbeatable
    }

}

var serveCounter = 0;

function AImodeHard() {
    playerY = player2.body.y;
    ballY = ball.body.y;
    moveSpeed = 10;

    if (ballY - 20 < playerY && playerY < ballY + 20) {
        console.log('stå stille!');
    } else {

        if (playerY < ballY) {
            num = Math.floor(Math.random() * 100) + 5;

            if (num > 5) {
                player2.body.y += moveSpeed;
            } else {
                player2.body.y -= moveSpeed;
            }
        } else {
            num = Math.floor(Math.random() * 100) + 5;

            if (num > 5) {
                player2.body.y -= moveSpeed;
            } else {
                player2.body.y += moveSpeed;
            }
        }
    }
}

function AImodeMedimum() {
    playerY = player2.body.y;
    ballY = ball.body.y;
    moveSpeed = 9;

    if (ballY - 20 < playerY && playerY < ballY + 20) {
        console.log('stå stille!');
    } else {

        if (playerY < ballY) {
            num = Math.floor(Math.random() * 72) + 5;

            if (num > 5) {
                player2.body.y += moveSpeed;
            } else {
                player2.body.y -= moveSpeed;
            }
        } else {
            num = Math.floor(Math.random() * 72) + 5;

            if (num > 5) {
                player2.body.y -= moveSpeed;
            } else {
                player2.body.y += moveSpeed;
            }
        }
    }
}

function AImodeEasy(){
    playerY = player2.body.y;
    ballY = ball.body.y;
    moveSpeed = 7;

    if (ballY - 20 < playerY && playerY < ballY + 20) {
        console.log('stå stille!');
    } else {

        if (playerY < ballY) {
            num = Math.floor(Math.random() * 63) + 5;

            if (num > 5) {
                player2.body.y += moveSpeed;
            } else {
                player2.body.y -= moveSpeed;
            }
        } else {
            num = Math.floor(Math.random() * 63) + 5;

            if (num > 5) {
                player2.body.y -= moveSpeed;
            } else {
                player2.body.y += moveSpeed;
            }
        }
    }
}

function startGame() {
    pointsPlayer1 = 0;
    pointsPlayer2 = 0;

    menuBg.destroy();
    playbtn.destroy();
    singelplayerbtn.destroy();

    game.paused = false;


    BallMove();
}



function destroyMainMenu() {
    playbtn.destroy();
    singelplayerbtn.destroy();
}


//  Move the knocker with the arrow keys
function update() {

    //  Enable physics between the knocker and the ball
    game.physics.arcade.collide([player1, player2], ball);

    game.physics.arcade.collide(player2Back, ball, point2);
    game.physics.arcade.collide(player1Back, ball, point1);



    if (upKey.isDown) {
        player1.body.velocity.y = -paddleSpeed;
    } else if (downKey.isDown) {
        player1.body.velocity.y = paddleSpeed;
    } else {
        player1.body.velocity.setTo(0, 0);
    }


    if (!singelplayermode) {
        if (sKey.isDown) {
            player2.body.velocity.y = paddleSpeed;
        } else if (wKey.isDown) {
            player2.body.velocity.y = -paddleSpeed;
        } else {
            player2.body.velocity.setTo(0, 0);
        }
    } else {
        singlelpayerAI()
    }

    if (serve && serveKey.isDown) {
            serveSound.play();
            BallMove();
        }
}

function render() {
    //debug helper
    // game.debug.spriteInfo(ball, 32, 32);

}

var serve = false;

var min = 500;
var max = 650;

function BallMove() {

    if (Math.random() >= 0.5) {
        //  This gets it moving
        ball.body.velocity.setTo(game.rnd.integerInRange(min, max), game.rnd.integerInRange(min, max));
    } else {
        ball.body.velocity.setTo(game.rnd.integerInRange(-min, -max), game.rnd.integerInRange(-min, -max));
    }

    serve = false;
}

function point2(obj1, obj2) {
    deadSound.play();
    player2Back.body.velocity.setTo(0, 0);
    pointsPlayer2++;
    reset();

}

function point1(obj1, obj2) {
    deadSound.play();
    player1Back.body.velocity.setTo(0, 0);
    pointsPlayer1++;
    reset();
}

function reset() {
    ball.body.velocity.setTo(0, 0);
    ball.body.x = game.world.centerX - 15;
    ball.body.y = game.world.centerY - 15;
    player1Back.x = window.innerWidth - 5;
    player2Back.x = 0;
    pointsLabel.setText(pointsPlayer1 + " : " + pointsPlayer2);
    serve = true;
    // game.time.events.add(Phaser.Timer.SECOND * 2, BallMove, this);

    if (pointsPlayer1 >= 10) {
        console.log('player 1 wins!');
        win('player 1 wins!');
    } else if (pointsPlayer2 >= 10) {
        console.log('player 2 wins!');
        win('player 2 wins!');
    } else {
        console.log(pointsPlayer1 + " : " + pointsPlayer2);
    }

}

function win(winner) {
    var style = {
        font: "65px Arial",
        fill: "#ffffff",
        align: "center"
    };

    menuBg = game.add.sprite(0, 0, 'menubg');
    menuBg.scale.set(100, 100);

    winnerText = game.add.text(game.world.centerX, game.world.centerY, winner, style);
    winnerText.anchor.setTo(0.5, 0.5);
    restartbtn = game.add.button(game.world.centerX - 100, 280, 'restartbtn', function () {
        pointsPlayer1 = 0;
        pointsPlayer2 = 0;
        pointsLabel.setText("0 : 0");
        restartbtn.destroy();
        winnerText.destroy();
        menuBg.destroy();
        startGame();
    }, this, 2, 0.1, 0);
    restartbtn.scale.setTo(0.5, 0.5);
    game.paused = true;

}
