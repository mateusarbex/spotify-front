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

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function App() {
  const { addToast } = useToasts();

  const [currentTrack, setCurrentTrack] = useState();
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [queueing, setQueueing] = useState();
  const [queuedTracks, setQueuedTracks] = useState([]);

  const getCurrentSong = async () => {
    try {
      const current_song = await api.get("playback");
      if (typeof current_song.data != "string") {
        setCurrentTrack(current_song.data);
      }
    } catch {}
  };

  useEffect(() => {
    getCurrentSong();
  }, [fetch]);

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

  const addToQueue = async (uri) => {
    if (!queueing) {
      try {
        setQueueing(true);
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
        return addToast("Música adicionada com sucesso", {
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

      <InputSpotify
        onBlur={() => queryInput()}
        onInput={({ target }) => setInput(target.value)}
        value={input}
        onIconClick={() => queryInput()}
        placeholder={"Artista ou música"}
      />
      {tracks.length > 0 && <h3>Adicione para a playlist</h3>}
      {fetch && (
        <TracksContainer>
          <TrackSkeleton count={5} />
        </TracksContainer>
      )}
      <TracksContainer>
        {!fetch &&
          tracks.map((value) => {
            return (
              <Track
                queued={queuedTracks.some((uri) => uri === value.uri)}
                track={value}
                onClickContainer={() => addToQueue(value.uri)}
                onClickIcon={(event) => {
                  event.stopPropagation();
                  addToQueue(value.uri);
                }}
              />
            );
          })}
      </TracksContainer>
    </div>
  );
}

export default App;
