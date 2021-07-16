import React, { Component } from "react";
import Tooltip from "./Tooltip";
import { objects } from "../database/objectsTable";


const unknownObject = {_id: '00000000-0000-0000-0000-000000000000', name: 'Any Object'};


class ObjectIcon extends Component{
  render() {

    let object =
      objects.find((icon) => icon._id === this.props.objectId);

    let iconName = object?.name;
    let iconImg =
      "/icons/" + object?.objectGroupId + "/" + object?.fileName;

    let imgElement = (
      <img src={iconImg} alt={iconName} className="object-icon" />
    );

    if (object._id === unknownObject._id) {
      imgElement = <div>Any Object</div>;
    }
    
    return this.props.showTooltip ? (
      <Tooltip text={iconName}>{imgElement}</Tooltip>
    ) : (
      imgElement
    );
  }
}

export default ObjectIcon;
