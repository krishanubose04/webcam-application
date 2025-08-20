'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Webcam.module.css';

export default function Webcam() {
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef(null);

    const streamRef = useRef(null);
    const [error, setError] = useState(null);

    async function start() {
        setError(null);
        stop();

        try {
            const constraints = {
                video: { facingMode: 'user' },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setIsStreaming(true);
        } catch (e) {
            const name = e.name || 'Error';
            const msg =
                name === "NotAllowedError"
                    ? "Permission denied"
                    : name === "NotFoundError"
                        ? "No camera found"
                        : name === "AbortError"
                            ? "Camera access aborted"
                            : "Unable to access camera";

            setError(msg);
            setIsStreaming(false);
        }
    }

    function stop() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    }

    useEffect(() => stop, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.header}> Webcam Demo </h1>
            <div className={styles.controls}>
                {!isStreaming ? (
                    <button className={styles.button} onClick={start}>Start</button>
                ) : (
                    <button className={styles.button} onClick={stop}>Stop</button>
                )}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.stage}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    muted
                    playsInline
                />
                {!isStreaming && (
                    <div className={styles.placeholder}>
                        Click Start to preview your webcam.
                    </div>
                )}
            </div>
        </div>
    )
}