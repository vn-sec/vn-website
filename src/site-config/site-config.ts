import { parseConfigFile } from "./utils";
import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = parseConfigFile('./site-config', 'utf8');

export default siteConfig;