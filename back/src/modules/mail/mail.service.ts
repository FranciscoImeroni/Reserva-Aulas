import { Injectable } from '@nestjs/common';
import { info } from 'console';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;


  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Ignora la verificación de certificados SSL
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    await this.transporter.sendMail({
      from: `"Your App" <franciscoimeroni@gmail.com>`, // Dirección de remitente para pruebas    //from: `"Your App" <${process.env.SMTP_USER}>`,  // Remitente
      to,                                           // Destinatario
      subject,                                      // Asunto
      text,                                         // Texto del correo
      html,                                         // HTML opcional
    });
    console.log("Email sent: ", info);

  }
}
