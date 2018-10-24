/* global boarEnemy, bullEnemy, crocodileEnemy, enemies, obstacles, leftObstructed, rightObstructed, goal, pitfalls, isDead */

//creates player character
function characterAnimation(ctx, xCenter, yCenter, width, height, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.animationInterval = null;
    this.animationSpeed = 100;
    this.animationIsDisplayed = false;
    this.animationStartDelay = 0;
    //how many ms before animation begins
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.xDefault = this.xCenter;
    this.yDefault = this.yCenter;
    this.xPos;
    this.yPos;
    //position of the player character
    this.defaultWidth = width;
    this.defaultHeight = height;
    this.width = this.defaultWidth;
    this.height = this.defaultHeight;
    //size of the player character
    this.walkSpeed = 0;
    this.direction;
    //movement speed of the player character
    this.jumpHeight = 100;
    //height of jump;
    this.spriteColumns = 4;
    this.spriteRows = 5;
    this.atkSpriteColumns = 4;
    this.atkSpriteRows = 2;
    //Sprite dimensions to split up animation frames
    //rows: 4 -> Idle, Walk Left, Walk Right, Jump
    //columns: 5 -> 5 frames per animation (loops)
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    //height and width of sprite

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    //get canvas size so we can use them for translations
    this.column = 0;
    this.startSprite = 0;
    this.endSprite;
    this.currentSprite;
    this.row;
    this.characterImage = new Image();
    this.characterImage.src = "images/gameAssets/hunter.png";
    
    this.characterAttack = new Image();
    this.characterAttack.src = "images/gameAssets/hunterHit.png";
    
    this.isAttacking = false;
    this.attackStage = 0;
    this.attackFrame = 0;
    
    this.isJumping = false;
    this.jumpFrame = 0;
    this.jumpStage = 0;
    
    this.setDirection(this.IDLE);

    setTimeout(this.start.bind(this), this.animationStartDelay);
}

characterAnimation.prototype.IDLE = 0;
characterAnimation.prototype.LEFT = 1;
characterAnimation.prototype.RIGHT = 2;
characterAnimation.prototype.JUMPLEFT = 3;
characterAnimation.prototype.JUMPRIGHT = 4;
characterAnimation.prototype.JUMP = 0;
//direction values for setting new directions on keyboard input (a, d, space(jump))

characterAnimation.prototype.ATTACK = 1;
characterAnimation.prototype.ATTACKREV = 0;

//Startup, stop and end functions
characterAnimation.prototype.start = function() {
    this.animationIsDisplayed = true;
    this.animationInterval = setInterval(this.update.bind(this), this.animationSpeed);
};

characterAnimation.prototype.stop = function() {
    this.animationIsDisplayed = true;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
};

characterAnimation.prototype.end = function() {
    this.stop();
    this.animationIsDisplayed = false;
};

//Update, render & so on
characterAnimation.prototype.update = function() {
    this.collisionDetect();
    this.pitFall();
    if(this.isJumping === false && this.isAttacking === false) {
        if(keyList[65]) {
            //console.log("A is pressed");
            //this.xCenter -= 5;
            if(this.getDirection() !== this.LEFT) {
                this.setDirection(this.LEFT);
            }
        }
        if(keyList[68]) {
            //console.log("D is pressed");
            //this.xCenter += 5;
            if(this.getDirection() !== this.RIGHT) {
                this.setDirection(this.RIGHT);
            }
        }
        if(keyList[32]) {
            //console.log("SPACE is pressed");
            this.isJumping = true;
            if(keyList[65]) {
                if(this.getDirection() !== this.JUMPLEFT) {
                    this.setDirection(this.JUMPLEFT);
                }
            }
            else if(keyList[68]) {
                if(this.getDirection() !== this.JUMPRIGHT) {
                    this.setDirection(this.JUMPRIGHT);
                }
            }
            else {
                if(this.getDirection() !== this.JUMP) {
                    this.setDirection(this.JUMP);
                }
            }
            //console.log(this.getDirection());
            this.column = 0;
            this.jump();
        }
        if(keyList[13]) {
            //attacking
            if(keyList[65]) {
                if(this.getDirection() !== this.ATTACKREV) {
                    this.setDirection(this.ATTACKREV);
                }
            }
            else if(keyList[68]) {
                if(this.getDirection() !== this.ATTACK) {
                    this.setDirection(this.ATTACK);
                }
            }
            else if(this.getDirection() === this.IDLE) {
                this.setDirection(this.ATTACK);
            }
            this.isAttacking = true;
            this.column = 0;
            this.attack();
        }
        if(!keyList[65] && !keyList[68] && !keyList[32]) {
            if(this.getDirection() !== this.IDLE) {
                this.setDirection(this.IDLE);
            }
        }
        
        //sprite increments
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
    }

    if(this.isJumping) {
        this.jump();
    }
    else if(this.isAttacking) {
        //console.log(this.isAttacking);
        this.attack();
    }
};

