"use server"

import prisma from "@/lib/prisma";
import { Invoice } from "@/type";
import { error } from "console";
import { randomBytes } from "crypto";
// import { Invoice } from "@/type";


export async function checkAndAddUser(email: string, name: string) {
    if (!email) return;
    // ici on recherche l'utilisateur
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
// ici c'est quand l'utilisateur n'existe pas donc on le créer
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name
                }
            })
        }

    } catch (error) {
        console.error(error)
    }
}

const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = randomBytes(3).toString('hex');
        console.log("🆔 ID généré :", uniqueId);

        const existingInvoice = await prisma.invoice.findUnique({
            where: { id: uniqueId }
        });

        if (!existingInvoice) {
            console.log("✅ ID unique trouvé :", uniqueId);
            isUnique = true;
        }
    }
    return uniqueId;
};


// cette fonction prend en compte l'email de l'utilisateur qui créer la facture et le nom de la facture(une facture vide)
export async function createEmptyInvoice(email: string, name: string) {
    try {
        console.log("📢 Début de la création de la facture...");
        console.log("📧 Email reçu :", email);
        console.log("📄 Nom de la facture reçu :", name);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log("❌ Utilisateur non trouvé !");
            return;
        }
        
        console.log("✅ Utilisateur trouvé :", user);

        const invoiceId = await generateUniqueId() as string;
        console.log("🆔 ID de facture généré :", invoiceId);

        const newInvoice = await prisma.invoice.create({
            data: {
                id: invoiceId,
                name,
                userId: user.id,
                issuerName: "",
                issuerAddress: "",
                clientName: "",
                clientAddress: "",
                invoiceDate: "",
                dueDate: "",
                vatActive: false,
                vatRate: 20,
            }
        });

        console.log("✅ Facture créée avec succès :", newInvoice);
        return newInvoice;
        
    } catch (error) {
        console.error("🚨 Erreur lors de la création de la facture :", error);
    }
}

export async function getInvoicesByEmail(email: string) {
    if (!email) return;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                invoices: {
                    include: {
                        lines: true,
                    }
                }
            }
        })
        // Statuts possibles :
        // 1: Brouillon
        // 2: En attente
        // 3: Payée
        // 4: Annulée
        // 5: Impayé
        if (user) {
            const today = new Date()

            // ce sont les factures mise a jour
            const updatedInvoices = await Promise.all(
                user.invoices.map(async (invoice) => {
                    const dueDate = new Date(invoice.dueDate)
                    if (
                        dueDate < today &&
                        invoice.status == 2
                    ) {
                        const updatedInvoice = await prisma.invoice.update({
                            where: { id: invoice.id },
                            data: { status: 5 },
                            include: { lines: true }
                        })
                        return updatedInvoice
                    }
                    return invoice
                })
            )
            return updatedInvoices

        }
    } catch (error) {
        console.error(error)
    }
}

export async function getInvoiceById(invoiceId:string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where :
             {id:invoiceId},
             include:{
                lines: true
             }
        })
        if (!invoice) {
            throw new Error("Facture non trouvée");
        }
        return invoice

        
    } catch (error) {
       console.error(error) 
    }
}

export async function updateInvoice(invoice:Invoice) {
    try {
        const existingInvoice = await prisma.invoice.findUnique({
            where: {id: invoice.id},
            include: {
                lines:true
            }
        })

        if (!existingInvoice) {
            throw new Error(`Facture avec l'ID ${invoice.id} introuvable.`);
        }

        await prisma.invoice.update({
            where:{id:invoice.id},
            // le data représente les données a mettre a jour
            data :{
                issuerName: invoice.issuerName,
                issuerAddress: invoice.issuerAddress,
                clientName: invoice.clientName,
                clientAddress: invoice.clientAddress,
                invoiceDate: invoice.invoiceDate,
                dueDate: invoice.dueDate,
                vatActive: invoice.vatActive,
                vatRate: invoice.vatRate,
                status: invoice.status,
            }
        })



        const existingLines = existingInvoice.lines
        const receivedLines= invoice.lines
        
        const linesToDelete = existingLines.filter(
            (existingLine)=> !receivedLines.some((line)=>line.id===existingLine.id)
    )
    if (linesToDelete.length > 0) {
        await prisma.invoiceLine.deleteMany({
            where:{
                id:{in: linesToDelete.map((line)=>line.id)}
            }
        })
    }

    for(const line of receivedLines){
        const existingLine = existingLines.find((l)=>l.id == line.id)
        if (existingLine) {
            const hasChanged = 
            line.description ! == existingLine.description ||
            line.quantity ! == existingLine.quantity ||
            line.unitPrice ! == existingLine.unitPrice;

            if (hasChanged) {
                await prisma.invoiceLine.update({
                    where:{id:line.id},
                    data:{
                        description : line.description,
                        quantity : line.quantity,
                        unitPrice : line.unitPrice,
                    }
                    
                })
                
            }
        }else{
            // créer une nouvelle ligne
                            await prisma.invoiceLine.create({
                                data:{
                                    description:line.description,
                                    quantity: line.quantity,
                                    unitPrice: line.unitPrice,
                                    invoiceId:invoice.id
                                }
                            })
                        }
    }

    } catch (error) {
      console.error(error)  
    }
}


export async function deleteInvoice(invoiceId:string){
  
    try {
        const deleteInvoice = await prisma.invoice.delete({
            where:{id:invoiceId}
        })
        if (!deleteInvoice) {
            throw new Error("Erreur lors de la suppression de la facture.");
    
        } 
    } catch (error) {
        console.error(error)
    }

}
 
