import styled from "styled-components";
import { IoSearchOutline } from "react-icons/io5";

const InputSpot = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 24px;
  border-width: 1px;
  padding: 8px;
  padding-left: 36px;
`;

const InputContainer = styled.div`
  max-width: 300px;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const InputIcon = styled(IoSearchOutline)`
  display: flex;
  color: #000;
  position: absolute;
  align-self: center;
  left: 8px;

  cursor: pointer;
  :hover {
    opacity: 50%;
  }
`;

const InputSpotify = ({ onBlur, onInput, value, placeholder, onIconClick }) => {
  return (
    <InputContainer>
      <InputIcon onClick={onBlur}></InputIcon>
      <InputSpot
        onKeyDown={(e) => {
          if (e.code === "Enter") onBlur();
        }}
        value={value}
        onInput={onInput}
        type={"search"}
        placeholder={placeholder}
      ></InputSpot>
    </InputContainer>
  );
};

export default InputSpotify;
