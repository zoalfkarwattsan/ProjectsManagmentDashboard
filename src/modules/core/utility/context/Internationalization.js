// ** React Imports
import {useState, createContext, useEffect} from 'react'
/* ************************************************ */
import {IntlProvider} from 'react-intl'
import flatten from 'flat'
import _ from "lodash"
/* ************************************************ */
import {_changeAppLang, _setAppLang} from '../Utils'
import {genLang} from '@src/assets/data/locales'
import {useRTL} from "../hooks/useRTL"

// ** Create Context
const Context = createContext()

const IntlProviderWrapper = ({children, additionalLangs}) => {

  const en = additionalLangs.en
  const tr = additionalLangs.tr
  const ar = additionalLangs.ar

  delete additionalLangs.en
  delete additionalLangs.tr
  delete additionalLangs.ar

// ** Menu msg obj
  const menuMessages = {
    en: {...genLang.en, ...en},
    tr: {...genLang.tr, ...tr},
    ar: {...genLang.ar, ...ar},
    ...additionalLangs
  }
  // ** States
  const localStorageLang = localStorage.getItem('APP_LANG')
  const lang = localStorageLang ? localStorageLang : 'en'
  const [locale, setLocale] = useState(lang)
  const [messages, setMessages] = useState(flatten(menuMessages[lang]))
  const [isRtl, setIsRtl] = useRTL()
  _setAppLang(lang)

  useEffect(() => {
    if (locale === 'ar') {
      setIsRtl(true)
    } else {
      setIsRtl(false)
    }
    return () => {
    }
  }, [])

  // ** Switches Language
  const switchLanguage = lang => {
    _changeAppLang(lang)
  }

  // ** Switches Language
  const plainText = key => {
    return _.get(menuMessages, `${locale}.${key}`) ?? key
  }

  return (
    <Context.Provider value={{locale, switchLanguage, plainText}}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale='en'>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}

export {IntlProviderWrapper, Context as IntlContext}
