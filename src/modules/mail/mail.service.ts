import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>("MAIL_HOST"),
      port: Number(this.configService.getOrThrow<string>("MAIL_PORT")),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>("MAIL_USER"),
        pass: this.configService.getOrThrow<string>("MAIL_PASS"),
      },
    });
  }

  async sendForgotPasswordOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>("MAIL_FROM"),
      to,
      subject: "Reset your password",
      html: `
      <div>
        <h2>Reset your password</h2>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
    });
  }

  async sendRegisterOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>("MAIL_FROM"),
      to,
      subject: "Verify your email",
      html: `
        <div>
          <h2>Verify your email</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });
  }
}
