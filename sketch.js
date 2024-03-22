let glitch, capture;
let isCloseIcon = false; 
let url = 'https://phrases-server.vercel.app/';
let poem = [];
let showModal = false, showPoem = false;
let currentCamera = 'user'; 

function setup() {
  frameRate(3);
  createCanvas(displayWidth, displayHeight);
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
}

function draw() {

  glitch.loadQuality(random(0.3, 1));

  glitch.loadImage(capture);
  
  glitch.limitBytes(0, 1);

  // cuando tira error building image es cuando logra el efecto fantasmagorico
  glitch.replaceBytes(47, 50);
  glitch.buildImage();

  glitch.image.blend(capture, 0, 0, width, height, 0, 0, width, height, DIFFERENCE);
  
  image(glitch.image, width / 2, height / 2, glitch.width, glitch.height);

  if(showPoem) {
    drawText();
  }

  if (showModal) {
    showModalContent();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeCamera() {
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
}

function addButtonClicked() {
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
    changeCameraButton.mousePressed(changeCamera);
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
  if (textBox) {
    savePhrase(textBox.value());
  }
  
  let inputContainer = select('#inputContainer');
  if(inputContainer) {
    hideContainer(inputContainer);
  } 
  showPlusIcon();
  poem = await getPhrases();
  showPoem = true;
  let textContainer = select('#poem');
  if(textContainer) {
    cleanTextContainer();
    showContainer(textContainer);
  }
}

async function shareButtonClicked() {
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
  poem = await getPhrases();
  showPoem = !showPoem;
  let textContainer = select('#poem');
  if(showPoem) {
    cleanTextContainer();
    showContainer(textContainer);
  } else {
    hideContainer(textContainer);
  }
}

function aboutButtonClicked() {
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
    var textToShow = poem[i].phrase;

    // Crea un elemento de párrafo
    var paragraph = createP(textToShow);

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
    function(result) {
      console.log(result);
    },
    // DEFINIR QUE HACER CON EL ERROR
    function(error) {
      console.log(error);
    }
  );
}

async function getPhrases() {
  let phrases = [];

  // await httpGet(url + "7", 
  // 'json', 
  // false, 
  // function(response) {
  //   phrases = response;
  // },
  // // DEFINIR QUE HACER CON EL ERROR
  // function(error) {
  //   console.log(error);
  // });

  return [{phrase:"hola"},{phrase:"hola que tal cheee dogihjdl "},{phrase:"hola"},{phrase:"hola"},{phrase:"hola"},{phrase:"hola"},{phrase:"hola como estas querida"}];
}
