'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Webcam.module.css';

export default function Webcam() {
    const [isStreaming, setIsStreaming] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    useEffect(() => {
        async function enumerate() {
            try {
                if (!navigator.mediaDevices?.enumerateDevices) {
                    setError('Media devices API not supported in this browser.');
                    return;
                }
                const all = await navigator.mediaDevices.enumerateDevices();
                const cams = all.filter((d) => d.kind === 'videoinput');
                setDevices(cams);
                if (cams.length && !selectDeviceId) {
                    setSelectedDeviceId(cams[0].deviceId);
                }
            } catch {
                setError('Failed to enumerate devices');
            }
        }
        enumerate();
    }, [selectedDeviceId]);

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
                <label htmlFor="camera" className={styles.label}>Camera:</label>
                <select
                    id="camera"
                    className={styles.select}
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    disabled={!devices.length || isStreaming}
                >
                    {devices.map((d, idx) => (
                        <option key={d.deviceId || idx} value={d.deviceId}>
                            {d.label || `Camera ${idx + 1}`}
                        </option>
                    ))}
                </select>
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