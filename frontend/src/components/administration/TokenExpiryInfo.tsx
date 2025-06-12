import React, { useEffect, useState } from "react";
import {formatUtcIsoString} from "../../utilities/tools.ts";

interface ExpiryInfoProps {
    expiryTimestamp: string;
}

const TokenExpiryInfo: React.FC<ExpiryInfoProps> = ({ expiryTimestamp }) => {
    const expiryDate = new Date(expiryTimestamp);
    const [remaining, setRemaining] = useState(calculateRemaining(expiryDate));

    useEffect(() => {
        setRemaining(calculateRemaining(expiryDate));

        const interval = setInterval(() => {
            setRemaining(calculateRemaining(expiryDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryDate]);

    if(!expiryTimestamp){
        return (
            <div>
                <div>No token generated</div>
            </div>
        );
    }

    if (remaining.total <= 0) {
        return (
            <div>
                <div style={{ color: "red" }}>Token expired</div>
            </div>
        );
    }

    return (
        <div>
            <div><strong>Expiry on:</strong> {formatUtcIsoString(expiryDate.toISOString())}</div>
            <div>
                <strong>Countdown:</strong>{" "}
                {remaining.hours.toString().padStart(2, "0")}:
                {remaining.minutes.toString().padStart(2, "0")}:
                {remaining.seconds.toString().padStart(2, "0")}
            </div>
        </div>
    );
};

function calculateRemaining(targetDate: Date) {
    const now = new Date();
    const total = targetDate.getTime() - now.getTime();

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60));

    return { total, hours, minutes, seconds };
}

export default TokenExpiryInfo;
