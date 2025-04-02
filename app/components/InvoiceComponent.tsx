import { Invoice } from "@/type";
import {
  CheckCircle,
  Clock,
  FileText,
  SquareArrowOutUpRight,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";
// index c'est la position de l'element dans la liste
type InvoiceComponentProps = {
  invoice: Invoice;
  index: number;
};

const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <div className="badge badge-lg flex items-center gap-2">
          <FileText className="w-4" />
          Brouillon
        </div>
      );
    case 2:
      return (
        <div className="badge badge-lg badge-warning flex items-center gap-2">
          <Clock className="w-4" />
          En attente
        </div>
      );
    case 3:
      return (
        <div className="badge badge-lg badge-success flex items-center gap-2">
          <CheckCircle className="w-4" />
          Payée
        </div>
      );
    case 4:
      return (
        <div className="badge badge-lg badge-info flex items-center gap-2">
          <XCircle className="w-4" />
          Annulée
        </div>
      );
    case 5:
      return (
        <div className="badge badge-lg badge-error flex items-center gap-2">
          <XCircle className="w-4" />
          Impayée
        </div>
      );
    default:
      return (
        <div className="badge badge-lg ">
          <XCircle className="w-4" />
          Indéfinis
        </div>
      );
  }
};

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({
  invoice,
  index,
}) => {
  const calculTotal = () => {
    // ici on a utiliser Reduce parceque dans une facture on peut avoir plusieur 
    // ligne(chaque ligne est egal a un calcul) donc reduce lui il fait les calcul ligne par
    //  ligne donc si il  fait le premier calcul il garde sa valeur et après il fait le total
    //  de toute les calculs
    const totalHT = invoice?.lines?.reduce((acc, line) => {
      const quantity = line.quantity ?? 0;
      const unitPrice = line.unitPrice ?? 0;
      return acc + quantity * unitPrice;
    }, 0);
// total avec la TVA
    const totalVAT = totalHT *(invoice.vatRate /100);
    // total avec taxe
    return totalHT + totalVAT


  };

  return (
    <div className="bg-base-200/90 p-5 rounded-xl space-y-2 shadow">
      <div className="flex justify-between items-center w-full">
        <div>{getStatusBadge(invoice.status)}</div>
        <Link href={`/invoice/${invoice.id}`} className="btn btn-accent btn-sm">
          {" "}
          Plus
          <SquareArrowOutUpRight className="w-4" />
        </Link>
      </div>

      <div className="w-full">
        <div >
          <div className="stat-title">
            <div className="uppercase text-sm">FACT-{invoice.id}</div>

            <div>
              <div className="stat-value text-xl ">{calculTotal() .toFixed(2)}fr CFA</div>
            </div>
            <div className="stat-desc">
{invoice.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;
