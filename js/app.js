//Global variables
let livesDisplayed = document.getElementsByClassName('life');
let modal = document.querySelector('.result-modal');
let speedFactor = 30; //Used to increase the speed from level 6

/****Enemies 1: Cars from left to right*******/
var Enemy1 = function(x, y) {
    let randomCar = Math.floor(Math.random() * 6 + 1);
    let randomSpeed = Math.floor(Math.random() * 15 + 5);
    this.sprite = 'images/car' +randomCar+'.png';
    this.x = x;
    this.y = y;
    this.update = function(dt) {
        this.x += randomSpeed * speedFactor * dt;
        if (this.x > 800){
            this.x = -150;
        }
    };
};

// Draw the enemy on the screen, required method for game
Enemy1.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/****************Enemies 1 end *****************/

/***Enemies2: Cars from right to left start****/
var Enemy2 = function(x, y) {
    let randomCar = Math.floor(Math.random() * 6 + 1);
    let randomSpeed = Math.floor(Math.random() * 15 + 1);
    this.sprite = 'images/car2' +randomCar+'.png';
    this.x = x;
    this.y = y;
    this.update = function(dt) {
        this.x -= randomSpeed * speedFactor * dt;
        if (this.x < -100){
            this.x = 900;
        }
    };
};
// Draw the enemy on the screen, required method for game
Enemy2.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/****************Enemies2 end *****************/


/************ Initiate enemies **********/
let enemy1 = new Enemy1(-200, 330);
let enemy7 = new Enemy1(-200, 360); 
let enemy2 = new Enemy1(-150, 250);
let enemy5 = new Enemy1(-150, 280);
let enemy4 = new Enemy2(900, 55);
let enemy6 = new Enemy2(900, 85);
let enemy3 = new Enemy2(900, 130);
let enemy8 = new Enemy2(900, 160);

var allEnemies = [enemy1, enemy2, enemy3, enemy4]; //Starting with 4 enemies at level 1.
/************** Initiate enemies end  *******/

/*********** Player *******/
var Player = function() {
    this.sprite = 'images/walking-monster.png';
    this.x =350;
    this.y = 430;
    this.level = 1;
    this.lives = 3;
}
Player.prototype.update = function(dt){
    collision();
    success();    
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(dt){
    if(modal.classList.contains('hidden')){
        switch (dt){
        case "up": if(this.y>0){this.y -= 5};
        break;
        case "down": if(this.y<460){this.y += 5};
        break;
        case "left": if(this.x>0){this.x -= 5};
        break;
        case "right": if(this.x<760){this.x += 5};
        break;
        }
    }    
}

var player = new Player(); //Initiate player
/********** Player end ***********/

//Collision detection
function collision(){
    for (let enemy of allEnemies){
        let deltaX = player.x - enemy.x;
        let deltaY = player.y - enemy.y;
        if (deltaX < 70 && deltaX > -40 && deltaY < 55 && deltaY > -15){
            player.x = 350;
            player.y = 430;
            player.lives -- ;
            livesDisplayed[player.lives].classList.add('hidden');
            if(player.lives == 0){
                lost();
            }
        }
    }
}

//After three collision, the lost function is triggered. 
function lost(){
    let failureMessage = document.querySelector('.failure-message');
    modal.classList.remove('hidden');
    failureMessage.classList.remove('hidden');
    let againBtn = document.querySelector('.again');
    againBtn.onclick = function(){
       modal.classList.add('hidden');
       failureMessage.classList.add('hidden');
       player.x = 350;
       player.y = 430;
        resetGame();
    };
}

function resetGame(){
    player.level = 1;
    player.lives = 3;
    allEnemies = [enemy1, enemy2, enemy3, enemy4];
    livesDisplayed[0].classList.remove('hidden'); //Refactor it
    livesDisplayed[1].classList.remove('hidden');
    livesDisplayed[2].classList.remove('hidden');
    levelNumber(player.level);
}

//Success detection
function success(){
    if(player.y <40){
        let modal = document.querySelector('.result-modal');
        let successMessage = document.querySelector('.success-message');
        modal.classList.remove('hidden');
        successMessage.classList.remove('hidden');
        let nextBtn = document.querySelector('.next');
        nextBtn.onclick = function(){
            modal.classList.add('hidden');
            successMessage.classList.add('hidden');
            player.x= 350;
            player.y = 430;
            nextLevel();            
        };
    }
}

//Increase the difficlty for next levels.
function nextLevel(){
    player.level ++;
    if (player.level == 2){
        allEnemies.push(enemy5);
    }
    else if (player.level == 3){
        allEnemies.push(enemy6);
    }
    else if (player.level == 4){
        allEnemies.push(enemy7);
    }
    else if (player.level == 5){
        allEnemies.push(enemy8);
    }
    else {
        speedFactor += 5;
    }
    levelNumber(player.level); 
}

//Updates displayed level number
function levelNumber(playerLevel){
    let levelNumber = document.querySelector('.level-number');
    levelNumber.innerText = playerLevel;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});