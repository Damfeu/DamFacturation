// Ici j'ai importer Invoice et je l'ai renomer
import { Invoice as PrismaInvoice } from "@prisma/client";
import { InvoiceLine } from "@prisma/client";

// ici j'ai créer une interface qui s'appel Invoice et je l'ettend ( heritage) a PrismaInvoice
export interface Invoice extends PrismaInvoice {
  lines: InvoiceLine[];
}

export interface Totals {
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}
