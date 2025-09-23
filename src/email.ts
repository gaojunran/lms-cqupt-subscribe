import type { Transporter } from "nodemailer"
import type { Config } from "./config"

export function sendEmails(
  config: Config, 
  transporter: Transporter, 
  receivers: string[], 
  subject: string,
  text: string
) {
  console.log(`Sending email to ${receivers.join(", ")}`)
  transporter.sendMail({
    from: `"LMS CQUPT BOT" <${config.email.auth.user}>`,
    to: receivers,
    subject: subject,
    text: text,
  })
}
