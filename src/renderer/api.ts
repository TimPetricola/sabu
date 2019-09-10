import xml from "xml-mapping";

import * as templates from "./api-payloads";

const DEFAULT_HOST = "api.opensubtitles.org";
const DEFAULT_PROTOCOL = "http";
const DEFAULT_ENDPOINT = "/xml-rpc";

function parseXmlResult(raw: any) {
  let result: any = {};

  if (raw == null) return null;

  raw.struct.member.forEach((entry: any) => {
    // Only keep string values
    if (!entry.value.string) return;

    result[entry.name.$t] = entry.value.string.$t;
  });

  return result;
}

class Api {
  private token?: string;
  private options: {
    host: string;
    protocol: string;
    endpoint: string;
  };
  private deferredRequests: any[];

  constructor() {
    this.token = undefined;

    this.options = {
      host: DEFAULT_HOST,
      protocol: DEFAULT_PROTOCOL,
      endpoint: DEFAULT_ENDPOINT
    };

    this.deferredRequests = [];
  }

  async login() {
    const members = await this._request(templates.login);
    const member = members.find((member: any) => member.name.$t === "token");
    const token = member.value.string.$t;
    this.token = token;
    this.deferredRequests.forEach(({ callback, args }) => callback(...args));
    return this.token;
  }

  logout() {
    return new Promise(resolve => {
      if (this.token) {
        this._request(templates.logout).then(() => {
          this.token = undefined;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  search(lang: string, params: { [k: string]: string }) {
    return this._loggedInRequest((resolve: any) => {
      this._request(templates.search, { lang, params })
        .then(members =>
          members.find((member: any) => member.name.$t === "data")
        )
        .then(member => member.value.array.data.value)
        .then(resultsXml =>
          resultsXml instanceof Array ? resultsXml : [resultsXml]
        )
        .then(resultsXml => resultsXml.map(parseXmlResult))
        .then(subs => subs.filter(sub => sub != null))
        .then(resolve);
    });
  }

  searchHash(lang: string, hash: string, size: any) {
    return this.search(lang, { moviehash: hash, moviebytesize: size });
  }

  searchQuery(lang: string, query: string) {
    return this.search(lang, { query: query });
  }

  async _request(template: any, params = {}) {
    const endpoint =
      this.options.protocol + "://" + this.options.host + this.options.endpoint;
    const body = template(Object.assign(params, { token: this.token }));

    const res = await fetch(endpoint, { method: "post", body: body });
    const raw = await res.text();
    const json = xml.load(raw);
    return json.methodResponse.params.param.value.struct.member;
  }

  // Ensure token exists before running executor
  _loggedInRequest(executor: any) {
    if (this.token) {
      return new Promise<any>(executor);
    } else {
      return new Promise<any>((resolve, reject) => {
        this.deferredRequests.push({
          callback: executor,
          args: [resolve, reject]
        });
        this.login();
      });
    }
  }
}

export default new Api();
