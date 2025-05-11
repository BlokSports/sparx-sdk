import { useEffect, useRef, useState } from "react";
import { create, MediaPlayer, PlayerEventType } from "amazon-ivs-player";

import { FaPlay } from "react-icons/fa";
import { GiPauseButton } from "react-icons/gi";
import { FaVolumeUp } from "react-icons/fa";
import { HiVolumeOff } from "react-icons/hi";

import wasmWorkerPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js?url";
import wasmBinaryPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm?url";

import { IStreamProps } from "../../types";
import mainStyles from "./styles.module.css";
import { PlayerProgressBar } from "./PlayerProgressBar";
import { VolumeProgressBar } from "./VolumeProgressBar";

export function Stream({
  streamUrl = "",
  styles,
  playIcon,
  pauseIcon,
  volumeIcon,
  muteIcon,
}: IStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<MediaPlayer>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoRef.current || !create) return;

    const ivsPlayer = create({
      wasmWorker: wasmWorkerPath,
      wasmBinary: wasmBinaryPath,
    });

    ivsPlayer.attachHTMLVideoElement(videoRef.current);
    ivsPlayer.load(streamUrl);
    ivsPlayer.setVolume(volume);

    ivsPlayer.addEventListener(PlayerEventType.TIME_UPDATE, () => {
      setProgress(ivsPlayer.getPosition());
    });

    setPlayer(ivsPlayer);

    return () => {
      ivsPlayer.pause();
      ivsPlayer.removeEventListener(PlayerEventType.TIME_UPDATE, () => {
        setProgress(ivsPlayer.getPosition());
      });
      ivsPlayer.delete();
    };
  }, [streamUrl]);

  const togglePlayPause = () => {
    if (!player) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    player?.setVolume(newVolume);
  };

  const handleMute = (newVolume: number) => {
    setVolume(newVolume);
    player?.setVolume(newVolume);
  };

  const handleSeek = (time: number) => {
    if (player) {
      player?.seekTo(time);
    }
  };

  return (
    <div className={mainStyles.vTrx6Stream_stream} style={styles?.mainBlock}>
      <video
        ref={videoRef}
        className={mainStyles.vTrx6Stream_streamVideo}
        playsInline
        style={styles?.videoBlock}
      />

      <div
        className={mainStyles.vTrx6Stream_controlsContainer}
        style={styles?.controlsContainer}
      >
        <PlayerProgressBar
          progress={progress}
          onSeek={handleSeek}
          styles={{
            progress: styles?.playerProgress,
            progressRange: styles?.playerProgress_range,
            progressThumb: styles?.playerProgress_thumb,
          }}
        />

        <div
          className={mainStyles.vTrx6Stream_controls}
          style={styles?.controls}
        >
          <div
            className={mainStyles.vTrx6Stream_controlBtns}
            style={styles?.controlButtons}
          >
            <button
              className={mainStyles.vTrx6Stream_button}
              onClick={togglePlayPause}
              style={styles?.controlButtons_playButton}
            >
              {isPlaying
                ? pauseIcon || (
                    <GiPauseButton
                      color="#fff"
                      size={18}
                      {...styles?.controlButtons_playIcon}
                    />
                  )
                : playIcon || (
                    <FaPlay
                      color="#fff"
                      size={18}
                      {...styles?.controlButtons_playIcon}
                    />
                  )}
            </button>

            <div
              className={mainStyles.vTrx6Stream_controlsVolume}
              style={styles?.volumeBlock}
            >
              <button
                className={mainStyles.vTrx6Stream_button}
                onClick={() => handleMute(volume > 0 ? 0 : 1)}
                style={styles?.controlButtons_volumeButton}
              >
                {volume > 0
                  ? volumeIcon || (
                      <FaVolumeUp
                        color="#fff"
                        size={18}
                        {...styles?.controlButtons_volumeIcon}
                      />
                    )
                  : muteIcon || (
                      <HiVolumeOff
                        color="#fff"
                        size={18}
                        {...styles?.controlButtons_volumeIcon}
                      />
                    )}
              </button>

              <VolumeProgressBar
                volume={volume}
                onVolumeChange={handleVolumeChange}
                styles={{
                  progress: styles?.volumeProgress,
                  progressRange: styles?.volumeProgress_range,
                  progressThumb: styles?.volumeProgress_thumb,
                }}
              />
            </div>
          </div>

          <div
            className={mainStyles.vTrx6Stream_live}
            style={styles?.liveBlock}
          >
            <div className={mainStyles.vTrx6Stream_liveCircle} />
            <span>live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
