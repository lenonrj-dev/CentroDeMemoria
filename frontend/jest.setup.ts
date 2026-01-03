import "@testing-library/jest-dom";
import React from "react";
import { jest } from "@jest/globals";

// next/image mock para ambiente de teste
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill: _fill, ...props }: any) => React.createElement("img", { ...props, alt: props.alt || "" }),
}));
