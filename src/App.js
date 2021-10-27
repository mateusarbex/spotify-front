import "./App.css";
import styled from "styled-components";
import { BsSpotify } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import InputSpotify from "./components/InputSpotify/InputSpotify";
import Track from "./components/Track/Track";
import { IoPlayCircleOutline } from "react-icons/io5";
import TrackSkeleton from "./components/TrackSkeleton/TrackSkeleton";

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
  baseURL: "http://localhost:5000/",
  headers: { "Content-Type": "application/json" },
});

function App() {
  const [currentTrack, setCurrentTrack] = useState();
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [error, setError] = useState("");

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
  }, []);

  const queryInput = async () => {
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
    try {
      const response = await api
        .post("add_to_queue", { uri })
        .catch((err) => console.log(err));
      if (typeof response.data === "string") {
        setError(response.data);
      }
    } catch (err) {
      console.log(err);
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
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
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
                track={value}
                onClickContainer={() => addToQueue(value.uri)}
                onClickIcon={() => addToQueue(value.uri)}
              />
            );
          })}
      </TracksContainer>
    </div>
  );
}

export default App;
