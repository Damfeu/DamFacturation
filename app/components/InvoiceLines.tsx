import { Invoice } from "@/type";
import { InvoiceLine } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import React from "react";

interface Props {
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
}

const InvoiceLines: React.FC<Props> = ({ invoice, setInvoice }) => {
  // cette fonction permet d'ajouter une nouvel ligne en cliquant sur le button Plus
  const handleAddLine = () => {
    const newLine: InvoiceLine = {
      id: `${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      invoiceId: invoice.id,
    };
    setInvoice({
      ...invoice,
      lines: [...invoice.lines, newLine],
    });
  };
  // index ici représente la position de la ligene pour savoir quel ligne il faut changer
  const handleCantityChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].quantity = value === "" ? 0 : parseInt(value);
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].description = value;
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedLines = [...invoice.lines];
    updatedLines[index].unitPrice = value === "" ? 0 : parseFloat(value);
    // le setInvoice permet de mettre a jour
    setInvoice({ ...invoice, lines: updatedLines });
  };

  const handleRemoveLine = (index:number) => {
    const updatedLines = invoice.lines.filter((_, i) => i !== index)
    setInvoice({ ...invoice, lines: updatedLines });
  };

  return (
    <div className="h-fit bg-base-200 p-5 rounded-xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="badge badge-accent">Produits / Services</h2>

        <button className="btn btn-sm btn-accent">
          <Plus className="w-4" onClick={handleAddLine} />
        </button>
      </div>

      <div className="scrollable">
        <table className="table w-full">
          <thead className="uppercase">
            <tr>
              <th>Quantité</th>
              <th>description</th>
              <th>Prix Unitaire (HT)</th>
              <th>Montant (HT)</th>
            </tr>
          </thead>

          <tbody>
            {invoice.lines.map((line, index) => (
              <tr key={line.id}>
                <td>
                  <input
                    type="number"
                    value={line.quantity}
                    className="input input-sm input-bordered w-full"
                    min={0}
                    onChange={(e) => handleCantityChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={line.description}
                    className="input input-sm input-bordered w-full"
                    min={0}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={line.unitPrice}
                    className="input input-sm input-bordered w-full"
                    min={0}
                    // le step permet d'ajouter des nombre apres la virgule d'ordre de 1 par click
                    step={0.01}
                    onChange={(e) =>
                      handleUnitPriceChange(index, e.target.value)
                    }
                  />
                </td>
                <td className="font-bold">
                  {/* le tofixed(2)permet d'ajouter deux zero a la fin au cas où on a des trucs a virgule */}
                  {(line.quantity * line.unitPrice).toFixed(2)} f CFA
                </td>

                <td>
                  <button className="btn btn-sm btn-circle btn-accent" onClick={() =>handleRemoveLine(index)}>
                    <Trash className="w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceLines;
