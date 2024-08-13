let glitch, capture;
let isCloseIcon = false; 
let url = 'https://phrases-server.vercel.app/';
let poem = [];
let showModal = false, showPoem = false, gameOn = false, showPixels = false, isMobile = false, blackBox = false;
let currentCamera = 'user'; 
let thief;
let opacity;
let pixels = [];

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
}

function getDevice(){
  let agent = window.navigator.userAgent
  if (agent.match(/Android/i)||agent.match(/iPhone/i)||agent.match(/iPad/i)) {
    isMobile = true
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {

  let centerX = random(width);
  let centerY = random(height);
  let halfSize = 40;

  if (mouseX > centerX - halfSize && mouseX < centerX + halfSize &&
      mouseY > centerY - halfSize && mouseY < centerY + halfSize) {
    gameOn = true;
    opacity = 100;
  }
}

function changeCameraClicked() {
  handleButtonClick(select('#changeCameraButton'));
  if(isMobile) {
    if (currentCamera === 'user') {
      currentCamera = 'environment';
    } else {
      currentCamera = 'user';
    }
    
    let constraints = {
      video: {
        facingMode: currentCamera
      }
    };
    capture.remove(); 
    capture = createCapture(constraints, function(stream) {
      console.log('Camera changed!');
    });
    capture.size(windowWidth, windowHeight);
    capture.hide();
  } else {
    showPixels = !showPixels;
  }
}

function addButtonClicked() {
  handleButtonClick(select('#addButton'));
  let inputContainer = select('#inputContainer');
  if(inputContainer) {
    showContainer(inputContainer);
    if (isCloseIcon) {
      hideContainer(inputContainer);
      showPlusIcon();
    } else {
      showCloseIcon();
      cleanInput();
      setTimeout(() => {
        let textBox = select('#textBox');
        if (textBox) {
          textBox.elt.focus();
        }
      }, 100);
    }
  
    isCloseIcon = !isCloseIcon; 
  }
}

function handleButtonClick(button) {
  button.addClass('pulse');
  button.addClass('clicked');

  setTimeout(function() {
    button.removeClass('pulse');
    button.removeClass('clicked');
  }, 300);
}

function configureEvents() {
  let addButton = select('#addButton');
  if (addButton) {
    addButton.mousePressed(addButtonClicked);
  }

  let shareButton = select('#shareButton');
  if (shareButton) {
    shareButton.mousePressed(shareButtonClicked);
  }

  let seePoemButton = select('#seePoemButton');
  if (seePoemButton) {
    seePoemButton.mousePressed(seePoemButtonClicked);
  }

  let aboutButton = select('#aboutButton');
  if (aboutButton) {
    aboutButton.mousePressed(aboutButtonClicked);
  }

  let changeCameraButton = select('#changeCameraButton');
  if (changeCameraButton) {
    changeCameraButton.mousePressed(changeCameraClicked);
  }

  let modalCloseButton = select('#modalCloseButton');
  if (modalCloseButton) {
    modalCloseButton.mousePressed(closeModal);
  }

  let saveButton = select('#saveButton');
  if (saveButton) {
    saveButton.mousePressed(saveButtonClicked);
  }
  
  let textBox = select('#textBox');
  if (textBox) {
     // Configura el evento para la tecla "Enter" en el input
    textBox.elt.addEventListener('keydown', function (event) {
      if (event.keyCode === 13) {
        saveButtonClicked();
      }
    });
  }
}

async function saveButtonClicked() {
  let textBox = select('#textBox');
  let phrase = textBox.value();
  if (textBox) {
    savePhrase(phrase);
  }
  
  let inputContainer = select('#inputContainer');
  if(inputContainer) {
    hideContainer(inputContainer);
  } 
  showPlusIcon();
  try {
    showPixels = true;
    blackBox = false;
    poem = await getPhrases();
     // Reemplazo ultimo poema a mostrar por el recien ingresado
    poem.pop();
    poem.push({"phrase": phrase, "location": "algún lugar", "device": "un dispositivo", "os": "un sistema"});
    showPoem = true;
    let textContainer = select('#poem');
    if(textContainer) {
      cleanTextContainer();
      showContainer(textContainer);
    }
  }
  finally {
    showPixels = false;
  }
}

async function shareButtonClicked() {
  handleButtonClick(select('#shareButton'));
  if (!navigator.canShare) {
    saveCanvas("quiensosahora", "png");
    return;
  }

  let blob = await getCanvasBlob();
  const files = [new File([blob], 'quiensosahora.png', { type: 'image/png' })];

  if (navigator.canShare({ files })) {
    try {
      await navigator.share({
        files,
        title: "#quiensosahora",
      });
    } catch (error) {
      saveCanvas("quiensosahora", "png");
    }
  } else {
    saveCanvas("quiensosahora", "png");
  }
}

function getCanvasBlob() {
  return new Promise(resolve => {
    let canvas = document.querySelector('canvas');
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/png'); 
  });
}

async function seePoemButtonClicked() {
  handleButtonClick(select('#seePoemButton'));
  try {
    showPixels = true;
    blackBox = true;
    poem = await getPhrases();
    showPoem = !showPoem;
    let textContainer = select('#poem');
    if(showPoem) {
      cleanTextContainer();
      showContainer(textContainer);
    } else {
      hideContainer(textContainer);
    }
  } finally {
    showPixels = false;
    blackBox = false;
  }
}

function aboutButtonClicked() {
  handleButtonClick(select('#aboutButton'));
  showModal = true;
}

function closeModal() {
  showModal = false;
  let modal = select('#aboutModal');
  if (modal) {
    modal.style('display', 'none');
  }
  let bottomButtonBar = select('#bottomButtonBar');
  if (bottomButtonBar) {
    bottomButtonBar.removeClass('disabled');
  }
  let rightButtonBar = select('#rightButtonBar');
  if (rightButtonBar) {
    rightButtonBar.removeClass('disabled');
  } 
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

function cleanTextContainer() {
  let textContainer = select('#poem'); 
  if (textContainer) {
    // Limpio el texto mostrado previamente
    while (textContainer.elt.firstChild) {
      textContainer.elt.removeChild(textContainer.elt.firstChild);
    }
  }
}

function drawText() {
  cleanTextContainer();

  for (var i = 0; i < poem.length; i++) {
    let phraseToShow = poem[i].phrase;
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

function hideContainer(container) {
  container.style('visibility', 'hidden'); 
  container.style('opacity', '0'); 
}

function showContainer(container) {
  container.style('visibility', 'visible'); 
  container.style('opacity', '1');
}

function showPlusIcon() {
  let addButton = select('#addButton');
  if (addButton) {
    addButton.elt.innerHTML = '<i class="bi bi-plus"></i>';
  }
}

function showCloseIcon() {
  let addButton = select('#addButton');
  if (addButton) {
    addButton.elt.innerHTML = '<i class="bi bi-x"></i>';
  }
}

function cleanInput() {
  let textBox = select('#textBox');
  if (textBox) {
    textBox.value('');
  }
}

function savePhrase(phrase) {
  if(!phrase || phrase.trim() === '') return;

  let postData = { phrase: phrase };

  httpPost(
    url,
    'json',
    postData,
    // DEFINIR QUE HACER CON EL ERROR
    function(error) {
      console.log(error);
    }
  );
}

async function getPhrases() {
  let phrases = [];

  await httpGet(url + "7", 
  'json', 
  false, 
  function(response) {
    phrases = response;
  });

  return phrases;
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
