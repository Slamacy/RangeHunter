/* global leftObstructed, rightObstructed */

function boarEnemy(ctx, animationStartDelay, xCenter, yCenter, width, height, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 100;
    this.animationIsDisplayed = false;
    this.animationStartDelay = animationStartDelay;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.width = width;
    this.height = height;
    this.direction;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.spriteSheet = new Image();
    this.spriteSheet.src = "images/gameAssets/boarSprites.png";
    
    this.spriteColumns = 5;
    this.spriteRows = 2;
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

boarEnemy.prototype.LEFT = 1;
boarEnemy.prototype.RIGHT = 0;

boarEnemy.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

boarEnemy.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

boarEnemy.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

boarEnemy.prototype.update = function() {
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

    this.walkCycle();

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

boarEnemy.prototype.walkCycle = function() {
    if(this.animationIsDisplayed) {
        this.walkFrame++;
        if(this.walkFrame >= 5 && this.walkFrame <= 15) {
            if(this.getDirection() !== this.RIGHT) {
                this.setDirection(this.RIGHT);
            }
            this.xCenter -= 20;
        }
        if(this.walkFrame >= 20 && this.walkFrame <= 30) {
            if(this.getDirection() !== this.LEFT) {
                this.setDirection(this.LEFT);
            }
            this.xCenter += 20;
        }
        if(this.walkFrame === 30) {
            this.walkFrame = 0;
        }
    }
};

boarEnemy.prototype.render = function() {
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

boarEnemy.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;
    this.startSprite = this.direction * this.spriteColumns;
    this.endSprite = this.startSprite + this.spriteColumns;
    this.row = this.direction;
    this.column = 0;
};

boarEnemy.prototype.getDirection = function() {
    return this.direction;
};