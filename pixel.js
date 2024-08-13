class Pixel {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.xSpeed = random(-100, 100);
        this.ySpeed = random(-10, 10);
        this.effect = POSTERIZE;
        this.effectValue = 3;
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Rebote en los bordes
        if (this.x > width || this.x < 0) {
            this.xSpeed *= -1;
        }
        if (this.y > height || this.y < 0) {
            this.ySpeed *= -1;
        }
    }

    setEffect(effect) {
        this.effect = effect;
    }

    setEffectValue(value) {
        this.effectValue = value;
    }

    display() {
        push();
        translate(this.x, this.y);
        let pixelTexture = get(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2); 
        if(this.effectValue) {
            pixelTexture.filter(this.effect, this.effectValue); 
        } else {
            pixelTexture.filter(this.effect); 
        }
        
        noFill();
        stroke(255, 150);
        strokeWeight(0.5);
        rectMode(CENTER); 
        rect(0, 0, this.r * 2, this.r * 2);

        image(pixelTexture, -this.r, -this.r);
        pop();
    }
}
