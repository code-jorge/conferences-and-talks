// Chrome y Edge utilizan el prefijo webkit - comprobamos también
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const button = document.querySelector(".button")
const result = document.querySelector(".result")

// Si es undefined - no podemos utilizar esta parte de la Web Speech API
if (typeof SpeechRecognition === 'undefined') {
  result.classList.add("error")
  result.innerHTML = 'No se puede utilizar el reconocimiento de voz en este navegador'
}

else {
  // Iniciamos el reconocimiento de voz
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  // Configuramos el botón con el idioma!
  button.removeAttribute("disabled")
  button.addEventListener("click", ()=> {
    const lang = document.querySelector(".select").value 
    recognition.lang = lang
    recognition.start()
  })

  // Procesamos el resultado!
  recognition.addEventListener("result", event=> {
    const text = event.results[0][0].transcript
    result.innerHTML = text
  })
}