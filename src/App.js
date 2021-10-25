import "./App.css";
import styled from "styled-components";
import { BsSpotify } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";
import InputSpotify from "./components/InputSpotify/InputSpotify";
import Track from "./components/Track/Track";

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
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);

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
    const response = await api.post("add_to_queue", { uri });
    console.log(response);
  };

  return (
    <div className="App">
      <a href="http://localhost:5000/">Link</a>
      <header className="App-header" />
      <SpotifyLogo />
      <h3>Adicione para a playlist</h3>
      <InputSpotify
        onBlur={() => queryInput()}
        onInput={({ target }) => setInput(target.value)}
        value={input}
        onIconClick={() => queryInput()}
        placeholder={"Artista ou música"}
      />
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
