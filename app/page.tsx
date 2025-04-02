"use client";
// import Image from "next/image";
import Wrapper from "./components/Wrapper";
import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
// import { createEmptyInvoice } from "./action";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { createEmptyInvoice, getInvoicesByEmail } from "./action";
import { Invoice } from "@/type";
import InvoiceComponent from "./components/InvoiceComponent";

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  // variable d'etat
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // fetchInvoices est une variable qui contient une fonction
  const fetchInvoices = async () => {
    // if (!email) {
    //   console.warn("Email non défini, impossibilité de récupérer les factures");
    //   return;
    // }

    try {
      // ici j'ai recupérer toute les factures de l'utilisateur
      const data = await getInvoicesByEmail(email);
      if (data) {
        setInvoices(data);
      }
    } catch (error) {
      console.error("erreur lors du chargement de la facture ", error);
    }
  };
  useEffect(() => {
    // if (email) {
    //   fetchInvoices();
    // }
    fetchInvoices()
  }, [email]);

  // creation d'une variable d'etat pour récuperer le nom choisi par l'utilisateur
  const [invoiceName, setInvoiceName] = useState("");
  const [IsNameValid, setIsNameValid] = useState(true);

  useEffect(() => {
    setIsNameValid(invoiceName.length <= 60);
  }, [invoiceName]);

  // Géneralement les fonction async font appel a la basse BDD

  const handleCreateInvoice = async () => {
    console.log("handleCreateInvoice déclenché !");
    try {
      if (email) {
        console.log("Email trouvé:", email);
        console.log("Nom de la facture:", invoiceName);
        await createEmptyInvoice(email, invoiceName);
        console.log("Facture créée !");
      }
      fetchInvoices()
      setInvoiceName("");

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        console.log("Fermeture du modal");
        modal.close();
      } else {
        console.log("Modal introuvable !");
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
    }
  };

  return (
    <Wrapper>
      <div className="flex flex-col space-y-4">
        <h1 className="text-lg font-bold">Mes factures </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <div
            className="cursor-pointer border border-accent rounded-xl flex flex-col justify-content-center items-center p-5"
            onClick={() =>
              (
                document.getElementById("my_modal_3") as HTMLDialogElement
              ).showModal()
            }
          >
            <div className="font-bold text-accent">Créer une facture</div>

            <div className="bg-accent-content text-accent rounded-full p-2 mt-2">
              <HandCoins className="h-6 w-6" />
            </div>
          </div>

          {/* Ici j'affiche la Listes des factures  */}
          {invoices.length > 0 &&
            invoices.map((invoice, index) => (
              <div key={index}>
                <InvoiceComponent invoice={invoice} index={index}/>
                </div>
            ))}
        </div>

        {/* Eporter depuis Daisyui */}

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Nouvelle Facture</h3>

            <input
              type="text"
              placeholder="Nom de la facture(60 caractère au maaximum)"
              className="input input-bordered w-full my-4"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
            />
            {!IsNameValid && (
              <p className="text-accent mb-5 text-sm">
                Le nom ne peut pas dépasser 60 caractère.
              </p>
            )}

            <button
              className="btn btn-accent"
              disabled={!IsNameValid || invoiceName.length === 0}
              onClick={handleCreateInvoice}
            >
              Créer
            </button>
          </div>
        </dialog>
      </div>

      <div className="justify-center my-5 font-bold text-center">
        <div className=" p-2 rounded-md">
          <a
            href="http://www.linkedin.com/in/kokouvi-damaz-adododji-8b5424285"
            className="text-gray-500"
          >
            Réalisé par ADODODJI KOKOUVI DAMAZ développeur full Stack(Web &
            Mobile)
          </a>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} - Tous droits réservés.
        </p>
      </div>


    </Wrapper>



  );
}
