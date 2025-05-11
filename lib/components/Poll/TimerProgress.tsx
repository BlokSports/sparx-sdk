import mainStyles from "./styles.module.css";

interface ITimerProgress {
  timer: number;
  isResult?: boolean;
  styles?: React.CSSProperties;
}

export const TimerProgress = ({ timer, isResult, styles }: ITimerProgress) => {
  const formatTimer = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Format hours, minutes, and seconds to always show two digits
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div style={styles} className={mainStyles.vTrx6SideChat_timerProgress}>
      {isResult && "View results"} {formatTimer(timer)}
    </div>
  );
};
