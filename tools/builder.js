const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");

class InteractiveMessageBuilder {
    constructor(ctx) {
        if (!ctx) throw new Error("Context (ctx) is required");
        this.ctx = ctx;
        this.body = null;
        this.footer = null;
        this.header = null;
        this.buttons = {};
    }

    addBody(text) {
        if (!text) throw new Error("Body text cannot be empty");
        this.body = proto.Message.InteractiveMessage.Body.create({
            text
        });
        return this;
    }

    addFooter(text) {
        if (!text) throw new Error("Footer text cannot be empty");
        this.footer = proto.Message.InteractiveMessage.Footer.create({
            text
        });
        return this;
    }

    addHeader({
        title,
        subtitle,
        hasMediaAttachment = false
    }) {
        if (!title || !subtitle) throw new Error("Header title and subtitle cannot be empty");
        this.header = proto.Message.InteractiveMessage.Header.create({
            title,
            subtitle,
            hasMediaAttachment
        });
        return this;
    }

    addSingleSelect(title, sections) {
        if (!title) throw new Error("Single select title cannot be empty");
        if (!Array.isArray(sections) || sections.length === 0) throw new Error("Sections must be a non-empty array");
        this.buttons.push({
            name: "single_select",
            buttonParamsJson: JSON.stringify({
                title,
                sections
            })
        });
        return this;
    }

    addQuickReply(displayText, id) {
        if (!displayText || !id) throw new Error("Quick reply parameters cannot be empty");
        this.buttons.push({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id
            })
        });
        return this;
    }

    addUrl(displayText, url, merchantUrl = null) {
        if (!displayText || !url) throw new Error("URL parameters cannot be empty");
        const params = {
            display_text: displayText,
            url
        };
        if (merchantUrl) params.merchant_url = merchantUrl;
        this.buttons.push({
            name: "cta_url",
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }

    addCall(displayText, phoneNumber) {
        if (!displayText || !phoneNumber) throw new Error("Call parameters cannot be empty");
        this.buttons.push({
            name: "cta_call",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id: phoneNumber
            })
        });
        return this;
    }

    addCopy(displayText, id, copyCode) {
        if (!displayText || !id || !copyCode) throw new Error("Copy parameters cannot be empty");
        this.buttons.push({
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id,
                copy_code: copyCode
            })
        });
        return this;
    }

    addReminder(displayText, id) {
        if (!displayText || !id) throw new Error("Reminder parameters cannot be empty");
        this.buttons.push({
            name: "cta_reminder",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id
            })
        });
        return this;
    }

    addCancelReminder(displayText, id) {
        if (!displayText || !id) throw new Error("Cancel reminder parameters cannot be empty");
        this.buttons.push({
            name: "cta_cancel_reminder",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id
            })
        });
        return this;
    }

    addAddressMessage(displayText, id) {
        if (!displayText || !id) throw new Error("Address message parameters cannot be empty");
        this.buttons.push({
            name: "address_message",
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                id
            })
        });
        return this;
    }

    addSendLocation() {
        this.buttons.push({
            name: "send_location",
            buttonParamsJson: ""
        });
        return this;
    }

    build() {
        if (!this.body) throw new Error("Body is required to build the message");

        const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: this.body,
            footer: this.footer,
            header: this.header,
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: this.buttons.map(button =>
                    proto.Message.InteractiveMessage.NativeFlowMessage.Button.create(button)
                )
            })
        });

        const messageContent = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: interactiveMessage
                }
            }
        };

        return generateWAMessageFromContent(this.ctx.id, messageContent, {});
    }
}

module.exports = {
    InteractiveMessageBuilder
};