import styled from "styled-components";
import { IoAddCircleOutline, IoCheckmark } from "react-icons/io5";
import { Circles } from "react-loading-icons";

const TrackContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  height: 100%;
  max-height: 100px;
  flex-direction: row;

  @media (max-width: 400px) {
    :active {
      opacity: 50%;
    }

    max-height: 300px;
  }
  margin: 5px;
  width: 100%;
  border-radius: 16px;

  :hover {
    background-color: #1f1f1f;
  }
`;

const TrackImage = styled.img`
  max-width: 128px;
  align-self: center;
  height: 100px;
`;

const TrackDescriptionContainer = styled.div`
  caret-color: transparent;
  padding-right: 50px;
  @media (max-width: 400px) {
    padding-right: 0px;
  }
  div:first-of-type {
    color: #fff;
    font-size: 24px;
  }
  div {
    font-size: 20px;
  }
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 5px;
  align-items: flex-start;
  justify-content: center;
`;

const TrackAdd = styled(IoAddCircleOutline)`
  margin-right: 10px;
  align-self: center;
  z-index: 2;
  height: 48px;
  width: 48px;
  position: absolute;
  right: 0px;
  float: right;
  @media (max-width: 400px) {
    display: none;
  }
  :active {
    transform: translateY(4px);
  }
  :hover {
    color: green;
  }
`;

const TrackLoading = styled(Circles)`
  margin-right: 10px;
  align-self: center;
  z-index: 2;
  height: 48px;
  width: 48px;
  position: absolute;
  right: 0px;
  float: right;
  @media (max-width: 400px) {
    display: none;
  }
  :active {
    transform: translateY(4px);
  }
  :hover {
    color: green;
  }
`;

const TrackCheck = styled(IoCheckmark)`
  margin-right: 10px;
  align-self: center;
  height: 48px;
  width: 48px;
  position: absolute;
  right: 0px;
  float: right;
  @media (max-width: 400px) {
    display: none;
  }
`;

const Track = ({
  track,
  onClickContainer,
  onClickIcon,
  noIcon,
  queued,
  requesting,
}) => {
  return (
    <TrackContainer onClick={onClickContainer}>
      <TrackImage src={track.album.images[0].url}></TrackImage>
      <TrackDescriptionContainer>
        <div>{track.name} </div>
        <div>{track.artists[0].name}</div>
      </TrackDescriptionContainer>
      {(!noIcon && queued && <TrackCheck />) ||
        (!noIcon && !requesting && <TrackAdd onClick={onClickIcon} />) ||
        (requesting && <TrackLoading />)}
    </TrackContainer>
  );
};
export default Track;
