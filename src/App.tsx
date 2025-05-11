import { Poll } from "./components/poll";
import { Stream } from "./components/stream";
import { useSetUserData } from "./hooks/useSetUserData";
import { Chat } from "./components/chat";
import "./App.css";

function App() {
  useSetUserData({ userName: "Pipka", _id: "123456789", avatar: "" });

  return (
    <div className="test">
      <Chat
        roomId="123123"
        beforeSentMessage={() => new Promise((res) => res(true))}
        onInputChange={(text) =>
          new Promise((res) => {
            if (text.includes("*")) return res(false);

            res(true);
          })
        }
      />
      <Stream streamUrl="https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8" />

      <Poll
        afterUserAnswer={() => new Promise((res) => res(true))}
        pollsData={samplePollData}
      />
    </div>
  );
}

export default App;


const samplePollData = {
  "streamStartsAt": "2025-03-03T15:56:20.882Z",
  "polls": [
      {
          "question": "What is your favourite Showdown Menu item so far?",
          "showIn": 5,
          "answerTime": 10,
          "showResultTime": 20,
          "choices": [
              {
                  "choiceId": "7aa6f718-1b05-4323-a1db-a52d018974a0",
                  "position": "1",
                  "label": "“The Big Mac®-David” – Double Big Mac® "
              },
              {
                  "choiceId": "fbbca80e-fbf6-45a6-a7fa-1e2a3f54bb1f",
                  "position": "2",
                  "label": "“The Smoky Quarter Papi”– Smoky BBQ Quarter Pounder® ",
                  "correct": true
              },
              {
                  "choiceId": "ee3602dd-7efc-4a0e-be87-965f2ee2361c",
                  "position": "3",
                  "label": "“Spicy Junior Chirpy” – Spicy Buffalo Junior Chicken"
              },
              {
                  "choiceId": "b874626d-f98a-4b5c-aa4d-688de02bc611",
                  "position": "4",
                  "label": "“The Hat Trick” – Triple Cheeseburger "
              },
              {
                  "choiceId": "9cb94b8a-a1a4-4821-96a9-3b45ca042c4c",
                  "position": "5",
                  "label": "“Power Play Poutine” – Spicy Maple and Bacon Poutine "
              },
              {
                  "choiceId": "ae1471f2-d395-4f5a-9ed2-0e3c3b1434ce",
                  "position": "6",
                  "label": "Celly Sundae "
              }
          ]
      },
      {
          "question": "Which two NHL Hockey players are featured in the new McDonald’s Hockey Showdown commercial?",
          "showIn": 50,
          "answerTime": 5,
          "showResultTime": 5,
          "choices": [
              {
                  "choiceId": "0ab72c79-b5e0-4a37-9132-6950c6c292a3",
                  "position": "1",
                  "label": "Auston Matthews \u0026 Connor McDavidson"
              },
              {
                  "choiceId": "2f2d4fec-ff72-41c6-9eff-c135828abda6",
                  "position": "2",
                  "label": "Auston Matthews \u0026 Connor McDavid",
                  "correct": true
              },
              {
                  "choiceId": "c9ada51e-5b43-4421-96fd-4203d549408d",
                  "position": "3",
                  "label": "Auston McMatthews \u0026 Connor McDavid"
              }
          ]
      }
  ]
}