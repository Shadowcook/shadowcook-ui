import { createContext } from "react";

export type MessageType = "success" | "error" | "info" | "warning";

export interface MessageContextType {
    showMessage: (msg: string, type?: MessageType, duration?: number) => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);
