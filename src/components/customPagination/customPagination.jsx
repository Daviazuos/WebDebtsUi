import { Component } from "react";
import { Pagination } from "react-bootstrap";

export class CustomPagination extends Component {
    render() {
        let active = this.props.currentPage;
        let items = [];
        for (let number = 1; number <= this.props.totalPages; number++) {
            items.push(
                <Pagination.Item onClick={this.props.onChange} key={number} active={number === active}>
                    {number}
                </Pagination.Item>,
            );
        }
        return (
            <Pagination size="sm">{items}</Pagination>
        )
    }

}