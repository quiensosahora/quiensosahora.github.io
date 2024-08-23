let glitch, capture;
let isCloseIcon = false; 
let url = 'https://phrases-server.vercel.app/';
let poem = [];
let showModal = false, showPoem = false, gameOn = false, showPixels = false, isMobile = false, blackBox = false, demoParam = false, demo = false;
let currentCamera = 'user'; 
let thief, centerX, centerY, sizeClue, halfSize;
let opacity;
let pixels = [];
let lastInteractionTime;
const idleTimeLimit = 600000; // Cada 10 minutos de inactividad la web realiza una "demo"

function preload() {
  thief = loadImage("assets/images/thief.png");
}

function setup() {
  frameRate(1.5);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255, 100, 100);
  background(0);
	imageMode(CENTER);

  // Create video
  let constraints = {
    video: {
      facingMode: currentCamera 
    }
  };
  capture = createCapture(constraints);
	capture.size(windowWidth, windowHeight);
	capture.hide();
  
	glitch = new Glitch();

  configureEvents();
  showModalContent();
  getDevice();
  createPixels();
  getQueryParam();
  configureEasterEgg();

  lastInteractionTime = millis();
}

function showModalContent() {
  let bottomButtonBar = select('#bottomButtonBar');
  if (bottomButtonBar) {
    bottomButtonBar.addClass('disabled');
  }
  let rightButtonBar = select('#rightButtonBar');
  if (rightButtonBar) {
    rightButtonBar.addClass('disabled');
  }
  let modal = select('#aboutModal');
  if (modal) {
    modal.style('display', 'block');
  }
}

function getDevice(){
  let agent = window.navigator.userAgent
  if (agent.match(/Android/i)||agent.match(/iPhone/i)||agent.match(/iPad/i)) {
    isMobile = true
  }
}

function createPixels() {
  for (let i = 0; i < random(20,60); i++) { 
    pixels.push(new Pixel(random(width), random(height), random(5, 50)));
  }
}

function draw() {

  if(gameOn) {
    frameRate(30);
    if (opacity > 0) {
      tint(255, opacity);
      image(thief, mouseX, mouseY, thief.width / 3, thief.height / 3);
      opacity -= 0.5;
    } else {
      gameOn = false;
    }
  } else {
    tint(255, 100);
    frameRate(1.5);
   
    glitch.loadQuality(random(0.5,5));

    glitch.loadImage(capture);
    
    glitch.limitBytes(0, 1);
  
    // cuando tira error building image es cuando logra el efecto fantasmagorico
    glitch.replaceBytes(47, 50);
    glitch.buildImage();
  
    glitch.image.blend(capture, 0, 0, width, height, 0, 0, width, height, DIFFERENCE);
    
    image(glitch.image, width / 2, height / 2, glitch.width, glitch.height);

    // pista para encontrar al ladrón
    centerX = random(width);
    centerY = random(height);
    fill(0);
    stroke(255, 150);
    strokeWeight(1.5);
    rect(centerX, centerY, sizeClue);
  }

  if(showPoem) {
    drawText();
  }

  if(showPixels) {
    drawPixels(blackBox);
  }

  if(showModal) {
    showModalContent();
  }

  if(demo) {
    console.log("Demo on");
    showDemo();
    resetTimer();
  }

  if(demoParam && millis() - lastInteractionTime >= idleTimeLimit) {
    demo = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawText() {
  cleanTextContainer();

  for (var i = 0; i < poem.length; i++) {
    let phraseToShow = poem[i].phrase;

    if(phraseToShow.trim() === 'quien sos ahora') {
      let poemDiv = select('#poem');
      let link = '<a href="https://bit.ly/quiensosahora-telegram" target="_blank">Grupo de Telegram</a>';
      poemDiv.html(link);
    } else {
      var metadataOptions = ['location', 'device', 'os'];
      var randomMetadataKey = random(metadataOptions);
      var metadataToShow = poem[i][randomMetadataKey];

      // Crea un elemento de párrafo
      var paragraph = createP(phraseToShow);

      paragraph.attribute('metadata-text', metadataToShow);
      paragraph.attribute('phrase-text', phraseToShow);

      // Agrega un event listener para alternar el texto al hacer clic
      paragraph.mousePressed(function() {
        var currentText = this.html();
        var originalText = this.attribute('phrase-text');
        var alternateText = this.attribute('metadata-text');
        
        if (currentText === alternateText) {
          this.html(originalText);
        } else {
          this.html(alternateText);
        }
      });

      // Agrega el párrafo al contenedor
      paragraph.parent('poem');
    }
  }
}

function drawPixels(blackBox) {
  for(pixel of pixels) {
    if(blackBox) {
      pixel.setEffect(THRESHOLD);
      pixel.setEffectValue(0.5);
    } else {
      pixel.setEffect(POSTERIZE);
      pixel.setEffectValue(3);
    }
    pixel.move();
    pixel.display();
  }
}

function getQueryParam() {
  let params = new URLSearchParams(window.location.search);
  demoParam = params.get('demo');
}

function configureEasterEgg() {
  if(isMobile) {
    sizeClue = 10;
    halfSize = 20;
  } else {
    sizeClue = 20;
    halfSize = 40;
  }
}

function showDemo() {
  var demoOptions = ['text', 'add', 'camera'];
  var demoSelected = random(demoOptions);
  if(demoSelected === 'text') {
    seePoemButtonClicked();
  } else if(demoSelected === 'add') {
    addButtonClicked();
  } else {
    changeCameraClicked();
  }
  demo = false;
}

function resetTimer() {
  lastInteractionTime = millis(); 
}

function mouseDragged() {
  resetTimer();
  if (mouseX > centerX - halfSize && mouseX < centerX + halfSize &&
      mouseY > centerY - halfSize && mouseY < centerY + halfSize) {
    gameOn = true;
    opacity = 100;
  }
}

function mouseMoved() {
  resetTimer();
}

function mousePressed() {
  resetTimer();
}

function keyPressed() {
  resetTimer();
}
