let glitch, capture;
let saveButton, addInput, inputContainer, saveIcon;
let isCloseIcon = false; 
let url = 'https://phrases-server.vercel.app/';
let poem = [];
let showModal = false, showPoem = false;

function setup() {
  frameRate(3);
  createCanvas(displayWidth, displayHeight);
  background(0);
	imageMode(CENTER);

  // Create video
  capture = createCapture(VIDEO);
	capture.size(windowWidth, windowHeight);
	capture.hide();
  
	glitch = new Glitch();

  createTextContainer();
  createButtonBar();
  createAboutButton();
  createModal();
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

function addButtonClicked() {
  if(inputContainer == undefined) {
    createContainer();  
  } else {
    showContainer(inputContainer);
  }

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

function createContainer() {
  // Crea container div
  inputContainer = createDiv('');
  inputContainer.style('position', 'absolute');
  inputContainer.style('bottom', '50%');
  inputContainer.style('left', '50%');
  inputContainer.style('transform', 'translate(-50%, -50%)');
  inputContainer.style('display', 'flex'); 
  inputContainer.style('align-items', 'center');
  inputContainer.style('height', '1em');
  inputContainer.style('width', '10em');

  // Crea add input
  addInput = createInput('');
  addInput.id('textBox');
  addInput.attribute('maxlength', '30');
  addInput.style('padding', '9px');
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
  buttonContainer.id("buttonBar");
  buttonContainer.style('position', 'absolute');
  buttonContainer.style('bottom', '3%');
  buttonContainer.style('left', '50%');
  buttonContainer.style('transform', 'translate(-50%, -50%)');
  buttonContainer.style('display', 'flex');
  buttonContainer.style('align-items', 'center');

  // crea add button
  let addButton = createButton('');
  addButton.id('addButton');
  addButton.style('display', 'flex');
  addButton.style('justify-content', 'center'); 
  addButton.style('align-items', 'center'); 
  addButton.style('height', '2em');
  addButton.style('width', '2em');
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
  shareButton.style('height', '2em'); 
  shareButton.style('width', '2em');
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
  seePoemButton.style('height', '2em'); 
  seePoemButton.style('width', '2em');
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
  aboutButton.id('aboutButton');
  aboutButton.style('display', 'flex');
  aboutButton.style('justify-content', 'center'); 
  aboutButton.style('align-items', 'center'); 
  aboutButton.style('height', '2em'); 
  aboutButton.style('width', '2em');
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

function createTextContainer() {
  let textContainer = createDiv('');
  textContainer.id("poem");
  textContainer.style('position', 'absolute');
  textContainer.style('left', '5%');
  textContainer.style('top', '10%');
  textContainer.style('max-height', '80%'); 
  textContainer.style('width', '80%');
  textContainer.style('max-width', '800px');
  textContainer.style('overflow-y', 'auto');
  textContainer.style('font-family', 'Inconsolata, monospace');
  textContainer.style('font-size', '24px');
  textContainer.style('color', 'white');
}


async function saveButtonClicked() {
  savePhrase(addInput.value())
  hideContainer(inputContainer);
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
  let buttonContainer = select('#buttonBar');
  if (buttonContainer) {
    buttonContainer.removeClass('disabled');
  }
}

function showModalContent() {
  let buttonContainer = select('#buttonBar');
  if (buttonContainer) {
    buttonContainer.addClass('disabled');
  }
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
  modalDiv.style('max-height', '80%'); 
  modalDiv.style('width', '80%');
  modalDiv.style('max-width', '800px');
  modalDiv.style('overflow-y', 'auto');
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
  let version = 'v1.0 | 2024'
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
    console.log(textToShow);

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

  await httpGet(url + "7", 
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
