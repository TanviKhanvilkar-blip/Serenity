// Initialize Botpress Webchat
window.botpressWebChat.init({
    "botId": "2657337f-9ac4-4806-a0c6-1dcac6cef6ab",           // Replace with your Botpress Bot ID
    "clientId": "2657337f-9ac4-4806-a0c6-1dcac6cef6ab",     // Replace with your Botpress Client ID
    "host": "https://cdn.botpress.cloud/webchat",
    "messagingUrl": "https://messaging.botpress.cloud",
    "botName": "Mental Health Therapist",
    "showPoweredBy": false,
    "containerWidth": "100%",
    "layout": "embedded",
    "showCloseButton": false,
    "stylesheet": "https://webchat-styler-css.botpress.app/prod/code/9d85dd8f-88a3-4f2f-ad29-adb93f30af1e/v94922/style.css"
});

// Automatically show the bot when page loads
window.addEventListener("load", () => {
    // Don't auto-show, only show when user navigates to chat section
    console.log("Botpress chatbot loaded and ready");
});
