var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'PingPong', {
    preload: preload,
    create: create,
    update: update,
    render: render
});



function preload() {
    game.load.image('paddle', '../../src/img/paddle.png');
    game.load.image('ball', '../../src/img/ball.png');
}

var image;

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

function create() {

    //  Register the keys.
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
 /*
    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.W, Phaser.Keyboard.S]);
    */
    // text with points!

    pointsPlayer1 = 0;
    pointsPlayer2 = 0;

    var pointText = pointsPlayer1 + " : " + pointsPlayer2;
    var style = { font: "65px Arial", fill: "#fff", align: "center" };

    pointsLabel = game.add.text(game.world.centerX-60, 0, pointText, style);






    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    ball = game.add.sprite(window.innerWidth/2 -16, window.innerHeight / 2 -16, 'ball');
    // add players
    player1 = game.add.sprite(window.innerWidth - 100, window.innerHeight / 2, 'paddle');
    player2 = game.add.sprite(100, window.innerHeight / 2, 'paddle');

    player1Back = game.add.sprite(window.innerWidth-5, 0, 'paddle');
    player1Back.scale.set(0.1,10);

    player2Back = game.add.sprite(0, 0, 'paddle');
    player2Back.scale.set(0.1,10);


    player1.scale.set(0.3,0.3);
    player2.scale.set(0.3,0.3);

    ball.scale.set(1,1);

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


    BallMove();
}

//  Move the knocker with the arrow keys
function update() {

    //  Enable physics between the knocker and the ball
    game.physics.arcade.collide([player1, player2], ball);

    game.physics.arcade.collide(player2Back, ball, point2);
    game.physics.arcade.collide(player1Back, ball, point1);

    if (upKey.isDown) {
        player1.body.velocity.y = -300;
    } else if (downKey.isDown) {
        player1.body.velocity.y = 300;
    }
    else {
        player1.body.velocity.setTo(0, 0);
    }


    if(sKey.isDown) {
        player2.body.velocity.y = 300;
    }
    else if(wKey.isDown){
        player2.body.velocity.y = -300;
    }
    else {
        player2.body.velocity.setTo(0, 0);
    }

}

function render() {
    //debug helper
   // game.debug.spriteInfo(ball, 32, 32);

}

function BallMove() {
    if (Math.random() >= 0.5) {
        //  This gets it moving
        ball.body.velocity.setTo(400, 400);
    } else {
        ball.body.velocity.setTo(-400, -400);
    }
}

function point2(obj1, obj2){
    player2Back.body.velocity.setTo(0, 0);
    pointsPlayer2++;
    reset();
}
function point1(obj1, obj2){
    player1Back.body.velocity.setTo(0, 0);
    pointsPlayer1++;
    reset();
}

function reset(){
    ball.body.velocity.setTo(0, 0);
    ball.body.x = game.world.centerX-15;
    ball.body.y = game.world.centerY-15;
    player1Back.x = window.innerWidth-5;
    player2Back.x = 0;
    pointsLabel.setText(pointsPlayer1 + " : " + pointsPlayer2);
    game.time.events.add(Phaser.Timer.SECOND * 2, BallMove, this);
}

