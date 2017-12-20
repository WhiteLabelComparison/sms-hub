export class Mail {
    to: string;
    from: string;
    subject: string;
    message: string;
    cost?: number;
    timestamp?: string;
    attachments: MailAttachment[]
}

export class MailAttachment {
    filename: string
    content: string
}