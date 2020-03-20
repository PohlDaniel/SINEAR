package de.sinear.utils;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class MailHandlerThread implements Runnable {

    private JavaMailSender javaMailSender;
    private SimpleMailMessage simpleMailMessage;


    public MailHandlerThread(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void run() {
        javaMailSender.send(simpleMailMessage);
    }

    public SimpleMailMessage getSimpleMailMessage() {
        return simpleMailMessage;
    }

    public void setSimpleMailMessage(SimpleMailMessage simpleMailMessage) {
        this.simpleMailMessage = simpleMailMessage;
    }
}
