/* global leftObstructed, rightObstructed */

function endGoal(ctx, xCenter, yCenter, height, width, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 0.7;
    this.animationIsDisplayed = false;
    this.animationStartDelay = 0;
    
    this.x = xCenter;
    this.y = yCenter;
    
    this.height = height;
    this.width = width;
    
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    setTimeout(this.start.bind(this), this.animationStartDelay);  
}

endGoal.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

endGoal.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

endGoal.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

endGoal.prototype.update = function(){
    if(rightObstructed === false) {
        if(keyList[65]) {
            //console.log(this.imagePath);
            this.x++;
            //if the end of the image hits the back border of the image, then reset xPos back to 0
        }
    }
    if(leftObstructed === false) {
        if(keyList[68]) {
            //console.log(this.imagePath);
            this.x--;
        }
    }
};

endGoal.prototype.render = function(){
     if(this.animationIsDisplayed) {
        //console.log("rendering");
        this.xPos = this.x - parseInt(this.canvasWidth / 2);
        this.yPos = this.y - parseInt(this.canvasHeight / 2);
        this.ctx.beginPath();
        this.ctx.lineWidth="6";
        this.ctx.strokeStyle="red";
        this.ctx.rect(this.xPos, this.yPos, this.width, this.height);
        this.ctx.stroke();
    }
};
