//current glitches:
//start screen does not come immediately in chrome, does not know why

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasIng = document.getElementById('canvasIng');
var ctxIng = canvasIng.getContext('2d');
var canvasHero = document.getElementById('canvasHero');
var ctxHero = canvasHero.getContext('2d');
var canvasLine = document.getElementById('canvasLine');
var ctxLine = canvasLine.getContext('2d');
var canvasBad = document.getElementById('canvasBad');
var ctxBad = canvasBad.getContext('2d');

var badguystrength = 0;
var btnPlay = new Button(560, 780, 290, 400);
var bad1 = new Bad();
var hero1 = new Hero();
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "#000000";
ctxHUD.font = "20px Comic Sans MS"
ctxLine.fillStyle = "black";
var lineY = 350;
var lineYB = 410;
var prevent = false;
var click = false;

var btnMute = new Button(0,30,0,30);

var sndSplash = new Audio("Sounds/Splash.mp3"); // buffers automatically when created
var sndWin = new Audio("Sounds/You Win.mp3");
var sndLose = new Audio("Sounds/Game Over Sound.mp3");
var sndReel = new Audio("Sounds/Fishing Reel.mp3");
sndReel.loop = true;
var sndSong = new Audio("Sounds/Break it now audio.mp3");
sndSong.loop = true;
var sndOpeningSong = new Audio ("Sounds/OpeningSong.mp3");

var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;

var isPlaying = false;
var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
var spawnInterval;
var totalIng = 0;
var ings = [];
var spawnRate = 1000;
var spawnAmount = 2;

var ingCount = [0,0,0,0,0,0];
var	ingGoal = [0,0,0];				

var currentTime = 120;

function createTimer() 
{
	window.setInterval('Tick()', 1000);
}

function Tick() 
{
	currentTime -= 1;
}

function drawMenu()
{
	ctxBg.drawImage(imgScreen, 0, 0, 800, 500, 0, 0, 800, 500);
}

var imgSprite = new Image();
imgSprite.src = 'Images/Sprite.png';
imgSprite.addEventListener('load',init,false);

var imgIng = new Image();
imgIng.src = 'Images/all ing.png';
var imgScreen = new Image();
imgScreen.src = 'Images/final sprite.png';


var sndButton = new Image();
sndButton.src = 'Images/Music button.png';


var sndAllow = true;

function init()
{
	drawMenu();
	sndOpeningSong.play();
	document.addEventListener('click', mouseClicked, false);
	//startGame();
	createTimer();
	randGoal();
}

function startGame()
{
	if(prevent == false)
	{
		sndOpeningSong.pause();
		currentTime = 120;
		prevent = true;
		drawBg();
		startLoop();
		if(sndAllow == true) {sndSong.play();}
		document.addEventListener('keydown',checkKeyDown,false);
		document.addEventListener('keyup',checkKeyUp,false);
		updateHUD();
	}
}
	
//INGREDIENT control
function spawnIng(n)
{
	for(var i = 0; i < n; i++)
	{
		ings[totalIng] = new Ing();
		totalIng++;
	}
}

function drawAllIng()
{
	clearCtxIng();
	for(var i = 0; i < ings.length; i++)
	{
		ings[i].draw();
	}
}

function startDrawingIng()
{
	stopDrawingIng();
	spawnInterval = setInterval(function() {spawnIng(spawnAmount);}, spawnRate);
}

function stopDrawingIng()
{
	clearInterval(spawnInterval);
}
//END INGREDIENT control
function loop()
{
	if (isPlaying)
	{
		hero1.draw();
		bad1.draw();
		drawAllIng();
		requestAnimFrame(loop);
	}
}

function startLoop()
{
	isPlaying = true;
	loop();
	startDrawingIng();
}

function stopLoop()
{
	isPlaying = false;
	stopDrawingIng();
}

function randGoal()
{
	
	ingCount[3] = Math.floor(Math.random() * 10);//controls how many to aim for
	ingCount[4] = Math.floor(Math.random() * 10);//controls how many to aim for
	
	while(ingCount[3] == ingCount[4])
	{
		ingCount[4] = Math.floor(Math.random() * 10);//controls how many to aim for
	}
	ingCount[5] = Math.floor(Math.random() * 10);//controls how many to aim for
	while(ingCount[5] == ingCount[3] || ingCount[5] == ingCount[4])
	{
		ingCount[5] = Math.floor(Math.random() * 10);//controls how many to aim for
	}
	
	for(var i = 0; i < 3; i++)
	{
		// ingGoal[i] = Math.floor(Math.random() * 5) + 1;//controls how many to aim for
		ingGoal[i] += 1;
	}
}

