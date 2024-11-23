// import { render, fireEvent, screen } from "@testing-library/react";
// import { vi } from "vitest";
// import { useNavigate } from "react-router-dom"; // 引入 useNavigate 以便 mock
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PaySetup from "../../components/PaySetup"; // Adjust the import path as necessary

describe("PaySetup Component", () => {
  it("renders the title and payment method sections", () => {
    render(<PaySetup />);

    // Check if the main title is rendered
    expect(screen.getByText("How to Pay in China")).toBeInTheDocument();
    expect(screen.getByText("Other Payment Methods")).toBeInTheDocument();
    expect(screen.getByText("QR Code Payments")).toBeInTheDocument();
  });
it("displays the content of the accordion when clicked", () => {
    render(<PaySetup />);

    // Open the "Online Shopping" accordion section
    const onlineShoppingAccordion = screen.getByText("Online Shopping");
    fireEvent.click(onlineShoppingAccordion);

    // Check if the content for "Online Shopping" is visible
    expect(screen.getByText("Mobile wallets integrate seamlessly with platforms like Taobao, Tmall, and JD.com, making online shopping fast and easy.")).toBeInTheDocument();

    // Open the "Transferring Money" accordion section
    const transferringMoneyAccordion = screen.getByText("Transferring Money");
    fireEvent.click(transferringMoneyAccordion);

    // Check if the content for "Transferring Money" is visible
    expect(screen.getByText("Splitting bills or casual payments is simple with Alipay and WeChat Pay. Note that international cards cannot be used for money transfers.")).toBeInTheDocument();
  });

});
