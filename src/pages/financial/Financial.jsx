import { Container, Button } from "react-bootstrap";
import CardAnaliticValue from "../../components/cardAnaliticValue/CardAnaliticValue"
import "./Financial.css"

export default () => {
  return (
    <div>
      <Container className="financial">
        <CardAnaliticValue></CardAnaliticValue>
      </Container>
    </div>);
};
