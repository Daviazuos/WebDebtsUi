import { Button, Container, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import "./ModalDelete.css"

export default function ModalDelete(props) {
    function refreshPage() {
        window.location.reload();
    }

    function Delete() {
        axiosInstance.delete(props.deleteUrl).then(response => {
            refreshPage()
        })
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
                    <Button className="btn btn-danger" onClick={() => Delete(props.id)}>Confirmar</Button>
                    <Button onClick={props.onHide}> Cancelar </Button>
                </Container>
            </Modal.Body>
        </Modal>
    )
}



