import { Sub } from "./SubResults";

type Meta = {
  season?: number;
  episode?: number;
};

function videoMetaFromName(filename: string): Meta {
  let match =
    filename.match(/^.+s(\d{1,2})e(\d{1,2}).+$/i) ||
    filename.match(/^.+[^\d](\d{1,2})x(\d{1,2})[^\d].+$/i);

  return {
    season: match ? parseInt(match[1], 10) : undefined,
    episode: match ? parseInt(match[2], 10) : undefined
  };
}

function sanitizeSubtitle(sub: any): Sub {
  return {
    id: sub.IDSubtitleFile,
    filename: sub.SubFileName,
    downloadsCount: sub.SubDownloadsCnt && parseInt(sub.SubDownloadsCnt, 10),
    downloadLink: sub.SubDownloadLink,
    season:
      sub.SeriesSeason &&
      sub.SeriesSeason.length &&
      parseInt(sub.SeriesSeason, 10),
    episode:
      sub.SeriesEpisode &&
      sub.SeriesEpisode.length &&
      parseInt(sub.SeriesEpisode, 10),
    langIso639: sub.ISO639,
    downloaded: false,
    downloading: false
  };
}

export function sanitizeSubtitles(subtitles: any[], filepath: string) {
  const videoMeta = videoMetaFromName(filepath);

  return subtitles
    .map(sanitizeSubtitle)
    .filter(sub => {
      if (videoMeta.season && sub.season && videoMeta.season !== sub.season)
        return false;

      if (videoMeta.episode && sub.episode && videoMeta.episode !== sub.episode)
        return false;

      return true;
    })
    .sort((a, b) => b.downloadsCount - a.downloadsCount);
}
