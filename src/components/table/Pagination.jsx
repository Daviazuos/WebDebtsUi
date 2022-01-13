


export function pagination(pages) {
    const items = [];
    for (let number = 1; number <= pages; number++) {
        items.push(
            <Pagination.Item key={number}>
                {number}
            </Pagination.Item>,
        );
    }

    const paginationBasic = (
        <div>
            <Pagination>{items}</Pagination>
            <br />
        </div>
    );

    render(paginationBasic)
}