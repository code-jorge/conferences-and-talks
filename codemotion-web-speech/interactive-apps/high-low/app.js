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

// Actualizamos el DOM añadiendo el intento
const registerAttempt = (number, selectedNumber)=> {
  const attempts = document.querySelector(".attempts")
  let data = { emoji: "✅", title: "Correcto" }
  if (number > selectedNumber) data = { emoji: "⬇️", title: "Prueba un número menor" }
  else if (number < selectedNumber) data = { emoji: "⬆️", title: "Prueba un número mayor" }
  attempts.innerHTML += `
    <div class="guess">
      Has probado con el número ${number}. <span class="guess-emoji" title="${data.title}">${data.emoji}</span> 
    </div>
  `
}

// La lógica del juego - según lo que hayamos entendido, decimos una cosa u otra!
const processNumber = (number, selectedNumber)=> {
  if (isNaN(number)) {
    speak('Lo siento, no he podido entenderte')
  }
  else if (number < 0 || number > 100) {
    speak('Solo pienso en números del 1 al 100, ¡no te flipes!')
  }
  else if (number === selectedNumber) {
    speak('¡Correcto! Ese es el número que había pensado')
      .finally(()=> registerAttempt(number, selectedNumber))
  }
  else if (number < selectedNumber) {
    speak(`¡Todavía no! Buscas un número mayor que el ${number}`)
      .finally(()=> registerAttempt(number, selectedNumber))
  }
  else if (number > selectedNumber) {
    speak(`¡Todavía no! Buscas un número menor que el ${number}`)
      .finally(()=> registerAttempt(number, selectedNumber))
  }
}

const startGame = ()=> {
  const selectedNumber = Math.floor(Math.random()*100) + 1
  // Reseteamos el DOM
  document.querySelector(".attempts").innerHTML = ''

  // Iniciamos el reconocimiento de voz
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.lang = 'es-ES'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  // Mostramos el contenido del juego!
  document.querySelector(".game").classList.remove("hidden")

  // Cuando se pulse el botón se esuchará al usuario
  const attemptButton = document.querySelector(".attempt")
  attemptButton.addEventListener("click", ()=> {
    recognition.start()
    attemptButton.setAttribute("disabled", "disabled")
    recognition.addEventListener("end", ()=> attemptButton.removeAttribute("disabled"))
    recognition.addEventListener("error", ()=> attemptButton.removeAttribute("disabled"))
  })

  // Cuando tengamos un resultado válido lo procesamos
  recognition.addEventListener("result", event=> {
    const attempt = event.results[0][0].transcript
    const number = +attempt
    processNumber(number, selectedNumber)
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
// Habilitamos el botón de jugar!
else {
  const start = document.querySelector(".start")
  start.removeAttribute("disabled")
  start.addEventListener("click", startGame)
}
