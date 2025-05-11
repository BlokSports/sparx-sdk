import mainStyles from "./styles.module.css";
import { TimerProgress } from "./TimerProgress";
import { IChoise, IPoll, IQuizProps } from "../../types";
import { useEffect, useState } from "react";
import { setUserAnswer } from "../../service";
import { DateTime } from "luxon";

export function Poll({ afterUserAnswer, styles, pollsData }: IQuizProps) {

  const pollsList = pollsData?.polls;
  const streamStart = pollsData?.streamStartsAt;

  const [currentUserTime, setCurrentUserTime] = useState<string>(
    DateTime.now().toSeconds().toFixed(0)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUserTime(DateTime.now().toSeconds().toFixed(0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isShown, setIsShown] = useState<boolean>(false);
  const [currentQuestion, setCurrentQustion] = useState<IPoll | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<null | IChoise>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [curAnswerTime, setCurAnswerTime] = useState<number | null>(null);
  const [curViewResultsTime, setCurViewResultsTime] = useState<number | null>(
    null
  );

  // if user already answered current question show his choise
  useEffect(() => {
    const data = localStorage.getItem("answerData");
    if (data) {
      const answerData = JSON.parse(data);

      setSelectedAnswer(
        currentQuestion?.choices?.find((item) => {
          setIsSubmitted(true);
          if (item.choiceId === answerData?.answerId) {
            return item;
          } else {
            setIsSubmitted(false);
          }
        }) || null
      );
    }
  }, [currentQuestion]);

  const saveUserAnswer = async () => {
    if (!currentQuestion) return;

    setIsLoading(true);

    try {
      const userLocal = localStorage.getItem("user");
      const userData = userLocal ? JSON.parse(userLocal) : null;

      const answerData = {
        answerTime: currentQuestion?.answerTime - (curAnswerTime || 0),
        // pollId: currentQuestion?.pollId,
        answerId: selectedAnswer?.choiceId || null,
        isCorrectAnswer: !!selectedAnswer?.correct,
        userId: userData?._id,
      };

      localStorage.setItem("answerData", JSON.stringify(answerData));

      if (userData) {
        await afterUserAnswer(answerData);
        await setUserAnswer(answerData);
      } else {
        console.error("To save answer user data must be provided");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pollsList?.length) return;
    if (!streamStart) return;

    if (!isShown) {
      const dateTime = DateTime.fromISO(streamStart);

      const currentQuestion = pollsList?.find((poll) => {
        // Add question showIn time
        const updatedTime = dateTime.plus({ seconds: poll?.showIn });
        const updatedTimeSec = updatedTime.toSeconds().toFixed(0);

        // Period of time, when current poll must be shown
        const fullTime = updatedTime.plus({ seconds: poll?.answerTime });
        const fullTimeSec = fullTime.toSeconds().toFixed(0);

        if (
          +updatedTimeSec < +currentUserTime &&
          +currentUserTime < +fullTimeSec
        )
          return poll;
        return null;
      });

      if (currentQuestion) {
        setIsShown(true);
        setCurrentQustion(currentQuestion);

        const currentDate = DateTime.now();
        const startPollAt = dateTime.plus({ seconds: currentQuestion?.showIn });
        const endPollAt = startPollAt.plus({
          seconds: currentQuestion?.answerTime,
        });

        const difference = endPollAt.diff(currentDate, ["seconds"]);
        const secondsRemaining = difference.seconds.toFixed(0);

        setCurAnswerTime(+secondsRemaining);
      }
    }
  }, [pollsList, isShown, currentUserTime, streamStart]);

  useEffect(() => {
    if (!isShown || !currentQuestion || !streamStart) return;
    if (curAnswerTime === null || curViewResultsTime) return;

    if (curAnswerTime === 0) {
      if (!isSubmitted) {
        saveUserAnswer();
        setIsSubmitted(true);
      }
      const dateTime = DateTime.fromISO(streamStart);

      const currentDate = DateTime.now();
      const startViewPollAt = dateTime.plus({
        seconds: currentQuestion?.showIn + currentQuestion?.answerTime,
      });
      const endViewPollAt = startViewPollAt.plus({
        seconds: currentQuestion?.showResultTime,
      });

      const difference = endViewPollAt.diff(currentDate, ["seconds"]);
      const secondsRemaining = difference.seconds.toFixed(0);

      setCurViewResultsTime(+secondsRemaining);
    }

    const interval = setInterval(() => {
      setCurAnswerTime((prev) => {
        if (prev === null) return prev;

        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isShown, currentQuestion, curViewResultsTime, curAnswerTime]);

  useEffect(() => {
    if (!isShown || !currentQuestion) return;
    if (curViewResultsTime === null || curAnswerTime) return;

    if (curViewResultsTime === 0) {
      setIsShown(false);
      setCurAnswerTime(null);
      setCurViewResultsTime(null);
      setCurrentQustion(null);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }

    const interval = setInterval(() => {
      setCurViewResultsTime((prev) => {
        if (prev === null) return prev;

        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [curAnswerTime, isShown, currentQuestion, curViewResultsTime]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!currentQuestion) return;
    setIsSubmitted(true);
    saveUserAnswer();
  };

  if (!isShown) return <></>;

  return (
    <div
      className={mainStyles.vTrx6SideChat_container}
      style={styles?.mainBlock}
    >
      <div
        className={mainStyles.vTrx6SideChat_timer}
        style={styles?.timerBlock}
      >
        {currentQuestion && (
          <>
            {!!curAnswerTime && (
              <TimerProgress
                timer={curAnswerTime}
                styles={styles?.timerBlock_progress}
              />
            )}
            {!!curViewResultsTime && (
              <TimerProgress
                isResult
                timer={curViewResultsTime}
                styles={styles?.timerBlock_progress}
              />
            )}
          </>
        )}
      </div>
      <div className={mainStyles.vTrx6SideChat_quiz} style={styles?.pollBlock}>
        <div
          className={mainStyles.vTrx6SideChat_quizHeader}
          style={styles?.pollBlock_header}
        >
          <p
            className={mainStyles.vTrx6SideChat_quizAmount}
            style={styles?.pollBlock_headerTitle}
          >
            Question
          </p>
          <p
            className={mainStyles.vTrx6SideChat_quizQuestion}
            style={styles?.pollBlock_headerQuestion}
          >
            {currentQuestion?.question}
          </p>
        </div>
        <div
          className={mainStyles.vTrx6SideChat_quizBody}
          style={styles?.pollBlock_body}
        >
          <ul
            className={mainStyles.vTrx6SideChat_quizList}
            style={styles?.pollBlock_list}
          >
            {currentQuestion?.choices?.map((item, i) => {
              const isCorrectAnswer = item?.correct;
              const currentItem = item?.choiceId;
              return (
                <li
                  key={i}
                  className={mainStyles.vTrx6SideChat_quizListItem}
                  style={styles?.pollBlock_listItem}
                >
                  <button
                    onClick={() =>
                      setSelectedAnswer((prev) =>
                        prev?.choiceId === currentItem ? null : item
                      )
                    }
                    className={`${mainStyles.vTrx6SideChat_quizListButton} ${
                      selectedAnswer?.choiceId === item?.choiceId
                        ? mainStyles.vTrx6SideChat_quizListButtonActive
                        : ""
                    }
                      ${
                        curAnswerTime === 0 &&
                        (isCorrectAnswer
                          ? mainStyles.vTrx6SideChat_quizListButtonCorrent
                          : currentItem === selectedAnswer?.choiceId
                          ? mainStyles.vTrx6SideChat_quizListButtonIncorrent
                          : "")
                      }

                      `}
                    disabled={curAnswerTime === 0 || isLoading || isSubmitted}
                    style={styles?.pollBlock_listItemButton}
                  >
                    <div
                      className={mainStyles.vTrx6SideChat_quizListItemIndx}
                      style={styles?.pollBlock_listItemButton_indx}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={mainStyles.vTrx6SideChat_quizListItemAnswer}
                      style={styles?.pollBlock_listItemButton_choise}
                    >
                      {item?.label}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div
            className={mainStyles.vTrx6SideChat_quizCta}
            style={styles?.pollBlock_cta}
          >
            <button
              className={mainStyles.vTrx6SideChat_quizCtaBtn}
              onClick={handleSubmit}
              disabled={isLoading || !curAnswerTime || isSubmitted}
              style={styles?.pollBlock_ctaSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
