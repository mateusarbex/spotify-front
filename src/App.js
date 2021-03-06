import "./App.css";
import styled from "styled-components";
import { BsSpotify } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import InputSpotify from "./components/InputSpotify/InputSpotify";
import Track from "./components/Track/Track";
import { IoPlayCircleOutline } from "react-icons/io5";
import TrackSkeleton from "./components/TrackSkeleton/TrackSkeleton";
import { useToasts } from "react-toast-notifications";

const TracksContainer = styled.div`
  max-width: 100vw;
  width: 700px;
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
  flex-direction: column;
`;

const SpotifyLogo = styled(BsSpotify)`
  width: 128px;
  height: 128px;
  margin-bottom: 30px;
`;

const NextContainer = styled.div`
  padding: 5px;
  margin-bottom: 15px;
  letter-spacing: 5px;
`;

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function App() {
  const { addToast } = useToasts();

  const [currentTrack, setCurrentTrack] = useState();
  const [queue, setQueue] = useState([]);
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [queueing, setQueueing] = useState(false);
  const [queuedTracks, setQueuedTracks] = useState([]);

  const getCurrentSong = async () => {
    try {
      const current_song = await api.get("playback");
      if (typeof current_song.data != "string") {
        setCurrentTrack(current_song.data);
      }
    } catch {}
  };
  const getQueue = async () => {
    try {
      const queue = await api.get("queue");
      setQueue(queue.data.tracks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentSong();
    getQueue();
  }, [fetch, queueing]);

  const queryInput = async () => {
    setQueuedTracks([]);
    setFetch(true);
    try {
      if (input) {
        const result = await api.get("search", {
          params: { input, limit: 5, offset: 0 },
        });
        if (result.data.items) {
          setTracks(result.data.items);
        } else throw result.data;
      }
    } catch (err) {
      console.log(err);
    }
    setFetch(false);
  };

  const addToQueue = async (uri, index) => {
    if (!queueing) {
      try {
        setQueueing(index);
        const response = await api
          .post("add_to_queue", { uri })
          .catch((err) => console.log(err));
        setQueueing(false);
        if (typeof response.data === "string") {
          return addToast(response.data, {
            appearance: "error",
            autoDismiss: true,
          });
        }
        setQueuedTracks([...queuedTracks, uri]);
        return addToast("M??sica adicionada com sucesso", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.log(err);
        setQueueing(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header" />
      <SpotifyLogo />

      {currentTrack && (
        <div>
          <div
            style={{
              justifyContent: "center",
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              margin: 5,
            }}
          >
            <h2 style={{ letterSpacing: "3px", marginRight: 10 }}>
              NOW PLAYING
            </h2>
            <IoPlayCircleOutline style={{ height: 24, width: 24 }} />
          </div>

          <TracksContainer>
            <Track noIcon={true} track={currentTrack}></Track>
          </TracksContainer>
        </div>
      )}
      {queue.length > 0 && (
        <div>
          <div
            style={{
              justifyContent: "center",
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              margin: 5,
            }}
          >
            <h2 style={{ letterSpacing: "3px", marginRight: 10 }}>NEXT</h2>
          </div>

          <TracksContainer>
            <Track noIcon={true} track={queue[0]}></Track>
          </TracksContainer>
          <NextContainer>
            {queue.slice(1).map((data) => (
              <div style={{ letterSpacing: 1 }}>
                {data.name} - {data.artists[0].name}
              </div>
            ))}
          </NextContainer>
        </div>
      )}

      <InputSpotify
        onBlur={() => queryInput()}
        onInput={({ target }) => setInput(target.value)}
        value={input}
        onIconClick={() => queryInput()}
        placeholder={"Artista ou m??sica"}
      />
      {tracks.length > 0 && <h3>Adicione para a playlist</h3>}
      {fetch && (
        <TracksContainer>
          <TrackSkeleton count={5} />
        </TracksContainer>
      )}
      <TracksContainer>
        {!fetch &&
          tracks.map((value, index) => {
            return (
              <Track
                queued={queuedTracks.some((uri) => uri === value.uri)}
                track={value}
                requesting={queueing === index}
                onClickContainer={() => addToQueue(value.uri, index)}
                onClickIcon={(event) => {
                  event.stopPropagation();
                  addToQueue(value.uri, index);
                }}
              />
            );
          })}
      </TracksContainer>
    </div>
  );
}

export default App;
