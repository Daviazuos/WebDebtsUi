import React from "react";
import { render } from "@testing-library/react";
import PaginationComponent from "./paginationComponent";

describe("PaginationComponent", () => {
  it("does not select page zero when there are no items", () => {
    const setCurrentPage = jest.fn();

    render(
      <PaginationComponent
        itemsCount={0}
        itemsPerPage={7}
        currentPage={1}
        setCurrentPage={setCurrentPage}
        alwaysShown={false}
      />
    );

    expect(setCurrentPage).not.toHaveBeenCalledWith(0);
  });

  it("normalizes an invalid current page to page one", () => {
    const setCurrentPage = jest.fn();

    render(
      <PaginationComponent
        itemsCount={0}
        itemsPerPage={7}
        currentPage={0}
        setCurrentPage={setCurrentPage}
        alwaysShown={false}
      />
    );

    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });
});
