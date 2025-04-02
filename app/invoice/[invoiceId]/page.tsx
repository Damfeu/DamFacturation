"use client";
import { deleteInvoice, getInvoiceById, updateInvoice } from "@/app/action";
import InvoiceInfo from "@/app/components/InvoiceInfo";
import InvoiceLines from "@/app/components/InvoiceLines";
import InvoicePDF from "@/app/components/InvoicePDF";
import VATControl from "@/app/components/VATControl";
import Wrapper from "@/app/components/Wrapper";
import { Invoice, Totals } from "@/type";
import { Save, Trash } from "lucide-react";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";

const page = ({ params }: { params: Promise<{ invoiceId: string }> }) => {
  // ici c'est la facture debase qui va subir des modifications
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  // ici c'est la facture initial qu'on a concerveé ici (la facture de base lors de la creation sur l'autre interface)
  const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  // cette constante permet de desactiver le boutton sauvegarder
  const [isSaveDisabled, setIsSaveDisabed] = useState(true);
  // permet d'afficher un chargement
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchInvoice = async () => {
    try {
      const { invoiceId } = await params;

      console.log("Invoice ID:", invoiceId);
      if (!invoiceId) {
        console.error("Erreur: invoiceId est null ou undefined");
        return;
      }
      // c'est cette constante qui contient la facture qui a été récupérer
      const fetchedInvoice = await getInvoiceById(invoiceId);
      if (fetchedInvoice) {
        setInvoice(fetchedInvoice);
        setInitialInvoice(fetchedInvoice);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    if (!invoice) return;

    // acc est une variable accumulaive qui permet de faire le calcul total de toute les lignes
    const ht = invoice.lines.reduce(
      (acc, { quantity, unitPrice }) => acc + quantity * unitPrice,
      0
    );

    const vat = invoice.vatActive ? ht * (invoice.vatRate / 100) : 0;
    setTotals({ totalHT: ht, totalVAT: vat, totalTTC: ht + vat });
  }, [invoice]);

  // cette feonction permt de changer le statu de la facture

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = parseInt(e.target.value);
    if (invoice) {
      const updatedInvoice = { ...invoice, status: newStatus };
      setInvoice(updatedInvoice);
    }
  };

  const handleSave = async () => {
    if (!invoice) return;
    setIsLoading(true);
    try {
      await updateInvoice(invoice);
      // permet de recupérer la facture mise a jour
      const updatedInvoice = await getInvoiceById(invoice.id);
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
        setInitialInvoice(updatedInvoice);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la facture:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")

    if (confirmed) {
      try {
        // ici je suprime la facture
        await deleteInvoice(invoice?.id as string)
        // ici je fait la redirection vers la page principale
        router.push("/")
      } catch (error) {
        console.error("Erreur lors de la suppression de la facture.", error);
      }
    }
  }

  useEffect(() => {
    setIsSaveDisabed(
      // ici je compare invoice et initial invoice donc si ya pas de différence entre invoice et initial invoice le boutton sauvegarder reste desactiver mais si il ya une difference le bouttton s'active
      JSON.stringify(invoice) === JSON.stringify(initialInvoice)
    );
  }, [invoice, initialInvoice]);

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <span className="font-bold ">Facture non trouvée</span>
      </div>
    );
  }

  return (
    <Wrapper>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:mb-5">
          {/* ici j'affiche l'ID des différent facture */}
          <p className="badge badge-ghost badge-lg uppercase">
            <span>Facture-</span>
            {invoice?.id}
          </p>
          <div className="flex md:mt-0 mt-4">
            <select
              className="select select-sm select-bordered w-full "
              value={invoice?.status}
              onChange={handleStatusChange}
            >
              <option value={1}>Brouillon</option>
              <option value={2}>En attente</option>
              <option value={3}>Payée</option>
              <option value={3}>Annulée</option>
              <option value={4}>Impayée</option>
            </select>

            <button
              className="btn btn-sm btn-accent ml-4"
              disabled={isSaveDisabled || isLoading}
              onClick={handleSave}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Sauvegarder
                  <Save className="w-4 ml-2" />
                </>
              )}
            </button>
            <button
              className="btn btn-sm btn-accent ml-4"
              onClick={handleDelete}
            >
              <Trash className="w-4" />
            </button>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row w-full">
          <div className="flex w-full md:w-1/3 flex-col ">
            <div className="mb-4 bg-base-200 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="badge badge-accent">Resumé des totaux</div>
                <VATControl invoice={invoice} setInvoice={setInvoice} />
              </div>

              <div className="flex justify-between">
                <span>Total Hors taxes</span>
                {/* On vérifie si totals existe (totals ?).
Si oui, on affiche totals.totalVAT formaté avec 2 décimales (toFixed(2)).
Sinon, on affiche "0.00" pour éviter une erreur */}
                <span> {totals?.totalHT.toFixed(2)} f CFA</span>
              </div>

              <div className="flex justify-between">
                {/* ici gère l'apparution de la tva en fontion du taus choisi dans l'input du composant si-dessus */}
                <span>
                  {/* ici le $ permet de convertire en chîne de caractère et permet d'eviter des erreur comme undifined  */}
                  TVA ({invoice?.vatActive ? `${invoice?.vatRate}` : `0`}%){" "}
                </span>
                {/* On vérifie si totals existe (totals ?).
Si oui, on affiche totals.totalVAT formaté avec 2 décimales (toFixed(2)).
Sinon, on affiche "0.00" pour éviter une erreur */}
                <span> {totals?.totalVAT.toFixed(2)} f CFA</span>
              </div>

              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span> {totals?.totalTTC.toFixed(2)} f CFA</span>
              </div>
            </div>
            {/* ici on affiche les information de la facture */}
            <InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
          </div>

          <div className="flex w-full md:w-2/3 flex-col ml-4">
            <InvoiceLines invoice={invoice} setInvoice={setInvoice} />
            <InvoicePDF invoice={invoice} totals={totals}/>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
