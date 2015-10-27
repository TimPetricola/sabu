export function autobind(target, key, { value: fn }) {
  return {
    configurable: true,
    enumerable: false,

    get() {
      const bound = fn.bind(this)

      Object.defineProperty(this, key, {
        value: bound,
        writable: true,
        configurable: true,
        enumerable: false
      })

      return bound
    }
  }
}

export function getDefaultLang () {
  return window.localStorage.getItem('lang') || 'eng'
}

export function setDefaultLang (lang) {
  window.localStorage.setItem('lang', lang)
}
