export * from "./types"; // export SiteConfig
export * as utils from "./utils";

import siteConfig from "./site-config";
export default siteConfig; // value siteConfig (raw in config file)

export { type StrictSiteConfig } from "./parser";

import { SiteConfigParser } from "./parser";
import { wrapParser } from "./utils";
export const parsedSiteConfig = wrapParser(siteConfig, SiteConfigParser); // value parsedSiteConfig