//Background
function drawBg()
{
	var srcX = 800;
	var srcY = 0;
	var drawX = 0;
	var drawY = 0;
	ctxBg.drawImage(imgScreen,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);
}

function clearCtxBg()
{
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
}


//END Background

//Ingredient
function Ing()
{
	this.type = Math.floor(Math.random() * 18);//generates a number from 0 - 2
	this.lane = Math.floor(Math.random() * 3);//generates a number from 0 - 3 for the lane division
	
	this.srcX = (0 + (this.type * 80));
	this.srcY = 0;
	if ( Math.pow(-1, this.lane) >= 0)
	{
		this.drawX = 100;
	}
	else
	{
		this.drawX = 800;
	}
	this.drawY = 10 + (this.lane * 90);
	this.width = 80;
	this.height = 82;
	this.speed = 2;
	this.computerCaught = false;
	this.isCaught = false;
	this.speedY = 0;
	this.wave = false;
}

Ing.prototype.draw = function()
{
	this.drawX += (Math.pow(-1, this.lane)) * this.speed;
	
	if(this.wave == false && !this.isCaught && !this.computerCaught)
	{
		this.drawY += .5;
		if(this.drawY == 18 || this.drawY == 108 || this.drawY == 198)
		{
			this.wave = true;
		}
	}
	if(this.wave == true && !this.isCaught && !this.computerCaught)
	{
		this.drawY -= .5;
		if(this.drawY == 2 || this.drawY == 92 || this.drawY == 182)
		{
			this.wave = false;
		}
	}
	
	if((this.isCaught && hero1.isDownKey) || this.computerCaught)
	{
		this.drawY += this.speedY;
	}
	ctxIng.drawImage(imgIng,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
	
};


Ing.prototype.checkEscaped = function()
{
	if(this.drawX + this.width <= -50)//destroys ingredient when it hits the left
	{
		this.destroyIng();
	}
	if(this.drawX >= 900)//destroys the ingredient when it hits the right
	{
		this.destroyIng();
	}
	if(this.drawY >= 360)
	{
		this.destroyIng();
		if (this.computerCaught == false)
		{
			if(this.type == ingCount[3])
			{
				ingCount[0]++;
			}
			else if(this.type == ingCount[4])
			{
				ingCount[1]++;
			}
			else if(this.type == ingCount[5])
			{
				ingCount[2]++;
			}
		}
	}
};

Ing.prototype.destroyIng = function()//keep destroy because recycle overuses it
{
	ings.splice(ings.indexOf(this),1);
	totalIng--;
};

function clearCtxIng()
{
	ctxIng.clearRect(0,0,gameWidth,gameHeight);
}
//END ingredient

//Hero

function Hero()
{
	this.srcX = 0 + (this.pose * 150);
	this.srcY = 501;
	this.drawX = 375;
	this.drawY = 150;
	this.width = 150;
	this.height = 360;
	
	this.isRightKey = false;
	this.isLeftKey = false;
	this.isDownKey = false;
	this.isSpacebar = false;
	
	this.isShooting = false;
	this.hook = new Hook();	
	
	this.aimX = this.drawX + 20;
	this.aimY = 400;
}

Hero.prototype.draw = function()
{
	clearCtxHero();
	this.checkDirection();
	this.aimX = this.drawX + 25;
	this.aimY = 340;
	this.checkShooting();
	this.drawHook();
	updateHUD();
	
	if(this.hook.str == 2 && this.isShooting == false)
	{
		hero1.srcX = 0;
	}
	if(this.hook.str == 3 && this.isShooting == false)
	{
		hero1.srcX = 150;
	}
	if(this.hook.str == 4 && this.isShooting == false)
	{
		hero1.srcX = 300;
	}
	
	for(var i = 0; i < (ings.length - 1); i++)//destroys doubles
	{
		if(((ings[i].drawX + 10)  >= ings[i+1].drawX) && ((ings[i].drawX - 10)  <= ings[i+1].drawX) && (ings[i].drawY == ings[i+1].drawY))
		{
			ings[i].destroyIng();
		}
	}
	ctxHero.drawImage(imgScreen,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Hero.prototype.checkDirection = function() 
{
    if (this.isRightKey) 
	{
		if(this.hook.str <= 3)
		{
			this.hook.str++;
			this.isRightKey = false;
		}
    }
    if (this.isLeftKey) 
	{
		if(this.hook.str > 2)
		{
			this.hook.str--;
			this.isLeftKey = false;
		}
    }
};

Hero.prototype.drawHook = function()
{
	if(this.isShooting) 
	{
		this.srcX = 750
		this.hook.draw();
	}
};

function clearCtxHero()
{
	ctxHero.clearRect(0,0,gameWidth,gameHeight);
}

Hero.prototype.checkShooting = function() 
{
    if (this.isSpacebar && !this.isShooting  && !this.hook.down)
	{
        this.isShooting = true;
        this.hook.fire(this.aimX, this.aimY);
    } 
	else if(!this.isSpacebar && this.hook.down)
	{
		this.isShooting = true;
	}
};

//END Hero

//Hook
function Hook()
{
	this.srcX = 0;
	this.srcY = 501;
	this.drawX = 370;
	this.drawY = 420;
	this.width = 10;
	this.height = 80;
	this.down = false;
	this.str = 2;
}

Hook.prototype.draw = function()
{
	var maxDistance = (380 - (this.str * 90));
	if(this.down == false && hero1.isShooting)
	{
		this.drawY -= 6;
		hero1.isDownKey = false;
		
		ctxLine.fillRect (400, lineY, 3, 6);
		lineY -= 6;
	}
	if(this.drawY <= maxDistance)
	{	
		if(sndAllow == true) {sndSplash.play();}
		this.down = true;
		this.drawY = maxDistance + 1;
		
		this.check = true;
		this.grab();
	}
	if(hero1.isDownKey)
	{
		if(sndAllow == true) {sndReel.play();}
		this.drawY += 3;
		lineY += 3;
		ctxLine.clearRect (400, lineY, 5, 3);
		
		if(lineY >=360)
		{
			lineY = 360;
		}
		
		if(this.drawY >= 379)
		{
			sndReel.pause();
			this.drawY = 379;
			this.down = false;
			hero1.isShooting = false;
		}
	}
	if(!hero1.isDownKey)
	{
		sndReel.pause();
	}
	if(this.drawY >= 379)
	{
		sndReel.pause();
		this.drawY = 379;
		this.down = false;
		hero1.isShooting = false;
	}
	ctxHero.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Hook.prototype.fire = function(startX, startY)
{
    this.drawX = startX;
    this.drawY = startY;
};

Hook.prototype.grab = function()
{
	for(var i = 0; i < ings.length; i++)
	{
		if( this.drawX >= ings[i].drawX &&
			this.drawX <= ings[i].drawX + ings[i].width &&
			this.drawY >= ings[i].drawY &&
			this.drawY <= ings[i].drawY + ings[i].height)
		{
			ings[i].speed = 0;
			ings[i].isCaught = true;
			ings[i].speedY = 3;
			if(ings[i].isCaught == true && ings[i].type > 11)
			{
				ings[i].destroyIng();
				currentTime = 0;
				isPlaying = false;
			}
			return;//makes it so it can only catch one at a time
		}	
	}
};

//END Hook

//Line


//END Line

//HUD

function updateHUD()
{
	ctxHUD.clearRect(0,0,gameWidth,gameHeight);
	ctxHUD.drawImage(imgSprite,0,0,180,500,0,0,175,500);
	
	ctxHUD.drawImage(imgIng,(80 * ingCount[3]),0,80,80,20,80, 40,40);
	ctxHUD.drawImage(imgIng,(80 * ingCount[4]),0,80,80,20,170, 40,40);
	ctxHUD.drawImage(imgIng,(80 * ingCount[5]),0,80,80,20,260, 40,40);
	
	ctxHUD.fillText(" = " + ingCount[0] + " / " + ingGoal[0],60,110);//Text, drawX, drawY ing1
	ctxHUD.fillText(" = " + ingCount[1] + " / " + ingGoal[1],60,200);
	ctxHUD.fillText(" = " + ingCount[2] + " / " + ingGoal[2],60,290);
	
	//ctxHUD.drawImage(sndButton, 0,0,200,200,0,0,0,30,30);
	ctxHUD.fillText("Lane: " + hero1.hook.str, 20,430);
	ctxHUD.fillText("Time Left: " + currentTime, 20,370);
	if(ingCount[0] >= ingGoal[0] && ingCount[1] >= ingGoal[1] && ingCount[2] >= ingGoal[2] && ingGoal[0] != 0 && ingGoal[1] != 0 && ingGoal[2] != 0)
	{
		sndSong.pause();
		if(sndAllow == true) {sndWin.play();}
		isPlaying = false;
		ctxHUD.drawImage(imgScreen,1600,0, 800, 500, 0, 0, 800, 500);
		prevent = false;
		ingCount = [0,0,0,0,0,0];
		randGoal();
		badguystrength += 1;
		ings.speed +=2;
	}
	
	if (currentTime <= 0) 
	{	
		sndSong.pause();
		if(sndAllow == true) {sndLose.play();}
		isPlaying = false;
		ctxHUD.drawImage(imgScreen,2400,0, 800, 500, 0, 0, 800, 500);
		prevent = false;
		stopLoop();
		ingCount = [0,0,0,0,0,0];
		randGoal();	
		ingGoal = [1,1,1];
			
		//isPlaying = true;
	}		
}

//end HUD

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function() 
{
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) 
	{
		return true;
	}
	else
	{
		return false;
	}
};

function mouseClicked(e) 
{
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (btnPlay.checkClicked()) startGame();
	if (btnMute.checkClicked())
	{
		if(sndAllow == true) 
		{
			sndSong.pause();
			sndAllow = false;
		}
		else if(sndAllow == false)
		{
			sndSong.play();
			sndAllow = true;
		}
	}	
}

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 40) { //down arrow
        hero1.isDownKey = true;
        e.preventDefault();
    }
	if (keyID === 39 || keyID === 68) { //right arrow
        hero1.isRightKey = true;
        e.preventDefault();
    }
	 if (keyID === 37) { //left arrow
        hero1.isLeftKey = true;
        e.preventDefault();
    }
		if (keyID === 32) //spacebar
	{ 
        hero1.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 40) { //down arrow
        hero1.isDownKey = false;
        e.preventDefault();
    }
	if (keyID === 39) { //right arrow
        hero1.isRightKey = false;
        e.preventDefault();
    }
	 if (keyID === 37) { //left arrow
        hero1.isLeftKey = false;
        e.preventDefault();
    }
	if (keyID === 32) 
	{ //spacebar
        hero1.isSpacebar = false;
        e.preventDefault();
    }
}

function Bad()
{
	this.srcX = 750
	this.srcY = 825;	
	this.drawX = 600;
	this.drawY = 235;
	this.width = 150;
	this.height = 360;
	
	this.isShooting = false;
	this.hookB = new HookB();	
	
	this.aimX = this.drawX;
	this.aimY = this.drawY + 38;
}

Bad.prototype.draw = function()
{
	clearCtxBad();
	this.isShooting = true;
	this.checkDirection();
	
	this.checkShooting();
	this.drawHookB();
	
	if(this.hookB.str == 2 && this.isShooting == false)
	{
		this.srcX = 0;
	}
	if(this.hookB.str == 3 && this.isShooting == false)
	{
		this.srcX = 250;
	}
	if(this.hookB.str == 4 && this.isShooting == false)
	{
		this.srcX = 500;
	}
	
	ctxBad.drawImage(imgScreen,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Bad.prototype.checkDirection = function() 
{
    this.hookB.str = Math.floor(Math.random() * 3) + 2;
};

Bad.prototype.drawHookB = function()
{
	if(this.isShooting) this.hookB.draw();
};

function clearCtxBad()
{
	ctxBad.clearRect(0,0,gameWidth,gameHeight);
}

Bad.prototype.checkShooting = function() 
{
    if (this.isShooting  && !this.hookB.down)
	{
        this.isShooting = true;
        
    } 
	else if(this.hookB.down)
	{
		this.isShooting = true;
	}
};

//End Bad

//Hook
function HookB()
{
	this.srcX = 0;
	this.srcY = 501;
	this.drawX = 624;
	this.drawY = 400;
	this.width = 10;
	this.height = 80;
	this.down = false;
	this.str = Math.floor(Math.random()) + 3;
}

HookB.prototype.draw = function()
{
	var maxDistance1 = (380 - (3 * 75));
	if(!this.down && bad1.isShooting )
	{
		this.drawY -= (3 + badguystrength);
		ctxLine.fillRect (625, lineYB, 3, (3+ badguystrength));
		lineYB -= (3 + badguystrength);
	}
	if(this.drawY < maxDistance1)
	{
		this.down = true;
		this.grab();
	}
	if(this.down)
	{
		this.drawY += (2 + badguystrength);
		lineYB += (2 + badguystrength);
		ctxLine.clearRect (625, lineYB, 5, (2 + badguystrength));
		
		if(lineYB >=410)
		{
			lineYB = 410;
		}
		
		if(this.drawY > 379)
		{
			this.drawY = 379;
			this.down = false;
		}
	}
	ctxBad.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

HookB.prototype.fire = function(startX, startY)
{
    this.drawX = startX;
    this.drawY = startY + 50;
};

HookB.prototype.grab = function()
{
		for(var i = 0; i < ings.length; i++)
		{
			if( this.drawX >= ings[i].drawX &&
			this.drawX <= ings[i].drawX + ings[i].width &&
			this.drawY >= ings[i].drawY &&
			this.drawY <= ings[i].drawY + ings[i].height)
			{
				ings[i].speed = 0;
				ings[i].computerCaught = true;
				ings[i].speedY = (2 + badguystrength);
				return;
			}
				//makes it so it can only catch one at a time
		}
};