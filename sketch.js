let glitch, capture;
let saveButton, addInput, inputContainer, saveIcon;
let isCloseIcon = false; 
let url = 'https://phrases-server.vercel.app/';
let poem = [];
let showModal = false, showPoem = false;

function setup() {
  frameRate(1);
  createCanvas(windowWidth, windowHeight);
  background(0);
	imageMode(CENTER);
  
  // Create video
  capture = createCapture(VIDEO);
	capture.size(windowWidth, windowHeight);
	capture.hide();
  
	glitch = new Glitch();
  glitch.pixelate(0.9);
  glitch.loadQuality(0.05);

  createButtonBar();
  createAboutButton();
  createModal();
}

function draw() {

  glitch.loadImage(capture);
  
  glitch.limitBytes(0, 1);

  // cuando tira error building image es cuando logra el efecto fantasmagorico
  glitch.replaceBytes(19, 42);
  glitch.buildImage();

  //BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
  //DIFFERENCE, EXCLUSION, BURN, HARD_LIGHT
  glitch.image.blend(capture, 0, 0, width, height, 0, 0, width, height, DIFFERENCE);
  
  image(glitch.image, width / 2, height / 2, glitch.width, glitch.height);

  if(showPoem) {
    poem.forEach(drawPhrase);
  }

  if (showModal) {
    showModalContent();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addButtonClicked() {
  if(inputContainer == undefined) {
    createContainer();  
  } else {
    showContainer();
  }

  if (isCloseIcon) {
    hideContainer();
    showPlusIcon();
  } else {
    showCloseIcon();
    cleanInput();
  }

  isCloseIcon = !isCloseIcon; 
}

function createContainer() {
  // Crea container div
  inputContainer = createDiv('');
  inputContainer.style('position', 'fixed');
  inputContainer.style('top', '50%');
  inputContainer.style('left', '50%');
  inputContainer.style('transform', 'translate(-50%, -50%)');
  inputContainer.style('display', 'flex'); 
  inputContainer.style('flex-direction', 'row'); 
  inputContainer.style('align-items', 'center');
  inputContainer.style('justify-content', 'center');
  
  // Calcula el tamaño máximo para el contenedor (75% del ancho de la ventana)
  let maxWidth = windowWidth * 0.75 + 'px';
  inputContainer.style('max-width', maxWidth);

  // Crea add input
  addInput = createInput('');
  addInput.size('75%');
  addInput.attribute('maxlength', '30');
  addInput.style('padding', '10px');
  addInput.style('font-size', '14px');
  addInput.style('border', '1px solid #ced4da');
  addInput.style('border-radius', '4px');
  addInput.style('outline', 'none');
  addInput.style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)');
  addInput.style('font-family', 'Inconsolata, monospace');
  addInput.attribute('placeholder', '¿Quién sos ahora?');

  // Crea save button
  saveButton = createButton('');
  saveButton.style('border', 'none'); 
  saveButton.style('outline', 'none'); // Elimina el borde al hacer clic
  saveButton.style('box-shadow', 'none'); // Elimina la sombra
  saveButton.style('background', 'none'); 
  saveButton.style('font-size', '34px'); 
  saveButton.style('color', 'white');
  saveButton.elt.innerHTML = '<i class="bi bi-save"></i>';
  saveButton.mousePressed(saveButtonClicked);  
  // Configura el evento para la tecla "Enter" en el input
  addInput.elt.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
      saveButtonClicked();
    }
  });

  // Agrega el input y el botón al contenedor
  inputContainer.child(addInput);
  inputContainer.child(saveButton);
}

