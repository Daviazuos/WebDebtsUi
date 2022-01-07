import { Card, Container } from "react-bootstrap";

import Table from "../../components/table/table"

import "./Debts.css";

export default () => {
  return (
    <div className="debts">
      <Container className="containerDebtpage">
        <Card className="cardTable">
          <Table></Table>
        </Card>
      </Container>
    </div>);
};
