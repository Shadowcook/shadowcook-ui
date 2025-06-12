import styles from './PasswordStrengthBar.module.css';
import { useRef, useEffect } from 'react';

interface PasswordStrengthBarProps {
    entropy: {
        entropy: number;
        bitsPerChar: number;
    };
    threshold?: number;
    maxEntropy?: number;
}

export function PasswordStrengthBar({
                                        entropy,
                                        threshold = 90,
                                        maxEntropy = 200,
                                    }: PasswordStrengthBarProps) {
    const gradientRef = useRef<HTMLDivElement>(null);
    const clampedEntropy = Math.min(entropy.entropy, maxEntropy);
    const percent = (clampedEntropy / maxEntropy) * 100;
    const markerPosition = `${(threshold / maxEntropy) * 100}%`;

    useEffect(() => {
        const element = gradientRef.current;
        if (element) {
            const size = `${percent}% 100%`;
            element.style.setProperty('-webkit-mask-size', size);
            element.style.setProperty('mask-size', size);
        }
    }, [percent]);

    return (
        <div className={styles.barContainer}>
            <div
                ref={gradientRef}
                className={styles.gradientBackground}
            />
            <div
                className={styles.thresholdMarker}
                style={{ left: markerPosition }}
                title={`Minimum required: ${threshold}`}
            />
        </div>
    );
}
