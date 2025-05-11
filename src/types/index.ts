import { ReactNode } from "react";
import { IAnswerData } from "../service/types";

type TIconStyles = {
  size?: string | number;
  color?: string;
  title?: string;
};

type TStyles = React.CSSProperties;

export interface IStreamProps {
  streamUrl: string;
  styles?: {
    mainBlock?: TStyles;
    videoBlock?: TStyles;

    controlsContainer?: TStyles;
    playerProgress?: TStyles;
    playerProgress_range?: TStyles;
    playerProgress_thumb?: TStyles;
    controls?: TStyles;

    controlButtons?: TStyles;
    controlButtons_playButton?: TStyles;
    controlButtons_volumeButton?: TStyles;
    controlButtons_playIcon?: TIconStyles;
    controlButtons_volumeIcon?: TIconStyles;

    volumeBlock?: TStyles;
    volumeProgress?: TStyles;
    volumeProgress_range?: TStyles;
    volumeProgress_thumb?: TStyles;

    liveBlock?: TStyles;
  };
  playIcon?: ReactNode;
  pauseIcon?: ReactNode;
  volumeIcon?: ReactNode;
  muteIcon?: ReactNode;
}

export interface IChatProps {
  styles?: {
    mainBlock?: TStyles;
    scrollBlock?: TStyles;
    scrollBlock_messageBlock?: TStyles;
    scrollBlock_messageBlock_avatar?: TStyles;
    scrollBlock_messageBlock_content?: TStyles;
    scrollBlock_messageBlock_title?: TStyles;
    scrollBlock_messageBlock_messageContainer?: TStyles;
    scrollBlock_messageBlock_message?: TStyles;
    scrollBlock_messageBlock_timestamp?: TStyles;
    inputBlock?: TStyles;
    inputBlock_input?: TStyles;
    inputBlock_submit?: TStyles;
    inputBlock_submitIcon?: TIconStyles;
  };
  roomId: string;
  beforeSentMessage: (msg: string) => Promise<boolean>;
  onInputChange?: (msg: string) => Promise<boolean>;
  url?: string;
  submitIcon?: ReactNode;
}

export interface IQuizProps {
  styles?: {
    mainBlock?: TStyles;
    timerBlock?: TStyles;
    timerBlock_progress?: TStyles;
    pollBlock?: TStyles;
    pollBlock_header?: TStyles;
    pollBlock_headerTitle?: TStyles;
    pollBlock_headerQuestion?: TStyles;
    pollBlock_body?: TStyles;
    pollBlock_list?: TStyles;
    pollBlock_listItem?: TStyles;
    pollBlock_listItemButton?: TStyles;
    pollBlock_listItemButton_indx?: TStyles;
    pollBlock_listItemButton_choise?: TStyles;
    pollBlock_cta?: TStyles;
    pollBlock_ctaSubmit?: TStyles;
    pollBlock_ctaNext?: TStyles;
  };
  artistId?: string;
  episodeId?: string;
  afterUserAnswer: (data: IAnswerData) => Promise<boolean>;
  pollsData: IPollsData
}

export interface IPollsData {
  streamStartsAt: string;
  polls: IPoll[];
}

export interface IPoll {
  question: string;
  showIn: number;
  answerTime: number;
  showResultTime: number;
  choices: IChoise[];
}

export interface IChoise {
  choiceId: string;
  position: string;
  label: string;
  correct?: boolean;
}