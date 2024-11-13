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
      /*if(phrase.trim() === 'quien sos ahora') {
        poem.push({"phrase": phrase});
      } else {*/
        poem = await getPhrases();
        // Reemplazo ultimo poema a mostrar por el recien ingresado
        poem.pop();
        poem.push({"phrase": phrase, "location": "algún lugar", "device": "un dispositivo", "os": "un sistema"});
      //}
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

document.getElementById('languageToggleButton').addEventListener('click', () => {
  const texts = {
    es: {
      modalText1: "Es una web interactiva que te distorsiona mientras establecés un diálogo sobre tu identidad con el sistema.",
      modalText2: "Habilitá tu cámara. No se almacena ninguna imagen tuya en ningún lado.",
      usageTitle: "Modo de uso",
      howToText1: "Ver texto generado colectivamente",
      howToText2: "Agregar texto",
      howToText3: "Compartir o descargar imagen",
      howToText4: "Cambiar cámara"
    },
    en: {
      modalText1: "It's an interactive website that distorts you while you engage in a dialogue about your identity with the system.",
      modalText2: "Enable your camera. No images of you are stored anywhere.",
      usageTitle: "How to Use",
      howToText1: "View collectively generated text",
      howToText2: "Add text",
      howToText3: "Share or download image",
      howToText4: "Change camera"
    }
  };

  const currentLang = document.getElementById('languageToggleButton').textContent === 'EN' ? 'en' : 'es';
  const newLang = currentLang === 'es' ? 'en' : 'es';
  document.getElementById('languageToggleButton').textContent = newLang.toUpperCase();

  // Update modal texts
  document.getElementById('modalText1').textContent = texts[newLang].modalText1;
  document.getElementById('modalText2').textContent = texts[newLang].modalText2;
  document.getElementById('usageTitle').textContent = texts[newLang].usageTitle;
  document.getElementById('howToText1').textContent = texts[newLang].howToText1;
  document.getElementById('howToText2').textContent = texts[newLang].howToText2;
  document.getElementById('howToText3').textContent = texts[newLang].howToText3;
  document.getElementById('howToText4').textContent = texts[newLang].howToText4;
}); 
  