package ua.koliambus.spring.boot.model;

import java.time.LocalTime;

public class ChatMessage {

    private MessageType messageType;

    private String content;

    private String sender;

    private LocalTime sendTime;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public LocalTime getSendTime() {
        return sendTime;
    }

    public void setSendTime(LocalTime sendTime) {
        this.sendTime = sendTime;
    }
}
