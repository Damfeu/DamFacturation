import { Invoice } from "@/type";
import React from "react";

interface Props {
  invoice: Invoice 
  setInvoice: (invoice: Invoice) => void
}

const  InvoiceInfo: React.FC<Props> = ({ invoice, setInvoice }) => {

  // cette seul fonction va permettre de modifier tout en même temps
 const handleInputChange =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field:string ) =>{
// ici le (...) signifie qu'il recupère toute les information de la table invoice
setInvoice({...invoice,[field]:e.target.value})
}
console.log(invoice)

  return (
    <div className="flex flex-col bg-base-200 h-fit p-5 rounded-xl mb-4 md:mb-0">
      <div className="space-y-4 ">
        <h2 className="badge badge-accent">Emetteur</h2>
        <input
          type="text"
          value={invoice?.issuerName}
          placeholder="Nom de l&apos;entreprise emettrice"
          className="input input-bordered w-full resize-none "
          required
          onChange={(e)=>handleInputChange(e, 'issuerName')}
        />

        <textarea
          value={invoice?.issuerAddress}
          placeholder="adresse de l'entreprise émettrice"
          className="textareaa textarea-bordered w-full resize-none h-40 p-3 "
          //  aria-rowcount={5}
          required
          onChange={(e)=>handleInputChange(e, 'issuerAddress')}
        ></textarea>

        <h2 className="badge badge-accent">Client</h2>
        <input
          type="text"
          value={invoice?.clientName}
          placeholder="Nom de l&apos;entreprise cliente"
          className="input input-bordered w-full resize-none "
          required
          onChange={(e)=>handleInputChange(e, 'clientName')}
        />

        <textarea
          value={invoice?.clientAddress}
          placeholder="adresse de l'entreprise cliente"
          className="textareaa textarea-bordered w-full resize-none h-40 p-3"
          //  aria-rowcount={5}
          required
          onChange={(e)=>handleInputChange(e, 'clientAddress')}
        ></textarea>

        <h2 className="badge badge-accent">Date de la facture</h2>
        <input
          type="date"
          value={invoice?.invoiceDate}
          className="input input-bordered w-full resize-none "
          required
          onChange={(e)=>handleInputChange(e, 'invoiceDate')}
        />

        <h2 className="badge badge-accent">Date d&apos;échéance</h2>
        <input
          type="date"
          value={invoice?.dueDate}
          className="input input-bordered w-full resize-none "
          required
          onChange={(e)=>handleInputChange(e, 'dueDate')}

        />
      </div>
    </div>
  );
};

export default InvoiceInfo;
