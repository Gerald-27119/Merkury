package com.merkury.vulcanus.features.email;

import com.merkury.vulcanus.exception.exceptions.EmailNotSendException;
import com.merkury.vulcanus.exception.exceptions.MissingCredentialsException;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.merkury.vulcanus.model.dtos.EmailDto;

import java.util.Map;
import java.util.Properties;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final int[] PORTS = new int[]{25, 465, 587, 2525};
    private final TemplateEngine templateEngine;


    private Properties setProperties(int port) {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "sandbox.smtp.mailtrap.io");
        prop.put("mail.smtp.port", port);
        prop.put("mail.smtp.ssl.trust", "sandbox.smtp.mailtrap.io");

        return prop;
    }

    private Session setSession(int port) {
        var prop = setProperties(port);

        return Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                String username = System.getenv("merkury_email_username");
                String password = System.getenv("merkury_email_password");

                if (username == null || password == null) {
                    System.out.print("no credentials found!");
                    throw new MissingCredentialsException("Password and/or username not found!");
                }

                return new PasswordAuthentication(username, password);
            }
        });
    }

    @Async
    @Retryable(retryFor = EmailNotSendException.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void sendEmail(EmailDto emailDto) {
        boolean emailSent = false;

        for (int port : PORTS) {
            try {
                var session = setSession(port);

                Context context = new Context();
                context.setVariables(emailDto.variables());

                String htmlContent = templateEngine.process(emailDto.template(), context);

                Message mimeMessage = new MimeMessage(session);
                mimeMessage.setFrom(new InternetAddress("noreplay@merkury.com"));
                mimeMessage.setRecipients(
                        Message.RecipientType.TO, InternetAddress.parse(emailDto.receiver()));
                mimeMessage.setSubject(emailDto.title());

                MimeBodyPart mimeBodyPart = new MimeBodyPart();
                mimeBodyPart.setContent(htmlContent, "content/html; charset=utf-8");

                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(mimeBodyPart);

                mimeMessage.setContent(multipart);

                Transport.send(mimeMessage);

                emailSent = true;
                log.info("Email sent successfully!");
                break;
            } catch (Exception ex) {
                log.error("Failed to send email on port {}: {}", port, ex.getMessage());
            }
        }

        if (!emailSent) {
            throw new EmailNotSendException("Failed to send email using all available ports.");
        }
    }

    //Recover must use the same arguments as the method it repeats, even if it doesn't use them
    @Recover
    private void recover(EmailNotSendException e, String sendTo, String subject, String templateName, Map<String, Object> variables) {
        log.error("Unable to send email to {} after multiple attempts. Error: {}", sendTo, e.getMessage());

    }
}
