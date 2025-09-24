import { TOML } from "bun";
import {readFileSync} from "fs";

export interface Config {
  scrape: {
    /** Cookie from http://lms.tc.cqupt.edu.cn/ */
    cookie: string;
    /** Student ID from the notification API request URL */
    stuId: string;
    /** The count of the fetched notifications */
    count: number;
  };
  task: {
    /** Cron expression for scheduling */
    cron: string;
  };
  email: {
    /** SMTP host, e.g., smtp.126.com */
    host: string;
    /** SMTP port, e.g., 465 */
    port: number;
    /** Whether to use TLS/SSL */
    secure: boolean;
    auth: {
      /** SMTP username, e.g., nebula2021@126.com */
      user: string;
      /** SMTP password (empty string = load from env var $LMS_EMAIL_PASS) */
      pass: string;
    };
  };
  cloudflare: {
      accountId: string;
      namespaceId: string;
      apiToken: string; // (empty string = load from env var $LMS_CF_TOKEN)
  };
}

export function parseConfig(): Config {
  const raw = readFileSync("config.toml", "utf-8")
  const parsed = TOML.parse(raw) as unknown as Config;
  return parsed;
}
