-- CreateTable
CREATE TABLE `auberge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `bandars` TEXT NULL,
    `fromage` TEXT NOT NULL,
    `commentaire` TEXT NOT NULL,
    `telephone` TEXT NOT NULL,
    `status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boquettes` (
    `id_boquette` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(50) NULL,
    `solde` DOUBLE NOT NULL DEFAULT 0.00,
    `total_depense` DOUBLE NOT NULL DEFAULT 0.00,
    `mot_de_passe` VARCHAR(255) NULL,
    `sel` VARCHAR(255) NULL,
    `ordre_apparition` INTEGER NOT NULL,
    `partie_pg` BOOLEAN NOT NULL,
    `solde_a_debiter` VARCHAR(255) NOT NULL DEFAULT 'total',
    `nom_simple` VARCHAR(20) NULL,
    `actif` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id_boquette`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bouls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` TEXT NOT NULL,
    `id_pg` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `id_boquette` INTEGER NOT NULL,
    `nom` TEXT NOT NULL,

    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` TEXT NOT NULL,
    `valeur` TEXT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consommations_old` (
    `id_conso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NULL,
    `id_produit` INTEGER NULL,
    `id_boquette` INTEGER NULL,
    `id_conso_bis` INTEGER NULL,
    `date_conso` DATETIME(0) NOT NULL,
    `date_consommation_vrai` DATETIME(0) NULL,
    `quantite` FLOAT NULL,
    `id_fams_historique` INTEGER NULL,
    `libelle` VARCHAR(255) NULL,
    `credit` FLOAT NULL,
    `debit` FLOAT NULL,
    `solde_avant` FLOAT NULL,
    `solde_apres` FLOAT NULL,
    `type_solde` VARCHAR(255) NOT NULL DEFAULT 'total',
    `annule` BOOLEAN NULL,

    PRIMARY KEY (`id_conso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consommations` (
    `id_conso` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('pg_pg', 'pg_boq', 'ext_boq', 'pg_fams', 'ext_fams', 'pg_ext') NOT NULL,
    `from` INTEGER NULL,
    `to` INTEGER NULL,
    `id_produit` INTEGER NULL,
    `quantite` INTEGER NULL,
    `solde_avant` FLOAT NOT NULL,
    `solde_apres` FLOAT NOT NULL,
    `montant` FLOAT NOT NULL,
    `libelle` VARCHAR(255) NOT NULL,
    `date_conso` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annule` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_conso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fams` (
    `nums` INTEGER NOT NULL,
    `solde` DOUBLE NOT NULL,

    PRIMARY KEY (`nums`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historique_fams` (
    `id_transaction` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` TEXT NOT NULL,
    `fams` INTEGER NOT NULL,
    `id_pg` INTEGER NULL,
    `solde_avant` FLOAT NOT NULL,
    `solde_apres` FLOAT NOT NULL,
    `credit` FLOAT NULL,
    `debit` FLOAT NULL,
    `date_transaction` DATETIME(0) NULL,
    `annule` INTEGER NULL,

    PRIMARY KEY (`id_transaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscriptions` (
    `id_inscription` INTEGER NOT NULL AUTO_INCREMENT,
    `nums` INTEGER NOT NULL,
    `tabagns` TEXT NOT NULL,
    `proms` INTEGER NOT NULL,
    `mail` TEXT NOT NULL,
    `nom` TEXT NOT NULL,
    `prenom` TEXT NOT NULL,
    `bucque` TEXT NOT NULL,
    `commentaire` TEXT NOT NULL,

    PRIMARY KEY (`id_inscription`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `price` FLOAT NOT NULL,
    `prixachat` FLOAT NOT NULL DEFAULT 0,
    `inventaire` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `motdepasse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `mdp` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pg` (
    `id_pg` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(35) NOT NULL,
    `prenom` VARCHAR(35) NOT NULL,
    `bucque` VARCHAR(35) NOT NULL,
    `nums` INTEGER NOT NULL,
    `tabagns` ENUM('Ch', 'An', 'Ai', 'Cl', 'Li', 'Bo', 'Me', 'Ka') NOT NULL,
    `proms` INTEGER NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `solde` DOUBLE NOT NULL DEFAULT 0.00,
    `mot_de_passe` VARCHAR(255) NOT NULL DEFAULT '91b1bb7c2d6d0ccbaa574c690930b317ad44ebb9',
    `actif` SMALLINT NOT NULL DEFAULT 1,
    `ddp` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id_pg`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photos` (
    `id_pg` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` TEXT NOT NULL,

    PRIMARY KEY (`id_pg`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produits` (
    `id_produit` INTEGER NOT NULL AUTO_INCREMENT,
    `id_boquette` INTEGER NOT NULL,
    `id_categorie` INTEGER NOT NULL DEFAULT 0,
    `nom` TEXT NOT NULL,
    `prix` FLOAT NOT NULL,
    `inventaire` INTEGER NOT NULL DEFAULT -999,
    `libreservice` INTEGER NOT NULL DEFAULT 0,
    `qrcode` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id_produit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rechargements` (
    `id_rechargement` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `keyLydia` TEXT NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `date` DATETIME(0) NOT NULL,
    `montant` FLOAT NOT NULL,

    PRIMARY KEY (`id_rechargement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `nombre` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `remboursement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `montant` FLOAT NOT NULL,
    `methode` TEXT NOT NULL,
    `fichier` TEXT NOT NULL,
    `actiontaferie` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `remember` (
    `id_pg` INTEGER NOT NULL AUTO_INCREMENT,
    `code` TEXT NOT NULL,

    PRIMARY KEY (`id_pg`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rhopseskve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pg` TEXT NOT NULL,
    `idproduit` TEXT NOT NULL,
    `quantite` INTEGER NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `total` FLOAT NOT NULL,
    `status` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spotify` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pg` INTEGER NOT NULL,
    `lien_musique` TEXT NOT NULL,
    `titre_auteur` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auberge` ADD CONSTRAINT `auberge_id_pg_fkey` FOREIGN KEY (`id_pg`) REFERENCES `pg`(`id_pg`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consommations` ADD CONSTRAINT `consommation_from_pg` FOREIGN KEY (`from`) REFERENCES `pg`(`id_pg`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consommations` ADD CONSTRAINT `consommation_to_pg` FOREIGN KEY (`to`) REFERENCES `pg`(`id_pg`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consommations` ADD CONSTRAINT `consommation_to_boq` FOREIGN KEY (`to`) REFERENCES `boquettes`(`id_boquette`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consommations` ADD CONSTRAINT `consommation_to_fams` FOREIGN KEY (`to`) REFERENCES `fams`(`nums`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh` ADD CONSTRAINT `refresh_id_pg_fkey` FOREIGN KEY (`id_pg`) REFERENCES `pg`(`id_pg`) ON DELETE RESTRICT ON UPDATE CASCADE;
