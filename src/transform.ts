import type { NotificationResponseItem } from ".";

export interface Payload {
  course_name: string;
  created_at: string;
  exam_title?: string;
  score?: string;
  end_time?: string;
  homework_title?: string;
  start_time?: string;
  submit_time?: string;
  activity_title?: string;
}

function formatDate(date?: string) {
  if (!date) return "未知";
  const formatter = new Intl.DateTimeFormat("zh-CN", { 
    timeZone: "Asia/Shanghai", // 强制使用北京时间 
    year: "numeric", month: "2-digit", day: "2-digit", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", 
    hour12: false, // 24小时制 
  });
  return formatter.format(new Date(date));
}

type NotificationType =
  | "exam_score_updated"
  | "exam_submit_started"
  | "exam_will_start"
  | "exam_opened"
  | "exam_expiring"
  | "homework_opened_for_submission"
  | "activity_opened"
  | "activity_expiring"
  | "homework_expiring_today"
  | "course_homework_remind";

const notificationTemplates: Record<
  NotificationType,
  (payload: Payload) => { subjectSuffix: string; extraText: string }
> = {
  exam_score_updated: (p) => ({
    subjectSuffix: "考试成绩已出",
    extraText: `考试名：${p.exam_title}\n得分：${p.score}`,
  }),
  exam_submit_started: (p) => ({
    subjectSuffix: "考试开始",
    extraText: `考试名：${p.exam_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n结束时间：${formatDate(p.end_time!)}`,
  }),
  exam_will_start: (p) => ({
    subjectSuffix: "考试即将开始",
    extraText: `考试名：${p.exam_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n结束时间：${formatDate(p.end_time!)}`,
  }),
  exam_opened: (p) => ({
    subjectSuffix: "考试发布",
    extraText: `考试名：${p.exam_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n结束时间：${formatDate(p.end_time!)}`,
  }),
  exam_expiring: (p) => ({
    subjectSuffix: "考试即将截止",
    extraText: `考试名：${p.exam_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n结束时间：${formatDate(p.end_time!)}`,
  }),
  homework_opened_for_submission: (p) => ({
    subjectSuffix: "作业发布",
    extraText: `作业名：${p.homework_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n提交时间：${formatDate(p.submit_time!)}`,
  }),
  activity_opened: (p) => ({
    subjectSuffix: "活动发布",
    extraText: `活动名：${p.activity_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n截止时间：${formatDate(p.end_time!)}`,
  }),
  activity_expiring: (p) => ({
    subjectSuffix: "活动即将截止",
    extraText: `活动名：${p.activity_title}\n开始时间：${formatDate(
      p.start_time!
    )}\n截止时间：${formatDate(
      p.end_time!
    )}`,
  }),
  homework_expiring_today: (p) => ({
    subjectSuffix: "作业即将截止",
    extraText: `作业名：${p.homework_title}\n截止时间：${formatDate(
      p.end_time!
    )}`,
  }),
  course_homework_remind: (p) => ({
    subjectSuffix: "作业提醒",
    extraText: `作业名：${p.homework_title}
    )}`,
  })
};

export function transform(notification: NotificationResponseItem) {
  const payload = notification.payload as Payload;

  const base = {
    subject: `【学在重邮】【${payload.course_name}】`,
    text: `发布时间：${formatDate(payload.created_at)}`,
    data: { type: notification.type, ...payload },
  };

  const template = notificationTemplates[notification.type as NotificationType];
  if (template) {
    const { subjectSuffix, extraText } = template(payload);
    base.subject += subjectSuffix;
    base.text += `\n${extraText}`;
  }

  return base;
}

