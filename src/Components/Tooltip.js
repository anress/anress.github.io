import React from "react";



const Tooltip = (props) => {
  let lg = false;
  let md = false;

  if (props.text.length > 12) lg = true;
  else if (props.text.includes(" ") || props.text.length > 8) md = true;

  return (
    <div className="tooltip">
      <div className="indicator" />
      <div className={"tooltip-text" + (lg ? " lg" : "") + (md ? " md" : "")}>{props.text}</div>
      {props.children}
    </div>
  );
};

export default Tooltip;
