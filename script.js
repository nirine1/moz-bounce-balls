/* --------------------------------------------------------------------------------------------------------------- */
// setup canvas
/* --------------------------------------------------------------------------------------------------------------- */

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let balls_remain = document.querySelector("#content #count_balls");

/* --------------------------------------------------------------------------------------------------------------- */
// function to generate random number
/* --------------------------------------------------------------------------------------------------------------- */

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

/* --------------------------------------------------------------------------------------------------------------- */
// function to generate random color
/* --------------------------------------------------------------------------------------------------------------- */

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

/* --------------------------------------------------------------------------------------------------------------- */
// Define Shape
/* --------------------------------------------------------------------------------------------------------------- */

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

/* --------------------------------------------------------------------------------------------------------------- */
// Define EvilCircle
/* --------------------------------------------------------------------------------------------------------------- */

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, exists);
    this.color = "white";
    this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.setControls = function() {
    var this_evil_circle = this;
    window.onmousemove = function(e) {
        this_evil_circle.x = e.clientX;
        this_evil_circle.y = e.clientY;
    }    
}

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                let new_balls_array = balls.filter(ball => ball.exists);
                balls = new_balls_array;
                balls_remain.textContent = Number(balls.length);
            }
        }
        else {
            continue;
        }
    }
}


/* --------------------------------------------------------------------------------------------------------------- */
// Define Balls
/* --------------------------------------------------------------------------------------------------------------- */

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
}  

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
                //try to move the ball to 90deg from its position.
            }
        }
    }
}  

/* --------------------------------------------------------------------------------------------------------------- */
// Canvas Script
/* --------------------------------------------------------------------------------------------------------------- */

let evil_circle = new EvilCircle(
    window.innerWidth/2,
    window.innerHeight/2,
    true
);
evil_circle.setControls();

let balls = [];

let content_div = document.querySelector("#content");
let home_div = document.querySelector("#home");

let submit_button = document.querySelector("#home form button");
submit_button.addEventListener('click', handleSubmit);

let exit_button = document.querySelector("#exit_button");
exit_button.addEventListener('click', function(e) {
    content_div.classList.add("visually_hidden");
    home_div.classList.remove("visually_hidden");
    e.target.classList.add("visually_hidden");

    new_balls_array = [];
    balls = new_balls_array;
});

function handleSubmit(e) {
    e.preventDefault();
    let ball_start_number = document.getElementById("balls_number").value;
    balls_remain.textContent = Number(ball_start_number);
    
    home_div.classList.add("visually_hidden");
    content_div.classList.remove("visually_hidden");
    exit_button.classList.remove("visually_hidden");
    
    while (balls.length < ball_start_number) {
        let size = random(10,20);
        let ball = new Ball(
            // ball position always drawn at least one ball width
            // away from the edge of the canvas, to avoid drawing errors
            random(0 + size,width - size),
            random(0 + size,height - size),
            random(-7,7),
            random(-7,7),
            true,
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            size
        );
    
        balls.push(ball);
    }
        
    function loop() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, width, height);
    
        for (let i = 0; i < balls.length; i++) {
            if(balls[i].exists) {
                balls[i].draw();
                balls[i].update();
                balls[i].collisionDetect();
            }
            evil_circle.draw();
            evil_circle.collisionDetect();
        }

        if (balls.length === 0) {
            canvas.classList.remove("no_cursor");
        }
    
        requestAnimationFrame(loop);
    }

    loop();
}
