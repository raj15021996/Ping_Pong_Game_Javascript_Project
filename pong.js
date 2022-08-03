var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 5;
var paddle1Y = 250;   
var paddle2Y = 250;  
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
var playerScore = 0;
var computerScore = 0;
const WINNING_SCORE = 5;
var showingWInScreen = false; 


canvas = document.querySelector("canvas");
canvasContext = canvas.getContext('2d');
canvasContext.font = "30px Arial";

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
let gameOver = new Audio();

hit.src = "sounds/sounds_hit.mp3";
wall.src = "sounds/sounds_wall.mp3";
comScore.src = "sounds/sounds_comScore.mp3";
userScore.src = "sounds/sounds_userScore.mp3";
gameOver.src = "sounds/game_over.wav";
    
function calculateMousePos(event){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY 
    };
}
    
function handleMouseClick(event){
    if(showingWInScreen){
        playerScore = 0;
        computerScore = 0;
        showingWInScreen = false;
    }
}
    
window.onload = function(){
    
    var framesPerSecond = 30;
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);
    
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove', function(event){
        var mousePos = calculateMousePos(event);
        paddle1Y = mousePos.y;  
    });
    canvas.addEventListener('ontouchmove', function(event){
        var mousePos = calculateMousePos(event);
        paddle1Y = mousePos.y;  
    });
   
}

function ballReset(){
    if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE){
        showingWInScreen = true; 
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;

}
    
function computerMovement(){
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY-35){
        paddle2Y = paddle2Y + 6;
    }else if (paddle2YCenter > ballY+35){
        paddle2Y = paddle2Y - 6;
    }
} 
    

function moveEverything(){
    if(showingWInScreen){
        return;
    }
   computerMovement();
   ballX = ballX + ballSpeedX;
   ballY = ballY + ballSpeedY; 

    if(ballX < PADDLE_WIDTH){
        if(ballY > paddle2Y-(PADDLE_HEIGHT / 2) && ballY < (paddle2Y + PADDLE_HEIGHT/2)){
            hit.play();
            ballSpeedX = - ballSpeedX;
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else{
        playerScore++; //INCREMENT SCORE BEFORE RESETTING THE BALL
        userScore.play();
        ballReset();
        }
    }  
    
    if(ballX > canvas.width-PADDLE_WIDTH){
        if(ballY > paddle1Y-(PADDLE_HEIGHT/2) && ballY < (paddle1Y+PADDLE_HEIGHT/2)){
            hit.play();
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else{
        computerScore++;
        comScore.play();
        ballReset();
        }
    }
    
   if(ballY > canvas.height || ballY < 0){
       ballSpeedY = -ballSpeedY;
       wall.play();
   }
}
    
function drawNet(){
    for(var i=0 ; i < canvas.height ; i+=30){
        colorRect(canvas.width/2-1,i,2,20,'red');
    }
}

function drawEverything(){
    colorRect(0,0,canvas.width,canvas.height,'yellow');
   
    if(showingWInScreen){
        gameOver.play();
        canvasContext.fillStyle = 'black';
        canvasContext.font = '30px fantacy'

        if(playerScore >= WINNING_SCORE){
            canvasContext.fillText("YOU WIN",300,200);
            
        }else if(computerScore >= WINNING_SCORE){
            canvasContext.fillText("COMPUTER WINS",220,200);
            
        }
        // canvasContext.fillText("CLICK TO CONTINUE",230,250);
        return;
    }else{
        canvasContext.fillStyle = 'black';
        canvasContext.font = '30px fantacy'
        canvasContext.fillText("Computer Score",20,60);
        canvasContext.fillText("Your Score",540,60);
    }
    drawNet();
    colorRect(0,(paddle2Y-(PADDLE_HEIGHT/2)), PADDLE_WIDTH,PADDLE_HEIGHT,'blue');
    colorRect((canvas.width-PADDLE_WIDTH),(paddle1Y-(PADDLE_HEIGHT/2)) ,PADDLE_WIDTH,PADDLE_HEIGHT,'blue');
    colorCircle(ballX, ballY, 10, 'black'); 
    canvasContext.fillText(computerScore, 100, 100); canvasContext.fillText(playerScore, canvas.width-100, 100);
}

function colorRect(leftX,topY,width,height,drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}
    
function colorCircle(centreX, centreY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centreX, centreY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
 
