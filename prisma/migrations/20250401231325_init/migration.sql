-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `issuerName` VARCHAR(191) NOT NULL DEFAULT '',
    `issuerAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `clientName` VARCHAR(191) NOT NULL DEFAULT '',
    `clientAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `invoiceDate` VARCHAR(191) NOT NULL DEFAULT '',
    `dueDate` VARCHAR(191) NOT NULL DEFAULT '',
    `vatActive` BOOLEAN NOT NULL DEFAULT false,
    `vatRate` DOUBLE NOT NULL DEFAULT 20,
    `status` INTEGER NOT NULL DEFAULT 1,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceLine` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0,
    `invoiceId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