function createButtonBar() {
  // Crea container div
  let buttonContainer = createDiv('');
  buttonContainer.style('position', 'absolute');
  buttonContainer.style('bottom', '3%');
  buttonContainer.style('left', '50%');
  buttonContainer.style('transform', 'translateX(-50%)');
  buttonContainer.style('display', 'flex');
  buttonContainer.style('align-items', 'center');

  // crea add button
  let addButton = createButton('');
  addButton.id('addButton');
  addButton.style('display', 'flex');
  addButton.style('justify-content', 'center'); 
  addButton.style('align-items', 'center'); 
  addButton.style('height', '50px');
  addButton.style('width', '50px');
  addButton.style('border-radius', '50%');
  addButton.style('background-color', 'rgba(150, 150, 150, 0.7)');
  addButton.style('border', 'none');
  addButton.style('font-size', '30px');
  addButton.style('color', 'white'); 
  addButton.style('font-weight', 'bold');
  addButton.style('position', 'absolute');
  addButton.style('left', '50%');
  addButton.style('transform', 'translate(-50%, -50%)');
  addButton.elt.innerHTML = '<i class="bi bi-plus"></i>';
  addButton.mousePressed(addButtonClicked); 

  let shareButton = createButton('');
  shareButton.style('display', 'flex');
  shareButton.style('justify-content', 'center'); 
  shareButton.style('align-items', 'center'); 
  shareButton.style('height', '35px'); 
  shareButton.style('width', '35px');
  shareButton.style('border-radius', '50%');
  shareButton.style('background-color', 'rgba(150, 150, 150, 0.7)');
  shareButton.style('border', 'none');
  shareButton.style('font-size', '18px'); 
  shareButton.style('color', 'white'); 
  shareButton.style('font-weight', 'bold');
  shareButton.style('position', 'absolute');
  shareButton.style('left', 'calc(50% + 50px)');
  shareButton.style('transform', 'translate(-50%, -50%)');
  shareButton.elt.innerHTML = '<i class="bi bi-share"></i>';
  shareButton.mousePressed(shareButtonClicked);

  let seePoemButton = createButton('');
  seePoemButton.style('display', 'flex');
  seePoemButton.style('justify-content', 'center'); 
  seePoemButton.style('align-items', 'center'); 
  seePoemButton.style('height', '35px'); 
  seePoemButton.style('width', '35px');
  seePoemButton.style('border-radius', '50%');
  seePoemButton.style('background-color', 'rgba(150, 150, 150, 0.7)');
  seePoemButton.style('border', 'none');
  seePoemButton.style('font-size', '18px'); 
  seePoemButton.style('color', 'white'); 
  seePoemButton.style('font-weight', 'bold');
  seePoemButton.style('position', 'absolute');
  seePoemButton.style('left', 'calc(50% - 50px)');
  seePoemButton.style('transform', 'translate(-50%, -50%)');
  seePoemButton.elt.innerHTML = '<i class="bi bi-eye"></i>';
  seePoemButton.mousePressed(seePoemButtonClicked);

  buttonContainer.child(addButton);
  buttonContainer.child(shareButton);
  buttonContainer.child(seePoemButton);
}

function createAboutButton() {
  let aboutButton = createButton('');
  aboutButton.style('display', 'flex');
  aboutButton.style('justify-content', 'center'); 
  aboutButton.style('align-items', 'center'); 
  aboutButton.style('height', '30px'); 
  aboutButton.style('width', '30px');
  aboutButton.style('border-radius', '50%');
  aboutButton.style('background-color', 'rgba(150, 150, 150, 0.7)');
  aboutButton.style('border', 'none');
  aboutButton.style('font-size', '18px'); 
  aboutButton.style('color', 'white'); 
  aboutButton.style('font-weight', 'bold');
  aboutButton.style('position', 'absolute');
  aboutButton.style('top', '4%');
  aboutButton.style('right', '0%');
  aboutButton.style('transform', 'translate(-50%, -50%)');
  aboutButton.elt.innerHTML = '<i class="bi bi-question"></i>';
  aboutButton.mousePressed(aboutButtonClicked);
}

function saveButtonClicked() {
  savePhrase(addInput.value())
  hideContainer();
  showPlusIcon();
  addNewPhrase(addInput.value());
}

async function addNewPhrase(phrase) {
  poem = await getPhrases();
  const object = {
    phrase: phrase,
    location: "here",
    device: "unknown"
  };
  // agrega frase recien ingresada para mostrar primera
  poem.splice(0, 1, object);
  showPoem = true;
}

async function shareButtonClicked() {
  if (!navigator.canShare) {
    saveCanvas("quiensosahora", "png")
  } else if (navigator.canShare("esto es una prueba")) {
    alert("navigator.canShare() supported. We can use navigator.share() to send the data.");
    navigator.share("esto es una prueba");
  } else {
    alert("Specified data cannot be shared.");
  }
}

async function seePoemButtonClicked() {
  poem = await getPhrases();
  showPoem = !showPoem;
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
}

function showModalContent() {
  let modal = select('#aboutModal');
  if (modal) {
    modal.style('display', 'block');
  }
}

