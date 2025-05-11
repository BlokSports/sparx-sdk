import React, { useState, useRef, useEffect } from "react";
import mainStyles from "./styles.module.css";

type TStyles = React.CSSProperties;

interface PlayerProgressBarProps {
  progress: number;
  onSeek: (time: number) => void;
  styles: {
    progress?: TStyles;
    progressRange?: TStyles;
    progressThumb?: TStyles;
  };
}

export const PlayerProgressBar = ({
  progress,
  onSeek,
  styles,
}: PlayerProgressBarProps) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progressPercent, setProgressPercent] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = (clientX: number) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;

    const percent = +((clickX * 100) / rect.width).toFixed(2);

    if (percent > 100 || percent < 0) return;

    setProgressPercent(percent);
    onSeek((clickX * progress) / rect.width);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateProgress(event.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={mainStyles.vTrx6Stream_progressContainer}
      onClick={(e) => updateProgress(e.clientX)}
      style={styles?.progress}
    >
      <div className={mainStyles.vTrx6Stream_progressBar} ref={progressBarRef}>
        <div
          className={mainStyles.vTrx6Stream_progressRange}
          style={{ width: `${progressPercent}%`, ...styles?.progressRange }}
        />
      </div>
      <div
        className={mainStyles.vTrx6Stream_progressThumb}
        style={{ left: `${progressPercent}%`, ...styles?.progressThumb }}
        onMouseDown={() => setIsDragging(true)}
      />
    </div>
  );
};
