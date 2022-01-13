import "./CreditCard.css"
import { Button, Card, Container } from "react-bootstrap";


export default () => {
    return (
        <Container className="containerDebtpage">
            <div class="cardCredit">
                <div class="card px-4">
                    <div class=" my-3">

                    </div>
                    <div class="debit-card mb-3">
                        <div class="d-flex flex-column h-100"> <label class="d-block">
                            <div class="d-flex position-relative">
                                <div>
                                    <p class="mt-2 mb-4 text-white fw-bold">Nubank</p>
                                    
                                </div>
                                <div class="input"> </div>
                            </div>
                        </label>
                            <div class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                                <p>R$ 1.500,55</p>
                                <p>01/22</p>
                            </div>
                        </div>
                    </div>
                    <div class="debit-card card-2 mb-4">
                        <div class="d-flex flex-column h-100"> <label class="d-block">
                            <div class="d-flex position-relative">
                                <div>
                                    <p class="text-white fw-bold">Banco do Brasil</p>
                                </div>
                                <div class="input"></div>
                            </div>
                        </label>
                            <div class="mt-auto fw-bold d-flex align-items-center justify-content-between">
                                <p class="m-0">R$ 5.841,55</p>
                                <p class="m-0">05/22</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>);
};
