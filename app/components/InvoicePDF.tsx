import { Invoice, Totals } from "@/type";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { ArrowDownFromLine, HandCoins } from "lucide-react";
import React, { useRef } from "react";
import confetti from "canvas-confetti";

interface facturePDFProps {
  invoice: Invoice;
  totals: Totals;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("fr-FR", options);
}
const InvoicePDF: React.FC<facturePDFProps> = ({ invoice, totals }) => {
  const factureRef = useRef<HTMLDivElement>(null);
  const handleDowloadPdf = async () => {
    const element = factureRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "A4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`facture-${invoice.name}.pdf`);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
      }
    }
  };
  return (
    // ici le hidden va permettre de ne pas afficher les info quand on est sur un petit écran et le lg:block va le faire apparaitre sur le grand écran
    <div className="mt-4 hidden lg:block">
      <div className="border-base-300 border-2 border-dashed rounded-xl p-5">
        <button
          className="btn btn-sm btn-accent mb-4"
          onClick={handleDowloadPdf}
        >
          Facture
          <ArrowDownFromLine className="w-4" />
        </button>

        <div className="p-8" ref={factureRef}>
          <div className="flex justify-between items-center text-sm">
            <div className="flex-col">
              <div className="">
                <div className="flex items-center">
                  <div>
                    <div className="flex items-center">
                      <div className="bg-accent-content text-accent rounded-full p-2">
                        <HandCoins className="h-6 w-6" />
                      </div>
                      <span className=" ml-3 font-bold text-2xl italic">
                        Dam<span className="text-accent">Facture</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-7xl uppercase">Facture</h1>
            </div>

            <div className="text-right uppercase">
              <p className="badge badge-ghost">Facture N° {invoice.id}</p>
              <p className="my-2">
                <strong>Date </strong>
                {formatDate(invoice.invoiceDate)}
              </p>

              <p>
                <strong>Date d&apos;échéance </strong>
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <div>
              <p className="badge badge-ghost mb-2">Emetteur</p>
              <p className="text-sm font-bold italic">{invoice.issuerName}</p>
              <p className="text-sm text-gray-500 w-52 break-words">
                {invoice.issuerAddress}
              </p>
            </div>

            <div className="text-right">
              <p className="badge badge-ghost mb-2">Client</p>
              <p className="text-sm font-bold italic">{invoice.clientName}</p>
              <p className="text-sm text-gray-500 w-52 break-words">
                {invoice.clientAddress}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{line.description}</td>
                    <td>{line.quantity}</td>
                    <td>{line.unitPrice.toFixed(2)}f CFA</td>
                    <td>{(line.quantity * line.unitPrice).toFixed(2)} f CFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 text-md">
            <div className="flex justify-between">
              <div className="font-bold">Total Hors Taxes</div>
              {/* totals?.totalHT → Vérifie si totals existe avant d'accéder à totalHT.

?? "0.00" → Si totals.totalHT est null ou undefined, on affiche "0.00". */}
              <div>{totals?.totalHT?.toFixed(2) ?? "0.00"}f CFA</div>
            </div>

            {invoice.vatActive && (
              <div className="flex justify-between">
                <div className="font-bold">TVA {invoice.vatRate} %</div>
                <div>{totals?.totalVAT?.toFixed(2) ?? "0.00"}</div>
              </div>
            )}

            <div className="flex justify-between">
              <div className="font-bold">Total Toutes Taxes Comprises</div>
              <div className="badge badge-accent">
                {totals?.totalTTC?.toFixed(2) ?? "0.00"}f CFA
              </div>
            </div>

            <h4 className="pt-6">
              
              Réalisé par ADODODJI KOKOUVI DAMAZ développeur full Stack(Web &
              Mobile)
            </h4>
          </div>
        </div>
      </div>

      <div className="justify-center my-5 font-bold text-center">
        <div className="bg-accent p-2 rounded-md">
          <a
            href="http://www.linkedin.com/in/kokouvi-damaz-adododji-8b5424285"
            className="text-white"
          >
            Réalisé par ADODODJI KOKOUVI DAMAZ développeur full Stack(Web &
            Mobile)
          </a>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} - Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default InvoicePDF;
