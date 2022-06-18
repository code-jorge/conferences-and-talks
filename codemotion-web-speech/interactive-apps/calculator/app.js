// Decimos la frase indicada en español - devolvemos una Promise según haya ido bien, o mal!
const speak = (sentence)=> {
  return new Promise((resolve, reject)=> {
    const voice = synth.getVoices().find(voice=> voice.lang.startsWith("es"))
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.voice = voice
    synth.speak(utterance)
    utterance.addEventListener("end", resolve)
    utterance.addEventListener("error", reject)
  })
} 

const updateDOM = (selector)=> (content)=> {
  const element = document.querySelector(selector)
  element.innerHTML = content
  return content
}

// Capturamos la operación con el reconocimiento de voz.
const captureOperation = (recognition)=> {
  return new Promise((resolve, reject)=> {
    recognition.start()
    recognition.addEventListener("error", ()=> reject('Error escuchando'))
    recognition.addEventListener("end", ()=> reject('Error escuchando'))
    recognition.addEventListener("result", ()=> {
      const operation = event.results[0][0].transcript
      resolve(operation)
    })
  })
}

// Procesamos una operación haciendo transformaciones con Regex
const formatOperation = (instruction)=> {
  const result = instruction
    // Símbolo de suma
    .replaceAll(" más ", " + ")
    .replaceAll(" sumado a ", " + ")
    // Símbolo de resta
    .replaceAll(" menos ", " - ")
    // Símbolo de división
    .replaceAll(" entre ", " / ") 
    .replaceAll(" dividido por ", " / ")
    .replaceAll(" dividido ", " / ")
    // Símbolo de multiplicación
    .replaceAll(" x ", " * ") 
    .replaceAll(" multiplicado por ", " * ")
    .replaceAll(" por ", " * ")

  return result
}

// Procesamos la operación con la insegura magia de eval()
const performOperation = (operation)=> {
  return new Promise((resolve, reject)=> {
    try {
      const result = eval(operation)
      resolve(result)
    } catch (err) {
      reject('Error operando')
    }
  })
}

// Iniciamos SpeechRecognition y SpeechSynthesis
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const synth = window.speechSynthesis

// Si es undefined - no podemos utilizar la Web Speech API
if (typeof SpeechRecognition === 'undefined' || typeof synth === 'undefined') {
  const requirements = document.querySelector(".requirements")
  requirements.innerHTML = 'No se puede utilizar el reconocimiento de voz en este navegador'
  result.classList.add("error")
}

// Habilitamos el botón de calculadora!
else {

  // Iniciamos el reconocimiento de voz
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.lang = 'es-ES'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  const calculate = document.querySelector(".calculate")
  calculate.removeAttribute("disabled")
  calculate.addEventListener("click", ()=> {

    // Reiniciamos el DOM
    calculate.setAttribute("disabled", "disabled")
    document.querySelector(".input").innerHTML = ''
    document.querySelector(".operation").innerHTML = ''
    document.querySelector(".result").innerHTML = ''

    // Vamos haciendo los distintos pasos para la calculadora
    captureOperation(recognition)
      .then(updateDOM(".input"))
      .then(formatOperation)
      .then(updateDOM(".operation"))
      .then(performOperation)
      .then(updateDOM(".result"))
      .then(speak)
      .catch(err=> {
        if (err === 'Error escuchando') return speak('Lo siento, no te he entendido.')
        if (err === 'Error operando') return speak('Lo siento, no he podido calcular eso.')
      })
      .finally(()=> calculate.removeAttribute("disabled"))
  })
}
