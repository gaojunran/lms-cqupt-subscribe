import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { schedule } from "node-cron"
import { appendData, checkExists, list, type Data } from "./persistance"
import { createTransport, type Transporter } from "nodemailer"
import { parseConfig, type Config } from "./config"
import { sendEmails } from "./email"
import { transform } from "./transform"

interface NotificationResponse {
  notifications: NotificationResponseItem[]
}
export interface NotificationResponseItem {
  id: string
  type: string
  payload: any
}

async function fetchNotifications(config: Config, transporter: Transporter): Promise<any> {
  try {
    const res = await (await fetch(`http://lms.tc.cqupt.edu.cn/ntf/users/${config.scrape.stuId}/notifications?offset=0&limit=${config.scrape.count}&&removed=only_mobile&additionalFields=total_count`, {
      headers: {
          "Cookie": config.scrape.cookie,
      }
    })).json() as NotificationResponse
    if ((res as any)?.Message === "Unauthorized") {
      sendEmails(config, transporter, [config.email.auth.user], "Cookie Expired for your LMS Notification", "Cookie Expired for your LMS Notification")
      process.exit(1)
    }
    return res.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error)
  }
}

async function init() {
  const config = parseConfig();
  config.email.auth.pass ||= process.env.LMS_EMAIL_PASS ?? ""
  config.cloudflare.apiToken ||= process.env.LMS_CF_TOKEN ?? ""
  const notificationAdapter = new JSONFile<Data>('./notifications.json')
  const notificationDb = new Low<Data>(notificationAdapter, {});
  await notificationDb.write();
  const receiversAdapter = new JSONFile<Data>('./receivers.json')
  const receiversDb = new Low<Data>(receiversAdapter, {});
  appendData(receiversDb, config.email.auth.user, config.email.auth.user)
  await receiversDb.write();
  const transporter = createTransport(config.email)
  return {
    config,
    notificationDb,
    receiversDb,
    transporter
  }
}

async function task(
  config: Config, 
  notificationDb: Low<Data>,
  receiversDb: Low<Data>,
  transporter: Transporter
) {
  const notifications = await fetchNotifications(config, transporter) as NotificationResponseItem[];
  for (const n of notifications) {
    if (await checkExists(notificationDb, n.id)) {
      continue;
    }
    const {subject, data, text} = transform(n);
    sendEmails(config, transporter, await list(receiversDb), subject, text);
    appendData(notificationDb, n.id, data);
  }
}

const {config, notificationDb, receiversDb, transporter} = await init();
await task(config, notificationDb, receiversDb, transporter);
schedule(config.task.cron, () => task(config, notificationDb, receiversDb, transporter))

// enum Type {
//   ExamScoreUpdated,
//   ExamSubmitStarted,
//   ExamWillStart,
//   ExamOpened,
//   ExamExpiring,
//   HomeworkOpenedForSubmission,

// }
