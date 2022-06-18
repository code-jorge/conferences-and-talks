// Funcion para poblar las voces
const createVoiceOptions = (selector, voices)=> {
  selector.innerHTML = ''
  console.log(voices)
  voices.forEach(voice=> {
    var option = document.createElement('option');
    option.textContent = `${voice.name} [${voice.lang}]`
    option.value = voice.name
    selector.appendChild(option)
  })
}

// Tiene un soporte bastante completo!
const synth = window.speechSynthesis

const button = document.querySelector(".button")
const input = document.querySelector(".input")
const select = document.querySelector(".select")

// Si es undefined - no podemos utilizar esta parte de la Web Speech API
if (typeof synth === 'undefined') {
  input.classList.add("error")
  input.setAttribute("disabled", "disabled")
  input.value = 'No se puede utilizar la transcripción a voz en este navegador'
}

else {

  createVoiceOptions(select, synth.getVoices())
  speechSynthesis.addEventListener("voiceschanged", ()=> createVoiceOptions(select, synth.getVoices()))

  // Iniciamos el reconocimiento de voz
  button.addEventListener("click", ()=> {

    button.setAttribute("disabled", "disabled")
    input.setAttribute("disabled", "disabled")

    const selected_voice = select.selectedOptions[0].value

    // Elegimos una voz disponible
    const voice = synth.getVoices().find(voice=> voice.name.startsWith(selected_voice))
    if (!voice) {
      input.value = 'Esa voz no está disponible para reproducir el texto'
    }

    const text = input.value
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.onend = ()=> {
      button.removeAttribute("disabled")
      input.removeAttribute("disabled")
    }
    utterance.onerror = ()=> {
      button.removeAttribute("disabled")
      input.removeAttribute("disabled")
    }
    synth.speak(utterance)
  })
}