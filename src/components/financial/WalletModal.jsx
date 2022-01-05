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

    componentDidMount(){
        axiosInstance.get(Endpoints.wallet.getById(this.props.value))
        .then(res => {
            const wallet = res.data
            this.setState({ wallet })
        })
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
        
        if(this.props.value){
            axiosInstance.put(Endpoints.wallet.put(this.props.value), editWallet).then(response => {
                const id = response.data.Body;
                refreshPage()
              })
        }
        else {
            editWallet.walletStatus = 'enable'
            axiosInstance.post(Endpoints.wallet.add(), editWallet).then(response => {
                const id = response.data.Body;
                refreshPage()
              })
        }
        
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
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name="name" onChange={this.nameChange} placeholder="Nome" defaultValue={this.state.wallet?.name}  />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control name="value" onChange={this.valueChange} placeholder="Valor" defaultValue={ decimalAdjust(this.state.wallet?.value)}  />
                    </Form.Group>
                    <Button variant="dark" type="submit"> {this.props.value ? 'Atualizar' : 'Adicionar'} </Button>
                </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



