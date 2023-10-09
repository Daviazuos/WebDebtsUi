import { Button, Container, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import "./WalletModalDelete.css"

export default function WalletModalDelete(props) {
    function refreshPage() {
        window.location.reload();
    }

    function Delete(wallet) {
        const editWallet = {
          name: wallet.name,
          value: wallet.value,
          walletStatus: 'disable'
        };
      
        axiosInstance.put(Endpoints.wallet.put(wallet.id), editWallet).then(response => {
          const id = response.data.Body;
          refreshPage()
        })
        return (
          <>
          </>
        )
      }

    return (
        <Modal
            {...props}
            size="sm"
            centered="true"
        >
            <Modal.Body>
                <p>Tem certeza que deseja apagar?</p>
                <Container className="deleteButtons">
                    <Button className="btn btn-danger" onClick={() => Delete(props.value)}>Confirmar</Button>
                    <Button onClick={props.onHide}> Cancelar </Button>
                </Container>
            </Modal.Body>
        </Modal>
    )
}



