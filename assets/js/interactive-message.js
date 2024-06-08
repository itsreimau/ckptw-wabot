const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");

const InteractiveMessage = generateWAMessageFromContent(ctx.id, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: "Body"
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "Footer"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "Header (Title)",
                    subtitle: "Subtitle (Title)",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "Single Select",
                                sections: [{
                                    title: "Title (1)",
                                    highlight_label: "label",
                                    rows: [{
                                            header: "Header (1)",
                                            title: "Title (1)",
                                            description: "Description (1)",
                                            id: "/ping"
                                        },
                                        {
                                            header: "Header (2)",
                                            title: "Title (2)",
                                            description: "Description (2)",
                                            id: "/ping"
                                        }
                                    ]
                                }]
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Quick Reply",
                                id: "/ping"
                            })
                        },
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "URL",
                                url: "https://github.com/itsreimau/ckptw-wabot",
                                merchant_url: "https://www.google.ca"
                            })
                        },
                        {
                            name: "cta_call",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Call",
                                id: "message"
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Copy",
                                id: "123456789",
                                copy_code: "message"
                            })
                        },
                        {
                            name: "cta_reminder",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Reminder",
                                id: "message"
                            })
                        },
                        {
                            name: "cta_cancel_reminder",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Cancel Reminder",
                                id: "message"
                            })
                        },
                        {
                            name: "address_message",
                            buttonParamsJson: JSON.stringify({
                                display_text: "address_message",
                                id: "message"
                            })
                        },
                        {
                            name: "send_location",
                            buttonParamsJson: ""
                        }
                    ]
                })
            })
        }
    }
}, {});

ctx._client.relayMessage(ctx.id, InteractiveMessage.message, {
    messageId: ctx._msg.key.id
});