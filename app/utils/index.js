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

function videoMetaFromName (filename) {
  const meta = {};
  let match = (
    filename.match(/^.+s(\d{1,2})e(\d{1,2}).+$/i) ||
    filename.match(/^.+[^\d](\d{1,2})x(\d{1,2})[^\d].+$/i)
  );

  if (match) {
    meta.season = parseInt(match[1], 10)
    meta.episode = parseInt(match[2], 10)
  }

  return meta
}


function sanitizeSubtitle (sub) {
  return {
    id: sub.IDSubtitleFile,
    filename: sub.SubFileName,
    downloadsCount: sub.SubDownloadsCnt,
    downloadLink: sub.SubDownloadLink,
    season: sub.SeriesSeason && sub.SeriesSeason.length && parseInt(sub.SeriesSeason, 10),
    episode: sub.SeriesEpisode && sub.SeriesEpisode.length && parseInt(sub.SeriesEpisode, 10)
  }
}

export function sanitizeSubtitles(subtitles, filepath) {
  const videoMeta = videoMetaFromName(filepath)

  return subtitles
    .map((sub) => sanitizeSubtitle(sub, filepath))
    .filter((sub) => {
      if (videoMeta.season && sub.season && videoMeta.season !== sub.season) {
        return false
      }

      if (videoMeta.episode && sub.episode && videoMeta.episode !== sub.episode) {
        return false
      }

      return true
    })
    .sort((a, b) => b.downloadsCount - a.downloadsCount)
}
