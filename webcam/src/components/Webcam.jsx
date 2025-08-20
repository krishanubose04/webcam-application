'use client';

import { useRef, useState } from 'react';
import styles from './Webcam.module.css';

export default function Webcam() {
    const [isStreaming] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    return (
        <div className={styles.container}>
            <h1 className={styles.header}> Webcam Demo </h1>
            <div className={styles.controls}>
                <button className={styles.button} disabled title = "WIP">
                    Start
                </button>
                <button className={styles.button} disabled title = "WIP">
                    Stop
                </button>
            </div>

            <div className={styles.stage}>
                <div className={styles.placeholder}>
                    Webcam preview here.
                </div>
            </div>
        </div>
    )
}