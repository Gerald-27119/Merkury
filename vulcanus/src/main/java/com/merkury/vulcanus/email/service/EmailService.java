package com.merkury.vulcanus.email.service;

import com.merkury.vulcanus.email.exception.exceptions.EmailNotSendException;
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
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@NoArgsConstructor
public class EmailService {

    private Properties setProperties() {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "sandbox.smtp.mailtrap.io");
        prop.put("mail.smtp.port", "25");
        prop.put("mail.smtp.ssl.trust", "sandbox.smtp.mailtrap.io");

        return prop;
    }

    private Session setSession() {
        var prop = setProperties();

        return Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                String username = "";
                String password = "";
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void sendEmail(String sendTo, String subject, String message) {
        try {
            var session = setSession();

            Message mimeMessage = new MimeMessage(session);
            mimeMessage.setFrom(new InternetAddress("merkury@gmail.com"));
            mimeMessage.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(sendTo));
            mimeMessage.setSubject(subject);

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(message, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            mimeMessage.setContent(multipart);

            Transport.send(mimeMessage);
        } catch (Exception ex) {
            throw new EmailNotSendException(ex.getMessage());
        }
    }
}
