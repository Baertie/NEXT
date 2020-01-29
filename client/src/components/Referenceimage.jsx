import React from "react";

const Referenceimage = React.forwardRef((props, ref) => {
  return <img src={props.source} ref={ref} height="720"></img>;
});

export default Referenceimage;
