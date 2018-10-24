/* global leftObstructed, rightObstructed */

function birdEnemy(ctx, xCenter, yCenter, width, height, canvasWidth, canvasHeight, flightSpeed) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 100;
    this.animationIsDisplayed = false;
    this.animationStartDelay = 0;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.width = width;
    this.height = height;
    this.direction;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.flightSpeed = flightSpeed;
    
    this.spriteSheet = new Image();
    this.spriteSheet.src = "images/gameAssets/birdSprites.png";
    
    this.spriteColumns = 6;
    this.spriteRows = 1;
    this.column = 0;
    this.startSprite = 0;
    this.endSprite;
    this.currentSprite;
    this.row;
    
    this.walkFrame = 0;
    
    this.xPos;
    this.yPos;
    
    this.setDirection(this.LEFT);
    
    setTimeout(this.start.bind(this), this.animationStartDelay);
}

birdEnemy.prototype.LEFT = 0;

birdEnemy.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

birdEnemy.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

birdEnemy.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

birdEnemy.prototype.update = function() {
    if(rightObstructed === false) {
        if(keyList[65]) {
            this.xCenter += 25;
        }
    }
    if(leftObstructed === false) {
        if(keyList[68]) {
            this.xCenter -= 25;
        }
    }

    this.xCenter += this.flightSpeed;
    if(this.xCenter >= 2000) {
        this.xCenter = 0;
    }

    this.column++;
    this.currentSprite++;
    if(this.currentSprite >= this.endSprite) {
        this.row = this.getDirection();
        this.column = 0;
        this.currentSprite = this.startSprite;
    }
    else if(this.column >= this.spriteColumns) {
        this.column = 0;
    }
};

birdEnemy.prototype.render = function() {
    if(this.animationIsDisplayed) {
        this.spriteWidth = (this.spriteSheet.width / this.spriteColumns);
        this.spriteHeight = (this.spriteSheet.height / this.spriteRows);
        this.xPos = this.xCenter - parseInt(this.canvasWidth / 2);
        this.yPos = this.yCenter - parseInt(this.canvasHeight / 2);
        //       drawImage(img,xStart,yStart,
        //                swidth,sheight,xCenter,yCenter,width,height);
        this.ctx.drawImage(this.spriteSheet, this.column * this.spriteWidth, this.row * this.spriteHeight,
                           this.spriteWidth, this.spriteHeight, this.xPos, this.yPos, this.width, this.height);
        //output.log(this.xCenter);
    }
};

birdEnemy.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;
    this.startSprite = this.direction * this.spriteColumns;
    this.endSprite = this.startSprite + this.spriteColumns;
    this.row = this.direction;
    this.column = 0;
};

birdEnemy.prototype.getDirection = function() {
    return this.direction;
};