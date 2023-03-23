import React, { useRef, useEffect, useState } from "react";

const MeasureElement = props => {
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      });
    }
}, []);

//   props.setHeightsOfTickets(prev => [dimensions.height])
  console.log(dimensions.height)

  return (
    <div ref={targetRef}>
      <p>{dimensions.width}</p>
      <p>{dimensions.height}</p>
    </div>
  );
};

export default MeasureElement;
