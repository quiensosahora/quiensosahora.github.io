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
