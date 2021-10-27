import styled, { keyframes } from "styled-components";

const loading = keyframes`
  to{
    background-position: 1000px 0, 5px 5px, 110px 15px,110px 55px, 0 0;
  }
`;

const Skeleton = styled.div`
  margin: 5px;
  animation: ${loading} 1s infinite;
  height: 100px;
  width: 100%;
  border-radius: 8px;
  background-position: -1000px 0, 5px 5px, 110px 15px, /* title */ 110px 55px,
    0 0;
  background-size: 100% 100px, 90px 90px, /* avatar */ 200px 30px,
    /* title */ 150px 30px, 100% 100%; /* card bg */
  background-repeat: no-repeat;
  background-image: linear-gradient(
      90deg,
      rgba(211, 211, 211, 0),
      rgba(211, 211, 211, 0.8) 50%,
      rgba(211, 211, 211, 0) 100%
    ),
    linear-gradient(#333333 99%, transparent 0),
    linear-gradient(#333333 40px, transparent 0),
    linear-gradient(#333333 40px, transparent 0),
    linear-gradient(#1f1f1f 100%, transparent 0);
`;

const TrackSkeleton = ({ count }) => {
  const SkeletonArray = Array(count).fill();

  return SkeletonArray.map(() => <Skeleton />);
};
export default TrackSkeleton;
