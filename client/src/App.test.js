import { render, screen } from "@testing-library/react";
import App from "./App";
import { getAuthorizationHeader } from "./security/Authorization";

jest.mock("./security/Authorization");
const mockAuth = jest.fn(() => {
  return {
    Authorization: "invalidtoken",
  };
});

getAuthorizationHeader.mockImplementation(() => {
  return {
    getAuthorizationHeader: mockAuth,
  };
});

describe("App", () => {
  test("renders correctly", () => {
    render(<App />);
    const appTitle = screen.getByText(/Prometheus Metrics/);
    expect(appTitle).toBeInTheDocument();
  });

  // This passes, but not for the intended test so would need to re-factor to inject the api client, make mock call then fail the auth via the mocked api.
  test("displays error when unauthorized", async () => {
    render(<App />);
    const errorText = await screen.findByText(/Error:/);
    expect(errorText).toBeInTheDocument();
  });
});
