/* global isObstructed, rightObstructed, leftObstructed */

//40 columns in crocodileSprite

function crocodileEnemy(ctx, xCenter, yCenter, width, height, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 100;
    this.animationIsDisplayed = false;
    this.animationStartDelay = 0;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.width = width;
    this.height = height;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.spriteSheet = new Image();
    this.spriteSheet.src = "images/gameAssets/crocodileSprites.png";
    
    this.spriteColumns = 40;
    this.column = 0;
    this.startSprite = 0;
    this.endSprite;
    this.currentSprite;
    
    this.walkFrame = 0;
    
    this.xPos;
    this.yPos;
    
    var _this = this;
    this.spriteSheet.onload = function() {
        setTimeout(_this.start.bind(_this), this.animationStartDelay);
    };
}

crocodileEnemy.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

crocodileEnemy.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

crocodileEnemy.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

crocodileEnemy.prototype.update = function() {
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
    
    this.column++;
    //console.log(this.column);
    this.currentSprite++;
    if(this.currentSprite >= this.endSprite) {
        this.column = 0;
        this.currentSprite = this.startSprite;
    }
    else if(this.column >= this.spriteColumns) {
        this.column = 0;
    } 
};

crocodileEnemy.prototype.render = function() {
    if(this.animationIsDisplayed) {
        this.spriteWidth = (this.spriteSheet.width / this.spriteColumns);
        this.spriteHeight = (this.spriteSheet.height);
        this.xPos = this.xCenter - parseInt(this.canvasWidth / 2);
        this.yPos = this.yCenter - parseInt(this.canvasHeight / 2);
        //console.log("rendering");
        //       drawImage(img,xStart,yStart, swidth,sheight,xCenter,yCenter,width,height);
        this.ctx.drawImage(this.spriteSheet, this.column * this.spriteWidth, 0,
        this.spriteWidth, this.spriteHeight, this.xPos, this.yPos, this.width, this.height);
    }
};
