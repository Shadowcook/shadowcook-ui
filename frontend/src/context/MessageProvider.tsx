import React, { useState } from "react";
import {MessageOverlay} from "../components/MessageOverlay";
import { MessageContext, MessageType } from "./messageContext.ts";

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<MessageType>("success");
    const [duration, setDuration] = useState<number>(4000);

    const showMessage = (msg: string, type: MessageType = "success", duration = 4000) => {
        setMessage(msg);
        setType(type);
        setDuration(duration);
    };

    const handleClose = () => {
        setMessage(null);
    };

    return (
        <MessageContext.Provider value={{ showMessage }}>
            {children}
            {message && (
                <MessageOverlay
                    message={message}
                    type={type}
                    onClose={handleClose}
                    duration={duration}
                />
            )}
        </MessageContext.Provider>
    );
};
