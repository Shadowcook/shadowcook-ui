import React, { useEffect, useState } from "react";
import { formatUtcIsoString } from "../../utilities/tools.ts";
import style from "./TokenExpiryInfo.module.css";
import clockIcon from "@assets/font-awesome/solid/clock.svg";

interface ExpiryInfoProps {
    expiryTimestamp: string;
}

const TokenExpiryInfo: React.FC<ExpiryInfoProps> = ({ expiryTimestamp }) => {
    const [remaining, setRemaining] = useState(calculateRemaining(new Date(expiryTimestamp)));

    useEffect(() => {
        const expiryDate = new Date(expiryTimestamp);
        setRemaining(calculateRemaining(expiryDate));

        const interval = setInterval(() => {
            setRemaining(calculateRemaining(expiryDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTimestamp]);

    if (!expiryTimestamp) {
        return (
            <div>
                <div>No token generated</div>
            </div>
        );
    }

    if (remaining.total <= 0) {
        return (
            <div>
                <div><strong>Valid until:</strong> {formatUtcIsoString(expiryTimestamp)}</div>
                <div>
                    <table className={style.tokenExpiryTimer}>
                        <tbody>
                        <tr>
                            <td className={style.tokenExpiryTimerIcon}>
                                <img className="defaultIcon iconOnText" src={clockIcon} alt="Time remaining" />
                            </td>
                            <td className={style.tokenExpiredText}> expired</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div><strong>Valid until:</strong> {formatUtcIsoString(expiryTimestamp)}</div>
            <div>
                <table className={style.tokenExpiryTimer}>
                    <tbody>
                    <tr>
                        <td className={style.tokenExpiryTimerIcon}>
                            <img className="defaultIcon iconOnText" src={clockIcon} alt="Time remaining" />
                        </td>
                        <td className={style.tokenExpiryTimerText}>
                            {remaining.hours.toString().padStart(2, "0")}:
                            {remaining.minutes.toString().padStart(2, "0")}:
                            {remaining.seconds.toString().padStart(2, "0")}
                        </td>
                    </tr>
                    </tbody>
                </table>
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
