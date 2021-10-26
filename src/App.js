import "./App.css";
import styled from "styled-components";
import { BsSpotify } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import InputSpotify from "./components/InputSpotify/InputSpotify";
import Track from "./components/Track/Track";
import { IoPlayCircleOutline } from "react-icons/io5";

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

  const getCurrentSong = async () => {
    const current_song = await api.get("playback");
    setCurrentTrack(current_song.data);
  };

  useEffect(() => {
    getCurrentSong();
  }, []);

  const queryInput = async () => {
    if (input) {
      const result = await api.get("search", {
        params: { input, limit: 5, offset: 0 },
      });
      setTracks(result.data.items);
      console.log(result.data.items[0]);
    }
  };

  const addToQueue = async (uri) => {
    const response = await api
      .post("add_to_queue", { uri })
      .catch((err) => console.log(err));
    console.log(response);
  };

  return (
    <div className="App">
      <header className="App-header" />
      <SpotifyLogo />
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 style={{ letterSpacing: "3px", marginRight: 10 }}>NOW PLAYING</h2>
        <IoPlayCircleOutline style={{ height: 24, width: 24 }} />
      </div>
      {currentTrack && (
        <TracksContainer>
          <Track noIcon={true} track={currentTrack}></Track>
        </TracksContainer>
      )}

      <InputSpotify
        onBlur={() => queryInput()}
        onInput={({ target }) => setInput(target.value)}
        value={input}
        onIconClick={() => queryInput()}
        placeholder={"Artista ou música"}
      />
      <h3>Adicione para a playlist</h3>
      <TracksContainer>
        {tracks.map((value) => {
          return (
            <Track track={value} onClickIcon={() => addToQueue(value.uri)} />
          );
        })}
      </TracksContainer>
    </div>
  );
}

export default App;
