/* global animation, CharAnimation, crocodileEnemy, boarEnemy, bullEnemy, leftObstructed, rightObstructed */

function obstacle(ctx, image, xCenter, yCenter, height, width, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 0.7;
    this.animationIsDisplayed = false;
    this.animationStartDelay = 0;
    
    this.image = new Image();
    this.image.src = image;
    
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    
    this.height = height;
    this.width = width;
    
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    setTimeout(this.start.bind(this), this.animationStartDelay);
}
//var objCollide = false;

obstacle.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

obstacle.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

obstacle.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

obstacle.prototype.update = function() {
    if(rightObstructed === false) {
        if(keyList[65]) {
            //console.log(this.imagePath);
            this.xCenter++;
            //if the end of the image hits the back border of the image, then reset xPos back to 0
        }
    }
    if(leftObstructed === false) {
        if(keyList[68]) {
            //console.log(this.imagePath);
            this.xCenter--;
        }
    }
};

obstacle.prototype.render = function() {
    if(this.animationIsDisplayed) {
        this.xPos = this.xCenter - parseInt(this.canvasWidth / 2);
        this.yPos = this.yCenter - parseInt(this.canvasHeight / 2);
        //console.log("rendering");
        this.ctx.drawImage(this.image, this.xPos, this.yPos, this.width, this.height);
        //context.drawImage(img,x,y,width,height);
    }
};
