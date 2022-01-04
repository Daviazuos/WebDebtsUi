import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";

import "./WalletModal.css"


function refreshPage() {
    window.location.reload();
  }

export default class ModalInstallments extends React.Component {
    state = {
        wallet: '',
        name: '',
        value: '',
        walletStatus: '',
    }
    
      nameChange = event => {
        this.setState({ name: event.target.value});
      }
      valueChange = event => {
        this.setState({ value: event.target.value});
      }
      statusChange = event => {
        this.setState({ walletStatus: event.target.value});
      }
    
      handleSubmit = event => {
        event.preventDefault();
    
        const editWallet = {
            name: this.state.name || this.state.wallet.name,
            value: this.state.value ||  this.state.wallet.value,
            walletStatus: this.state.walletStatus || this.state.wallet.walletStatus
          };
    
        axiosInstance.post(Endpoints.wallet.add(), editWallet).then(response => {
            const id = response.data.Body;
            refreshPage()
          })
    }

    componentDidMount() {
        axiosInstance.get(Endpoints.wallet.getEnable())
            .then(res => {
                const wallet = res.data;
                this.setState({ wallet });
            })
    }

    render() {
        return (
            <Modal
                {...this.props}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.head}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control name="value" onChange={this.valueChange} placeholder="Entre com o novo valor" defaultValue={ decimalAdjust(this.state.wallet.value)}  />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name="name" onChange={this.nameChange} placeholder="Entre com o novo nome" defaultValue={this.state.wallet.name}  />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control name="walletStatus" onChange={this.walletStatus} placeholder="Entre com o novo status" value={this.state.wallet.walletStatus}  />
                    </Form.Group>
                    <Button variant="dark" type="submit"> Atualizar </Button>
                </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



