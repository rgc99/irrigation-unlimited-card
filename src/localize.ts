import * as af from "./translations/af.json";
import * as de from "./translations/de.json";
import * as en from "./translations/en.json";
import * as nb from "./translations/nb.json";
import * as sk from "./translations/sk.json";
import * as hu from "./translations/hu.json";
import * as ro from "./translations/ro.json";
import * as it from "./translations/it.json";
import * as es from "./translations/es.json";
import * as pl from "./translations/pl.json";

const languages = {
  af: af,
  de: de,
  en: en,
  es: es,
  hu: hu,
  it: it,
  nb: nb,
  pl: pl,
  ro: ro,
  sk: sk,
};

export class localise {
  private lang: string;

  constructor(preferred: string) {
    if (!(preferred in languages)) {
      preferred = preferred.substring(0, 2);
      if (!(preferred in languages)) {
        preferred = "en";
      }
    }
    this.lang = preferred;
  }

  private find(language: string, keys: string[]) {
    let d = languages[language];
    for (const k of keys) {
      d = d[k];
      if (d === undefined) throw new Error();
    }
    return d;
  }

  public t(key: string): string {
    const keys = key.split(".");
    try {
      return this.find(this.lang, keys);
    } catch (e) {
      try {
        if (this.lang !== "en") return this.find("en", keys);
        else return "";
      } catch (e) {
        return "";
      }
    }
  }
}
