import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IMessage } from "../../service/types";
import { getRoomRequest } from "../../service";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import { formatRelativeTime } from "../../helpers";
import { IChatProps } from "../../types";
import { LuSend } from "react-icons/lu";
import { Loader } from "../loader/Loader";
import mainStyles from "./styles.module.css";

export const Chat = ({
  styles,
  roomId,
  beforeSentMessage,
  onInputChange,
  url = 'https://chat.sparx.studio',
  submitIcon,
}: IChatProps) => {
  const socket = useMemo(() => io(url), [url]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTypingError, setIsTypingError] = useState(false);
  const [error, setError] = useState("");

  const [chat, setChat] = useState<IMessage[]>([]);

  const [message, setMessage] = useState("");

  const getChats = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const { data } = await getRoomRequest(roomId);

      if (Array.isArray(data)) {
        setChat(data);
      }
    } catch (error) {
      console.error("get chat error: ", error);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!url.trim()) return setError("Correct url must be provided");
    getChats();
  }, [url, getChats]);

  useEffect(() => {
    const newMsg = (msg: string) => {
      try {
        const userLocal = localStorage.getItem("user");
        const userData = userLocal ? JSON.parse(userLocal) : null;
        if (userData) {
          setChat((prev) => [
            ...prev,
            {
              user: userData,
              message: msg,
              _id: uuidv4(),
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on(`chat message ${roomId}`, newMsg);

    return () => {
      socket.off(`chat message ${roomId}`, newMsg);
    };
  }, [roomId, socket]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.emit("join room", roomId);

    return () => {
      socket.emit("join room", roomId);
    };
  }, [roomId, socket]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (isTypingError) return;

    if (message.trim()) {
      try {
        const res = await beforeSentMessage(message);

        if (res) {
          const userLocal = localStorage.getItem("user");
          const userData = userLocal ? JSON.parse(userLocal) : null;

          socket.emit("chat message", {
            roomId,
            message,
            userData,
          });
          setMessage("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        block: "nearest",
        inline: "start",
      });
    }
  }, [chat]);

  return (
    <div
      className={mainStyles.vTrx6SideChat_container}
      style={styles?.mainBlock}
    >
      <div
        className={mainStyles.vTrx6SideChat_scrollView}
        style={styles?.scrollBlock}
      >
        {chat?.map((item) => {
          return (
            <div
              key={item._id}
              className={mainStyles.vTrx6SideChat_messageItem}
              style={styles?.scrollBlock_messageBlock}
            >
              <div
                className={mainStyles.vTrx6SideChat_avatarContainer}
                style={styles?.scrollBlock_messageBlock_avatar}
              >
                <img
                  src={
                    item?.user?.avatar ||
                    "https://i.pinimg.com/736x/9b/fb/1b/9bfb1bc507a692758bfe14ba837323e0.jpg"
                  }
                  alt="avatar"
                  title="avatar"
                  className={mainStyles.vTrx6SideChat_avatar}
                />
              </div>

              <div
                className={mainStyles.vTrx6SideChat_messageBlock}
                style={styles?.scrollBlock_messageBlock_content}
              >
                <p
                  className={mainStyles.vTrx6SideChat_title}
                  style={styles?.scrollBlock_messageBlock_title}
                >
                  {item?.user?.userName}
                </p>

                <div
                  className={mainStyles.vTrx6SideChat_messageContainer}
                  style={styles?.scrollBlock_messageBlock_messageContainer}
                >
                  <p
                    className={mainStyles.vTrx6SideChat_textContent}
                    style={styles?.scrollBlock_messageBlock_message}
                  >
                    {item?.message}
                  </p>
                  <p
                    className={mainStyles.vTrx6SideChat_messageDate}
                    style={styles?.scrollBlock_messageBlock_timestamp}
                  >
                    {formatRelativeTime(item?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && <Loader />}

        {!isLoading && !error && chat?.length === 0 && (
          <p className={mainStyles.vTrx6SideChat_dummy}>
            Chat history is empty...
          </p>
        )}
        {error && <p className={mainStyles.vTrx6SideChat_err}>{error}</p>}

        <div ref={chatRef} />
      </div>
      <form
        onSubmit={submit}
        action="submit"
        className={mainStyles.vTrx6SideChat_form}
        style={styles?.inputBlock}
      >
        <input
          value={message}
          onChange={async (e) => {
            const val = e.target.value;
            if (isTypingError) setIsTypingError(false);

            if (onInputChange) {
              try {
                const res = await onInputChange(val);
                if (!res) setIsTypingError(true);

                setMessage(val);
              } catch (error) {
                console.log(error);
              }
            } else {
              setMessage(val);
            }
          }}
          type="text"
          className={mainStyles.vTrx6SideChat_input}
          placeholder="Message..."
          style={{
            ...styles?.inputBlock_input,
            color: isTypingError ? "#e12a2ad9" : "",
          }}
        />
        <button
          disabled={!url.trim()}
          type="submit"
          className={mainStyles.vTrx6SideChat_submit}
          style={styles?.inputBlock_submit}
        >
          {submitIcon || (
            <LuSend
              color="#00b4e4"
              size={24}
              {...styles?.inputBlock_submitIcon}
            />
          )}
        </button>
      </form>
    </div>
  );
};
