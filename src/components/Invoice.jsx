import { useState } from "react";

import invoiceData from "./InvoiceData";

const Invoice = () => {
  const [paperSize, setPaperSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait"); // New state for orientation

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Paper configuration
  const PAPER_CONFIG = {
    A4: {
      width: orientation === "portrait" ? "210mm" : "297mm",
      height: orientation === "portrait" ? "297mm" : "210mm",
      rowsPerPage: orientation === "portrait" ? 10 : 20,
      className:
        orientation === "portrait"
          ? "w-[210mm] min-h-[297mm]"
          : "w-[297mm] min-h-[210mm]",
    },
    A5: {
      width: orientation === "portrait" ? "148mm" : "210mm",
      height: orientation === "portrait" ? "210mm" : "148mm",
      rowsPerPage: orientation === "portrait" ? 6 : 10,
      className:
        orientation === "portrait"
          ? "w-[148mm] min-h-[210mm]"
          : "w-[210mm] min-h-[148mm]",
    },
  };

  // Calculate if we need blank rows (only for single page with few items)
  const itemsPerPage = PAPER_CONFIG[paperSize].rowsPerPage;
  const needsBlankRows = invoiceData.items.length <= itemsPerPage;
  const blankRowsNeeded = needsBlankRows
    ? Math.max(0, itemsPerPage - invoiceData.items.length)
    : 0;

  const totalPages = Math.ceil(invoiceData.items.length / itemsPerPage);
  // Group items by page
  const paginatedItems = [];
  for (let i = 0; i < totalPages; i++) {
    const start = i * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedItems.push(invoiceData.items.slice(start, end));
  }

  // Calculate if content fits on single page
  const fitsOnOnePage =
    invoiceData.items.length <= PAPER_CONFIG[paperSize].rowsPerPage;
  // Rest of your component...

  return (
    <div className="print:p-0 print:bg-white">
      {/* Print Controls */}
      <div className="mb-0 flex gap-4 print:hidden">
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="A4">A4 (210×297mm)</option>
          <option value="A5">A5 (148×210mm)</option>
        </select>

        {/* New Orientation Selector */}
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>

        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Print Invoice
        </button>
      </div>

      <style jsx>{`
        @page {
          size: ${paperSize} ${orientation};
          margin: 5mm; /* Uniform 10mm margin on all sides */
          marks: crop; /* Show crop marks if needed */
          
        }

        @media print {
          body,
          html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .invoice-page {
            width: calc(${PAPER_CONFIG[paperSize].width} - 20mm) !important;
            min-height: calc(
              ${PAPER_CONFIG[paperSize].height} - 20mm
            ) !important;
          
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Invoice Container with EXACT paper dimensions */}
      <div
        className={`invoice-page ${PAPER_CONFIG[paperSize].className} mx-auto bg-white text-[13px] px-6 pt-2 print:p-0`}
        style={{
          width: PAPER_CONFIG[paperSize].width,
          minHeight: fitsOnOnePage ? "auto" : PAPER_CONFIG[paperSize].height,
        }}
      >
        {/* Company Header */}
        <div className="flex justify-between items-start">
          <div className="flex-shrink-0">
            <img
              src={invoiceData.orgInfo.orgLogo}
              alt="Technix India"
              className="w-24 print:w-24 h-auto pt-1"
            />
          </div>
          <div className="flex items-center bg-white space-x-4 md:pl-1">
            <div>
              <h1 className="text-[22px] font-bold text-[#0069ba]">
                {invoiceData.orgInfo.orgName}
              </h1>
              <p className="text-[10px] md:text-[12px] text-gray-800">
                {invoiceData.orgInfo.orgAdd}
              </p>
              <div className={`${
        paperSize === "A5"
          ? "flex flex-col"
          : "flex flex-row gap-x-4"
      }`}>
                <p className="text-[10px] md:text-[12px]">
                  <span className="font-semibold">Website :</span>{" "}
                  {invoiceData.orgInfo.orgWebsite} ,
                </p>
                <p className="text-[10px] md:text-[12px]">
                  <span className="font-semibold"> Email:</span>{" "}
                  {invoiceData.orgInfo.orgEmail}
                </p>
              </div>
            </div>
          </div>
          <div className="border-2 border-gray-100 text-gray-400 text-[8px] md:text-[10px] md:px-[5px] py-0.5 md:ml-[10px]">
            ORIGINAL FOR RECIPIENT
          </div>
        </div>

        <h2 className="font-bold text-center text-xl pb-0.5">TAX INVOICE</h2>

        {/* Header Section - Added flex-wrap for better mobile handling */}
        <div className="flex flex-wrap justify-between items-center py-[5px] px-[5px] border-t-3 border-b border-b-gray-200 border-[#0069ba] mb-2">
          <h2 className="text-[10px] md:text-[12px] font-semibold min-w-[120px]">
            GSTIN :
            <span className="text-[10px] md:text-[12px] font-normal">
              {" "}
              {invoiceData.gstin}
            </span>
          </h2>

          <p className="text-[10px] md:text-[12px] font-semibold min-w-[120px] text-right">
            Contact Us :
            <span className="text-[10px] md:text-[12px] font-normal">
              {" "}
              {invoiceData.orgcontactno}
            </span>
          </p>
        </div>

        {/* Main Content - Added responsive flex direction */}
        <div className="flex flex-row justify-between">
          {/* BILL TO Section - Added flex-1 for proper spacing */}
          <div className="mb-4 text-[12px] flex-1">
            <p className="font-bold text-[14px]">BILL TO</p>
            <p className="font-bold text-[14px]">{invoiceData.customer.name}</p>
            <p>{invoiceData.customer.address}</p>
            <p>Mobile : {invoiceData.customer.mobile}</p>
            <p>State : {invoiceData.customer.state}</p>
          </div>

          {/* Invoice Details */}
          <div className="text-[13px] space-y-1 min-w-[160px] md:min-w-[200px]">
            <div className="flex">
              <div className="w-[80px] md:w-[90px] font-medium">Invoice No</div>
              <div className="w-4">:</div>
              <div className="flex-1">{invoiceData.invoiceNo}</div>
            </div>
            <div className="flex">
              <div className="w-[80px] md:w-[90px] font-medium">
                Invoice Date
              </div>
              <div className="w-4">:</div>
              <div className="flex-1">{invoiceData.invoiceDate}</div>
            </div>
            <div className="flex">
              <div className="w-[80px] md:w-[90px] font-medium">Due Date</div>
              <div className="w-4">:</div>
              <div className="flex-1">{invoiceData.dueDate}</div>
            </div>
          </div>
        </div>

       <div className="w-full text-[11px] md:text-[12px] border-t border-gray-300 ">
  <div className="flex flex-wrap justify-between">
    
    {/* IRN No. — always left side, single line */}
    <div>
      <p className="whitespace-nowrap">
        <span className="font-semibold">IRN No.:</span>{" "}
        0fb0b496f8cea1696efcfd0e7e89d06e046970da523
      </p>
    </div>

    {/* Ack No. + Ack Date — layout changes by paperSize */}
    <div
      className={`${
        paperSize === "A5"
          ? "flex flex-col gap-[1px] items-start"
          : "flex flex-row gap-x-4 items-center"
      }`}
    >
      <p className="whitespace-nowrap">
        <span className="font-semibold">Ack. No.:</span> 182211544473105
      </p>
      <p className="whitespace-nowrap">
        <span className="font-semibold">Ack. Date:</span> 09-04-2022
      </p>
    </div>
  </div>
</div>


        {/* Items Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            {/* Dynamic Table Head */}
            <thead className="font-medium">
              <tr className="border-t-2 border-b-2 border-blue-600 bg-gray-300">
                {invoiceData.headers.map((header) => (
                  <th
                    key={header.id}
                    rowSpan={2}
                    className={`
             align-middle
              ${header.align === "left" ? "text-left pl-2" : ""}
              ${header.align === "center" ? "text-center" : ""}
              ${header.align === "right" ? "text-right pr-2" : ""}
              ${header.id === "number" ? "w-8 pr-1.5" : ""}
              ${header.className || ""}  // Optional custom classes from backend
            `}
                    style={{ width: header.width }} // Optional explicit width
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
              <tr className="border-b-2 border-blue-600"></tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {invoiceData.items.map((item) => (
                <tr
                  key={item.number}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {invoiceData.headers.map((header) => (
                    <td
                      key={`${item.number}-${header.id}`}
                      className={`
                
                ${header.align === "left" ? "text-left pl-2" : ""}
                ${header.align === "center" ? "text-center pr-2" : ""}
                ${header.align === "right" ? "text-right pr-2" : ""}
                ${header.id === "amount" ? "font-medium" : ""}
                align-top
              `}
                    >
                      {header.id === "product" ? (
                        <>
                          <p className="font-medium">{item.name}</p>
                          <div className="text-xs text-gray-500">
                            {item.model && <p>Model: {item.model}</p>}
                            {item.serial && <p>S/N: {item.serial}</p>}
                          </div>
                        </>
                      ) : (
                        item[header.id]?.toLocaleString?.("en-IN") ??
                        item[header.id]
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Blank Rows */}
              {needsBlankRows &&
                Array.from({ length: blankRowsNeeded }).map((_, i) => (
                  <tr
                    key={`blank-${i}`}
                    className="h-6 border-b border-gray-200"
                  >
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                ))}

              {/* Subtotals Row */}
              <tr className="border-t-2 border-b-2 border-blue-600 font-medium">
                <td className="pl-2" colSpan={2}>
                  SUB TOTAL
                </td>
                <td className="text-right pr-2">
                  {invoiceData.subTotalQuantity}
                </td>
                <td className="" colSpan={2}></td>
                <td className="text-right pr-2">
                  {invoiceData.subTotalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-1 print:overflow-visible">
          <div
            className={`flex ${
              paperSize === "A5" ? "flex-col-reverse" : "flex-row"
            } justify-between gap-1 font-sans`}
          >
            {/* Left Column */}
            <div className="flex flex-col gap-3 min-w-[450px]">
              <div className="overflow-x-auto ">
                <table
                  className={` ${
                    paperSize === "A5"
                      ? "w-full"
                      : "min-w-[450px] border-b-1 border-gray-100"
                  } text-center`}
                >
                  <thead className="border-b-2 border-gray-100 text-[10px] md:text-[12px]">
                    <tr className="md:p-1">
                      <th className="border border-gray-100  font-semibold">
                        Tax %
                      </th>
                      <th className="border border-gray-100  font-semibold">
                        Taxable Amt.
                      </th>
                      <th className="border border-gray-100  font-semibold">
                        Central Tax
                      </th>
                      <th className="border border-gray-100 font-semibold">
                        State Tax
                      </th>
                      <th className="border border-gray-100  font-semibold">
                        Integrated Tax
                      </th>
                      <th className="border border-gray-100  font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoiceData.taxSummary.map((row, index) => (
                      <tr key={index} className="text-[12px]">
                        <td className="border border-gray-100">
                          {row.taxRate}
                        </td>
                        <td className="border border-gray-100">
                          {row.taxableAmount}
                        </td>
                        <td className="border border-gray-100">
                          {row.centralTax.toFixed(2)}
                        </td>
                        <td className="border border-gray-100">
                          {row.stateTax.toFixed(2)}
                        </td>
                        <td className="border border-gray-100">
                          {row.integratedTax.toFixed(2)}
                        </td>
                        <td className="border border-gray-100">
                          {row.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bank Details - Made responsive with flex-col/md:flex-row */}
              <div className="flex flex-row gap-16 pl-2.5 w-full border-b border-gray-200 pb-1 text-[10px] md:text-[12px]">
                <div className="flex flex-col gap-0.5 text-justify">
                  <div className="flex gap-1">
                    <p className="font-semibold min-w-[70px] md:min-w-[100px]">
                      Account Name :
                    </p>
                    <p>{invoiceData.bankDetails.accountName}</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold min-w-[70px] md:min-w-[100px]">
                      Bank Name :{" "}
                    </p>
                    <p>{invoiceData.bankDetails.bankName}</p>
                  </div>
                </div>
                <div>
                  <div className="flex gap-1">
                    <p className="font-semibold min-w-[120px]">
                      Bank Account No :
                    </p>
                    <p>{invoiceData.bankDetails.accountNumber}</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold min-w-[120px]">IFSC Code : </p>
                    <p>{invoiceData.bankDetails.ifsc}</p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] md:text-[12px]">
                <p className="font-semibold text-left">
                  Total Amounts (in words)
                </p>
                <p className="text-left">
                  Nine Thousand Three Hundred Ninety Rupees
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div
              className={`${
                paperSize === "A5"
                  ? "mt-1 mb-1 w-full"
                  : "min-w-[200px] md:min-w-[220px]"
              } flex flex-col text-[10px] md:text-[12px]`}
            >
              <div className="flex justify-between gap-8 border-b-1 border-gray-100">
                <p className="font-semibold">Taxable Amount</p>
                <p className="font-semibold">
                  {formatINR(invoiceData.totalAmountDetails.taxableAmount)}
                </p>
              </div>

              {/* ONLY render if cgst is defined */}
              {invoiceData.totalAmountDetails.cgst != null && (
                <div className="flex justify-between pt-[1px] border-b-1 border-gray-100">
                  <p>CGST</p>
                  <p>{formatINR(invoiceData.totalAmountDetails.cgst)}</p>
                </div>
              )}

              {/* ONLY render if sgst is defined */}
              {invoiceData.totalAmountDetails.sgst != null && (
                <div className="flex justify-between border-b-1 border-gray-100">
                  <p>SGST</p>
                  <p>{formatINR(invoiceData.totalAmountDetails.sgst)}</p>
                </div>
              )}

              <div className="flex justify-between py-[1px] border-b-1 border-gray-100">
                <p className="font-semibold">Total Amount</p>
                <p className="font-semibold">
                  {formatINR(invoiceData.totalAmountDetails.totalAmount)}
                </p>
              </div>
              <div className="flex justify-between py-[1px] border-b-1 border-gray-100">
                <p>Received Amount</p>
                <p>
                  {formatINR(invoiceData.totalAmountDetails.receivedAmount)}
                </p>
              </div>
              <div className="flex justify-between py-[1px] border-b-1 border-gray-100">
                <p>Dues Amount</p>
                <p>{formatINR(invoiceData.totalAmountDetails.duesAmount)}</p>
              </div>
            </div>
          </div>

          <div className="flex pb-[20px] pt-2 md:pb-[20px] justify-between gap-0.5 text-[10px] md:text-[12px] border-gray-300">
            {/* Terms Section */}
            <div className="flex flex-col justify-center">
              <h2 className="font-semibold underline">
                {invoiceData.termsTitle}
              </h2>
              {invoiceData.termsList.map((term, index) => {
                if (term.includes("Interest @ 18%")) {
                  // Split after "payment"
                  const parts = term.split("payment");
                  return (
                    <p key={index}>
                      {parts[0]}payment
                      <br />
                      {parts[1]}
                    </p>
                  );
                }
                return <p key={index}>{term}</p>;
              })}
            </div>
            <div className="qr-code flex flex-col justify-end">
              <p className="text-center font-semibold">E-INVOICE QR CODE</p>
              <img src={invoiceData.qrCode} alt="Scan to pay" width="150" />
            </div>

            {/* Signature Section */}
            <div className="flex flex-col justify-center gap-12 text-[10px] md:text-[12px]">
              <p className="font-semibold">FOR {invoiceData.companyName}</p>
              <p className="font-semibold pl-32">{invoiceData.signatureText}</p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t-1 border-gray-200 mt-1 pt-1 text-center text-[10px]">
          <p>
            Software By: TECHNIX INDIA SOLUTIONS PVT LTD, CONTACT US:
            +91-9905422244, +91-7250433565
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
