package com.montblanc.montblanc;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMultipartMessage(String to, String subject, String messageBody) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            logger.info("Attempting to send email to: {} with subject: {}", to, subject);
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(messageBody, true);
            helper.setFrom("webmechanik@gmail.com");
            javaMailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}", to, e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Отправка письма с несколькими inline-изображениями (логотип, товары) по cid.
     *
     * @param to           получатель
     * @param subject      тема
     * @param htmlBody     HTML-тело письма (img src="cid:xxx")
     * @param inlineImages Map: Content-ID -> байты изображения (PNG/JPEG)
     */
    public void sendWithInlineImages(String to, String subject, String htmlBody, Map<String, byte[]> inlineImages) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            logger.info("Attempting to send email with {} inline images to: {} with subject: {}", inlineImages.size(), to, subject);
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom("webmechanik@gmail.com");
            for (Map.Entry<String, byte[]> entry : inlineImages.entrySet()) {
                String cid = entry.getKey();
                byte[] bytes = entry.getValue();
                if (bytes != null && bytes.length > 0) {
                    String contentType = isPng(bytes) ? "image/png" : "image/jpeg";
                    helper.addInline(cid, new ByteArrayResource(bytes), contentType);
                }
            }
            javaMailSender.send(message);
            logger.info("Email with inline images sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email with inline images to {}", to, e);
            throw new RuntimeException(e);
        }
    }

    private static boolean isPng(byte[] bytes) {
        return bytes.length >= 8 && bytes[0] == (byte) 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47;
    }
}