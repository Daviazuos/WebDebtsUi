import React from "react";
import "./CustomCard.css";
import { Card } from "react-bootstrap";

export default (props) => {
  const style = {
    backgroundColor: props.color,
    borderColor: props.colorBorder,
  };

  return (
    <div className="card">
      <Card style={style}>
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>{props.children}</Card.Body>
      </Card>
    </div>
  );
};
