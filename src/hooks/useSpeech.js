import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function useSpeech(defaultLang = 'en-US') {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  const supported = !!synth
  const utteranceRef = useRef(null)
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState([])

  useEffect(() => {
    if (!supported) return
    const updateVoices = () => setVoices(synth.getVoices())
    updateVoices()
    synth.addEventListener('voiceschanged', updateVoices)
    return () => synth.removeEventListener('voiceschanged', updateVoices)
  }, [supported, synth])

  const getVoice = useMemo(() => {
    return (lang) => {
      if (!voices.length) return null
      return (
        voices.find((v) => v.lang === lang) ||
        voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
        voices[0]
      )
    }
  }, [voices])

  const speak = useCallback(
    (text, lang = defaultLang, rate = 1) => {
      if (!supported || !text) return
      if (synth.speaking) synth.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = rate
      const voice = getVoice(lang)
      if (voice) u.voice = voice
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      utteranceRef.current = u
      synth.speak(u)
    },
    [supported, synth, getVoice, defaultLang],
  )

  const cancel = useCallback(() => {
    if (!supported) return
    synth.cancel()
    setSpeaking(false)
  }, [supported, synth])

  return { supported, speaking, speak, cancel, voices }
}
