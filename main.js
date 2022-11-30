//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, gameOverImage, enemyImage;
let gameover=false;
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2-30;
let spaceshipY = canvas.height-60;

let bulletlist = [];
function bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX-2;
        this.y = spaceshipY;
        this.alive = true
        bulletlist.push(this);
    };

    this.update = function(){
        this.y-=7;
    };

    this.checkHit=function(){

        for(let i=0; i<enemylist.length;i++){
            if(this.y <= enemylist[i].y+48 && this.x >= enemylist[i].x-28 && this.x <= enemylist[i].x+48){
                score++;
                this.alive = false;
                enemylist.splice(i, 1);
            }
        }
    }

}

function generaterandomvalue(min,max){
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

let enemylist = [];
function enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y=0;
        this.x=generaterandomvalue(0,canvas.width-48);
        
        enemylist.push(this);
    };
    this.update=function(){
        this.y += 1;

        if(this.y >= canvas.height-48){
            gameover=true;
        }
    }
}

function loadimage(){
 backgroundImage = new Image();
 backgroundImage.src = "images/background.jpg";

 spaceshipImage = new Image();
 spaceshipImage.src = "images/spaceship.png";

 bulletImage = new Image();
 bulletImage.src = "images/bullet.png";

 gameOverImage = new Image();
 gameOverImage.src = "images/gameover.jpg";

 enemyImage = new Image();
 enemyImage.src = "images/enemy.png";
}

let keysdown={}
function setupkeyboardlistener(){
 document.addEventListener("keydown",function(event){
keysdown[event.keyCode] = true

 });
document.addEventListener("keyup", function(event){
    delete keysdown[event.keyCode];

    if(event.keyCode == 32){
        createbullet();
    }
});
}

function createbullet(){
 let b = new bullet();
 b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new enemy()
        e.init()
    },1000)
}

function update(){
    if(39 in keysdown){
        spaceshipX += 5;
    }
    if(37 in keysdown){
        spaceshipX -= 5;
    }
    if(spaceshipX <=0){
        spaceshipX = 0;
    }
    if(spaceshipX>= canvas.width-60){
        spaceshipX = canvas.width-60;
    }

    for(let i=0;i<bulletlist.length;i++){
        if(bulletlist[i].alive){
        bulletlist[i].update();
        bulletlist[i].checkHit();
    }
}

    for(let i=0;i<enemylist.length;i++){
        enemylist[i].update()
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY );
    ctx.fillText([score], 20 ,35);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i=0; i<bulletlist.length; i++){
        if(bulletlist[i].alive){
        ctx.drawImage(bulletImage,bulletlist[i].x,bulletlist[i].y);
    }
    }
    for(let i=0; i<enemylist.length; i++){
        ctx.drawImage(enemyImage,enemylist[i].x,enemylist[i].y);
    }
}

function main(){
    if(!gameover){
    update();
    render();
    requestAnimationFrame(main);
}
else{
    ctx.drawImage(gameOverImage,10,100,380,380);
}
}

loadimage();
setupkeyboardlistener();
createEnemy();
main();