// Chrome y Edge utilizan el prefijo webkit - comprobamos también
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const button = document.querySelector(".button")
const results = document.querySelector(".results")

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
  recognition.maxAlternatives = 5

  // Configuramos el botón con el idioma!
  button.removeAttribute("disabled")
  button.addEventListener("click", ()=> {
    const lang = document.querySelector(".select").value 
    recognition.lang = lang
    recognition.start()
  })

  // Procesamos el resultado!
  recognition.addEventListener("result", event=> {
    const texts = event.results[0]
    // Limpiamos el HTML antiguo
    results.innerHTML = ''
    // Iteramos y vamos añadiendo soluciones
    for (let i=0; i<texts.length; i++) {
      const text = texts[i]
      const { confidence, transcript } = text
      results.innerHTML += `
        <p class="result">
          <span class="confidence">${(100*confidence).toFixed(2)}%</span>
          ${transcript}
        </p>`
    }
  })
}