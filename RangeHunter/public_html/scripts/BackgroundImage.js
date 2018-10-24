/* global leftObstructed, rightObstructed */

function backgroundImage(ctx, animationStartDelay, canvasHeight, scrollSpeed, imagePath) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.scrollSpeed = scrollSpeed;
    this.animationIsDisplayed = false;
    this.canvasHeight = canvasHeight;
    this.imagePath = imagePath;
    this.image = new Image();
    this.image.src = imagePath;
    //console.log(imagePath);
    this.x = 0;
    this.y = 0;

    //to make sure image is loaded
    var _this = this;
    this.image.onload = function() {
        setTimeout(_this.start.bind(_this), animationStartDelay);
    };
}

backgroundImage.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.scrollSpeed);
};

backgroundImage.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

backgroundImage.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

backgroundImage.prototype.update = function() {
    if(rightObstructed === false) {
        if(keyList[65]) {
            //console.log(this.imagePath);
            this.x++;
            if(this.x >= this.image.width) {
                this.x = 0;
            }
            //if the end of the image hits the back border of the image, then reset xPos back to 0
        }
    }
    if(leftObstructed === false) {
        if(keyList[68]) {
            //console.log(this.imagePath);
            this.x--;
            if(this.x <= -this.image.width) {
                this.x = 0;
            }
        }
    }
};

backgroundImage.prototype.render = function() {
    if (this.animationIsDisplayed) {
        //draw the first image then the next so there are no gaps in scrolling
        //ctx.drawImage(img,x,y,width,height);
        this.ctx.drawImage(this.image, this.x, 0, this.image.width, this.canvasHeight);
        this.ctx.drawImage(this.image, this.x + this.image.width, 0, this.image.width, this.canvasHeight);
        this.ctx.drawImage(this.image, this.x - this.image.width, 0, this.image.width, this.canvasHeight);
    }
};

