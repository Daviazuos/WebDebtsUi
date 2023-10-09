import { Button, Spinner } from "react-bootstrap";

export default function LoadingButton(props) {
    return (
        <Button className={props.className || ''} size={props.size || ''} onClick={props.onClick || ''} type={props.type} variant={props.variant || ''} disabled={props.isLoading === true ? true : false}>
            <span>{props.name} </span>
            {props.isLoading == true ? <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            /> : ''}
        </Button>)
}