characterAnimation.prototype.jump = function() {
    this.jumpFrame++;
    if(this.jumpFrame === (this.jumpStage + 5)) {
        this.jumpStage = this.jumpFrame;
        this.column++;
        this.currentSprite++;
    }
    if(this.jumpFrame <= 10) {
        this.yCenter -= 10;
        //console.log(this.yCenter);
    }
    if(this.jumpFrame > 10 && this.jumpFrame <= 20) {
        this.yCenter += 10;
        //console.log(this.yCenter);
    }
    if(this.column >= this.spriteColumns) {
        //console.clear();
        this.yCenter = this.yDefault;
        this.isJumping = false;
        this.jumpFrame = 0;
        this.jumpStage = this.jumpFrame;
        this.column = 0;
        this.currentSprite = this.startSprite;
    }
};

characterAnimation.prototype.attack = function() {
    this.width = (this.characterAttack.width / this.atkSpriteColumns) * 2;
    this.height = (this.characterAttack.height / this.atkSpriteRows) * 2;
    this.attackFrame++;
    this.hitDetect();
    if(this.attackFrame === (this.attackStage + 1)) {
        this.attackStage = this.attackFrame;
        this.column++;
        this.currentSprite++;
    }
    if(this.column >= this.spriteColumns) {
        this.isAttacking = false;
        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this.attackFrame = 0;
        this.attackStage = this.attackFrame;
        this.column = 0;
        this.currentSprite = this.startSprite;
        this.setDirection(this.IDLE);
    }
};

characterAnimation.prototype.render = function() {
    if(this.animationIsDisplayed) {
        this.xPos = this.xCenter - parseInt(this.canvasWidth / 2);
        this.yPos = this.yCenter - parseInt(this.canvasHeight / 2);
        //       drawImage(img,xStart,yStart,
        //                swidth,sheight,xCenter,yCenter,width,height);
        if(this.isAttacking) {
            this.spriteWidth = (this.characterAttack.width / this.atkSpriteColumns);
            this.spriteHeight = (this.characterAttack.height / this.atkSpriteRows);
            this.ctx.drawImage(this.characterAttack, this.column * this.spriteWidth, this.row * this.spriteHeight,
                               this.spriteWidth, this.spriteHeight, this.xPos, this.yPos, this.width, this.height);
        }
        else {
            this.spriteWidth = (this.characterImage.width / this.spriteColumns);
            this.spriteHeight = (this.characterImage.height / this.spriteRows);
            this.ctx.drawImage(this.characterImage, this.column * this.spriteWidth, this.row * this.spriteHeight,
                               this.spriteWidth, this.spriteHeight, this.xPos, this.yPos, this.width, this.height);
        }
    };
};

characterAnimation.prototype.setDirection = function(newDirection) {
    this.direction = newDirection;
    this.startSprite = this.direction * this.spriteColumns;
    if(this.isAttacking) {
        this.endSprite = this.startSprite + this.atkSpriteColumns;
    }
    else {
        this.endSprite = this.startSprite + this.spriteColumns;
    }
    this.row = this.direction;
    this.column = 0;
};

characterAnimation.prototype.getDirection = function() {
    return this.direction;
};

characterAnimation.prototype.hitDetect = function() {
    for(var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        //boarEnemy(ctx, xCenter, yCenter, width, height, hp, canvasWidth, canvasHeight)
        if((this.xCenter + this.width >= e.xCenter) && (this.xCenter <= e.xCenter + e.width)) {
            //console.log("true");
            enemies[i].end();
        }
    }
};

characterAnimation.prototype.pitFall = function() {
    for(var i = 0; i < pitfalls.length; i++) {
        var pf = pitfalls[i];
        //if (rect1.x < rect2.x + rect2.width &&   rect1.x + rect1.width > rect2.x &&   rect1.y < rect2.y + rect2.height &&   rect1.height + rect1.y > rect2.y) {    // collision detected!}
        if((this.xCenter + this.width >= pf.x) && (this.xCenter <= pf.x + pf.width) && (this.yCenter + this.height >= pf.y) && (this.yCenter <= pf.y + pf.height)) {
            //console.log(this.yCenter);
            this.yCenter += 20;
        }
        if(this.yCenter >= 1050) {
            isDead = true;
            //console.log(isDead);
        }
    }
};

characterAnimation.prototype.collisionDetect = function() {
    for(var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];
        //console.log(o.image);
        if((this.xCenter + this.width >= o.xCenter) && (this.xCenter <= o.xCenter + o.width) && (this.yCenter >= o.yCenter) && (this.yCenter <= o.yCenter + o.height)) {
            rightObstructed = true;
            leftObstructed = false;
            //console.log("right: " + rightObstructed);
        }
        else if((this.xCenter - this.width <= o.xCenter) && (this.xCenter >= o.xCenter - o.width) && (this.yCenter <= o.yCenter) && (this.yCenter >= o.yCenter - o.height)) {
            leftObstructed = true;
            rightObstructed = false;
            //console.log("left: " + leftObstructed);
        }
        if(keyList[65]) {
            leftObstructed = false;
        }
        if(keyList[68]) {
            rightObstructed = false;
        }
    }
    var end = goal;
    if((this.xCenter + this.width >= end.x) && (this.xCenter <= end.x + end.width)) {
        gameOver = true;
        console.log("LEVEL COMPLETE");
    }
};