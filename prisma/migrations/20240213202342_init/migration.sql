-- CreateTable
CREATE TABLE `auberge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pg` TEXT NOT NULL,
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
    `solde` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `total_depense` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
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
CREATE TABLE `consommations` (
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
CREATE TABLE `fams` (
    `nums` INTEGER NOT NULL,
    `solde` DECIMAL(8, 2) NOT NULL,

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
    `bucque` VARCHAR(35) NULL,
    `nums` INTEGER NOT NULL,
    `tabagns` ENUM('Ch', 'An', 'Ai', 'Cl', 'Li', 'Bo', 'Me', 'Ka') NOT NULL,
    `proms` INTEGER NOT NULL,
    `boquette` VARCHAR(255) NULL,
    `email` VARCHAR(200) NOT NULL,
    `solde` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `solde_liquide` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    `sexe` BOOLEAN NOT NULL DEFAULT true,
    `dossier_photos` VARCHAR(30) NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL DEFAULT '91b1bb7c2d6d0ccbaa574c690930b317ad44ebb9',
    `sel` VARCHAR(255) NULL,
    `actif` SMALLINT NULL DEFAULT 1,
    `droit` INTEGER NOT NULL DEFAULT 0,
    `au_tabagns` BOOLEAN NOT NULL DEFAULT false,
    `badge` BIGINT NULL,
    `dernier_rappel_mail_negats` DATETIME(0) NULL,
    `dernier_palier_mail_negats` INTEGER NOT NULL DEFAULT 0,
    `temps_negats` INTEGER NOT NULL DEFAULT 0,
    `info` TEXT NULL,

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
    `actiontafferie` TEXT NOT NULL,

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



INSERT INTO `categories` (`id_categorie`, `id_boquette`, `nom`) VALUES
(1, 7, 'Cocktails'),
(3, 7, 'Bière'),
(4, 7, 'Soft'),
(5, 7, 'Tangente'),
(6, 12, 'pelotes'),
(7, 12, 'cache-boüles'),
(8, 12, 'bonn\'s'),
(9, 12, 'feutrine'),
(12, 7, 'Café'),
(13, 17, 'Friture'),
(14, 2, 'Tap\'s K\'ve'),
(16, 3, 'Croütes'),
(17, 3, 'Bandars'),
(18, 3, 'Autre'),
(19, 3, 'Fromages'),
(20, 147, 'KoeKoe'),
(21, 1, 'Strass Choco'),
(22, 8, 'T-shirts'),
(23, 8, 'Sweats'),
(24, 8, 'Tote-bags'),
(25, 8, 'Autres'),
(26, 10, 'Vanuxeem'),
(28, 12, 'Cache-boüles poudlard'),
(29, 136, 'Z\'Boiss'),
(31, 5, ''),
(32, 5, 'Textile'),
(33, 5, 'Goodies'),
(34, 10, 'Orgemont'),
(35, 4, ''),
(36, 150, 'Cigare'),
(37, 19, 'Poker'),
(38, 14, 'Fin’s '),
(40, 5, 'Ecussons'),
(41, 4, 'Shot'),
(42, 10, ''),
(43, 10, 'Consignes'),
(45, 10, 'Soredis'),
(46, 4, 'Autres'),
(47, 143, 'Cocktails avec alcool'),
(48, 143, 'Cocktails sans alcool'),
(49, 193, 'Salé'),
(50, 2, 'Bouteilles Vin Blanc'),
(51, 2, 'Bouteilles Vin Rouge'),
(54, 193, 'Biscuits/Gâteaux'),
(55, 193, 'Bonbons'),
(56, 193, 'Chocolat'),
(57, 193, 'Barres céréales'),
(58, 2, 'Bouteilles Rosé'),
(60, 7, 'Casquette'),
(61, 7, '508'),
(62, 142, ''),
(63, 142, 'Boujaron'),
(64, 5, 'Bapseuses '),
(65, 5, 'Z’g'),
(66, 2, 'Kir'),
(67, 2, 'Crémant'),
(68, 195, 'Pizza'),
(70, 195, '1/2 Pizza'),
(71, 195, '1/4 Pizza'),
(72, 195, '1/8 Pizza'),
(75, 193, 'Autres'),
(76, 196, 'Oeufs'),
(77, 2, 'Fin\'s de Nol\'s'),
(79, 193, 'Glaces'),
(80, 3, 'Tap\'ss spéciaux ');
