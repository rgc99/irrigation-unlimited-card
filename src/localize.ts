import * as af from "./translations/af.json";
import * as de from "./translations/de.json";
import * as en from "./translations/en.json";
import * as nb from "./translations/nb.json";

const languages = {
  af: af,
  de: de,
  en: en,
  nb: nb,
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
