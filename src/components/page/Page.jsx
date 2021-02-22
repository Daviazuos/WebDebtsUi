import React from "react";
import "./Page.css";
import MyVerticallyCenteredModal from "../modal/modalDebts";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";

export default (props) => {
  const style = {
    backgroundColor: props.color,
    borderColor: props.colorBorder,
  };

  return (
    <div className="page">
      <Card style={style}>
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>{props.children}</Card.Body>
      </Card>
    </div>
  );
};