function createModal() {
  let modalDiv = createDiv('');
  modalDiv.id('aboutModal');
  modalDiv.style('position', 'absolute');
  modalDiv.style('left', '50%');
  modalDiv.style('top', '50%');
  modalDiv.style('transform', 'translate(-50%, -50%)');
  modalDiv.style('background-color', 'rgba(255, 255, 255, 0.9)'); 
  modalDiv.style('padding', '20px');
  modalDiv.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)');
  modalDiv.style('border-radius', '10px'); 
  modalDiv.style('font-family', 'Inconsolata, monospace');
  modalDiv.style('display', 'none');

  // Contenido del modal
  let title = '¿Quién sos ahora?';
  let text = 'Es una web interactiva que distorsiona los cuerpos de lxs usuarixs mientras establecen un diálogo sobre su identidad con el sistema.'
  let author = '<a href="https://www.naysolange.xyz" target="_blank">naysolange.xyz</a>'
  let version = 'v1.0 | 2024;'
  let howToTitle = 'Modo de uso';
  let modalTitle = createP(title);
  let modalVersion = createP(version);
  let modalText = createP(text);
  let modalAuthor = createP(author);
  modalTitle.style('font-weight', 'bold');
  modalTitle.parent('aboutModal');
  modalText.parent('aboutModal');
  modalText.style('margin-bottom', '30px');

  let howTo= createP(howToTitle);
  howTo.style('font-weight', 'bold');
  howTo.parent('aboutModal');

  let howToDiv = createDiv('');
  howToDiv.id('howTo'); 

  let seeDiv = createDiv('');
  seeDiv.elt.innerHTML = '<i class="bi bi-eye"></i> Ver texto generado colectivamente<br></br>';
  seeDiv.parent('howTo');
  howToDiv.parent('aboutModal');

  let addDiv = createDiv('');
  addDiv.elt.innerHTML = '<i class="bi bi-plus"></i> Agregar texto<br></br>';
  addDiv.parent('howTo');
  addDiv.parent('aboutModal');

  let shareDiv = createDiv('');
  shareDiv.elt.innerHTML = '<i class="bi bi-share"></i> Compartir o descargar imagen<br></br>';
  shareDiv.parent('howTo');
  shareDiv.parent('aboutModal');

  modalVersion.style('font-size', '12px');
  modalVersion.parent('aboutModal');
  modalAuthor.style('font-size', '10px');
  modalAuthor.parent('aboutModal');

  // Botón de cerrar
  let closeButton = createDiv('✖');
  closeButton.parent('aboutModal');
  closeButton.style('position', 'absolute');
  closeButton.style('top', '10px');
  closeButton.style('right', '10px');
  closeButton.style('font-size', '20px');
  closeButton.style('cursor', 'pointer');
  closeButton.mousePressed(closeModal);
}

function drawPhrase(element, index) {
  var y = (index + 1) * height / (poem.length + 1);
  fill(255);

  // Establecer el tamaño del texto en relación con el ancho de la ventana
  var textSizeFactor = 0.05;
  var responsiveTextSize = width * textSizeFactor;
  var textToShow = element.phrase;
  
  textSize(responsiveTextSize > 24 ? 24 : responsiveTextSize);
  strokeWeight(2);
  textFont('Inconsolata, monospace');
  var textX = width / 15;
  var textY = y - textAscent() / 2;

  if (
    mouseX > textX &&
    mouseX < textX + textWidth(element.phrase) &&
    mouseY > textY &&
    mouseY < textY + textAscent()
  ) {
    fill(255,0,255); 
    let rand = random(['device', 'location']);

    if(rand === 'device') {
      textToShow = element.device;
    } else {
      textToShow = element.location;
    }
  } else {
    fill(255);
  }

  text(textToShow, width / 15, y);
}

function hideContainer() {
  inputContainer.style('visibility', 'hidden'); 
  inputContainer.style('opacity', '0'); 
}

function showContainer() {
  inputContainer.style('visibility', 'visible'); 
  inputContainer.style('opacity', '1');
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
  addInput.value('');
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

  await httpGet(url + "10", 
  'json', 
  false, 
  function(response) {
    phrases = response;
  },
  // DEFINIR QUE HACER CON EL ERROR
  function(error) {
    console.log(error);
  });

  return phrases;
}
