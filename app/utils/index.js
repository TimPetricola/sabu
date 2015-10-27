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

export function debounce(fn, delay) {
  let timer = null;

  return function () {
    const context = this
    const args = arguments

    clearTimeout(timer)
    timer = setTimeout(() => { fn.apply(context, args) }, delay)
  }
}
