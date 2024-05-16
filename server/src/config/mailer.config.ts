import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path";

@Injectable()
export class MailerConfigOptions implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        service: "Gmail",
        host: "smtp.google.com",
        port: 465,
        secure: true,
        auth: {
          user: this.configService.get<string>("MAILER_MAIL_ADDRESS", "grassway-mailer-address"),
          pass: this.configService.get<string>("MAILER_MAIL_SECRET", "grassway-mailer-secret")
        }
      },
      template: {
        dir: join(__dirname, "..", "..", "..", "src/mail-templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }
  }
}