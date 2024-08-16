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

function cleanTextContainer() {
  let textContainer = select('#poem'); 
  if (textContainer) {
    // Limpio el texto mostrado previamente
    while (textContainer.elt.firstChild) {
      textContainer.elt.removeChild(textContainer.elt.firstChild);
    }
  }
}

function hideContainer(container) {
  container.style('visibility', 'hidden'); 
  container.style('opacity', '0'); 
}

function aboutButtonClicked() {
    handleButtonClick(select('#aboutButton'));
    showModal = true;
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
      if(phrase.trim() === 'quien sos ahora') {
        poem.push({"phrase": phrase});
      } else {
        poem = await getPhrases();
        // Reemplazo ultimo poema a mostrar por el recien ingresado
        poem.pop();
        poem.push({"phrase": phrase, "location": "algún lugar", "device": "un dispositivo", "os": "un sistema"});
      }
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

  
  
  