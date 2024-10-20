SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `k8documents` (
	`docID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NULL DEFAULT NULL,
	`doctypeID` INT(11) NULL DEFAULT NULL,
	`docnumber` INT(10) NULL DEFAULT NULL,
	`docdate` DATE NULL DEFAULT NULL,
	`accountID` INT(11) NULL DEFAULT NULL,
	`partnernumber` VARCHAR(50) NULL DEFAULT NULL,
	`name1` VARCHAR(60) NULL DEFAULT NULL,
	`name2` VARCHAR(60) NULL DEFAULT NULL,
	`street` VARCHAR(60) NULL DEFAULT NULL,
	`code` VARCHAR(10) NULL DEFAULT NULL,
	`country` VARCHAR(10) NULL DEFAULT NULL,
	`city` VARCHAR(60) NULL DEFAULT NULL,
	`header` TEXT NULL DEFAULT NULL,
	`footer` TEXT NULL DEFAULT NULL,
	`amount_gross` FLOAT NULL DEFAULT NULL,
	`creatorID` INT(11) NULL DEFAULT NULL,
	`datecreated` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`docID`)
);

CREATE TABLE `k8documentitems` (
	`itemID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NULL DEFAULT NULL,
	`docID` INT(11) NULL DEFAULT NULL,
	`sort` INT(10) NULL DEFAULT NULL,
	`position` INT(10) NULL DEFAULT NULL,
	`componentID` INT(11) NULL DEFAULT NULL,
	`componentnumber` VARCHAR(50) NULL DEFAULT NULL,
	`text1` VARCHAR(50) NULL DEFAULT NULL,
	`quantity` FLOAT NULL DEFAULT NULL,
	`salesunit` VARCHAR(10) NULL DEFAULT NULL,
	`pricesingle` FLOAT NULL DEFAULT NULL,
	`pricetotal` FLOAT NULL DEFAULT NULL,
	PRIMARY KEY (`itemID`)
);

CREATE TABLE `er_customer` (
	`accountID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`accountnumber` VARCHAR(50) NOT NULL,
	`name1` VARCHAR(50) NULL DEFAULT NULL,
	`name2` VARCHAR(50) NULL DEFAULT NULL,
	`street` VARCHAR(50) NULL DEFAULT NULL,
	`country` VARCHAR(10) NULL DEFAULT NULL,
	`code` VARCHAR(10) NULL DEFAULT NULL,
	`city` VARCHAR(50) NULL DEFAULT NULL,
	`phone` VARCHAR(50) NULL DEFAULT NULL,
	`mobile` VARCHAR(50) NULL,
	`email` VARCHAR(250) NULL DEFAULT NULL,
	`website` VARCHAR(100) NULL DEFAULT NULL,
	`fax` VARCHAR(50) NULL DEFAULT NULL,
	`facebook` VARCHAR(100) NULL,
	`memo` TEXT NULL DEFAULT NULL,
	`datetimecreated` DATETIME NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`accountID`)
);
alter table er_customer add `categoryID` INT(10) NULL DEFAULT NULL;
alter table er_customer add `representativeID` INT(10) NULL DEFAULT NULL;
alter table er_customer add `estimatedturnover` DECIMAL(10,2) NULL;
alter table er_customer add `firstcontact` DATE NULL;

CREATE TABLE `er_deliveryaddress` (
	`addressID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`accountID` INT(10) NOT NULL,
	`name1` VARCHAR(50) NULL DEFAULT NULL,
	`name2` VARCHAR(50) NULL DEFAULT NULL,
	`street` VARCHAR(50) NULL DEFAULT NULL,
	`country` VARCHAR(10) NULL DEFAULT NULL,
	`code` VARCHAR(10) NULL DEFAULT NULL,
	`city` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`addressID`)
);

CREATE TABLE `er_employee` (
	`employeeID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`accountID` INT(10) NOT NULL,
	`gender` VARCHAR(10) NULL DEFAULT NULL,
	`firstname` VARCHAR(50) NULL DEFAULT NULL,
	`lastname` VARCHAR(50) NULL DEFAULT NULL,
	`departement` VARCHAR(50) NULL DEFAULT NULL,
	`phone` VARCHAR(50) NULL DEFAULT NULL,
	`email` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`employeeID`)
);

CREATE TABLE `er_pages` (
	`pageID` INT(10) NOT NULL AUTO_INCREMENT,
	`marking` VARCHAR(50) NOT NULL,
	`groupID` INT(10) NULL,
	`headtitle` VARCHAR(255) NULL DEFAULT NULL,
	`headdescription` VARCHAR(255) NULL DEFAULT NULL,
	`content` TEXT NULL DEFAULT NULL,
	`creatorID` INT(11) NULL DEFAULT NULL,
	`datetimecreated` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`pageID`)
);

CREATE TABLE `er_basket` (
	`currentID` INT(10) NOT NULL AUTO_INCREMENT,
	`foreignID` INT(10) NOT NULL,
	`quantity` DOUBLE(19,6) NULL DEFAULT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`currentID`),
	UNIQUE INDEX `Unique` (`foreignID`, `creatorID`)
);

CREATE TABLE `er_register` (
	`registerID` INT(10) NOT NULL AUTO_INCREMENT,
	`gender` TINYINT(4) NULL DEFAULT NULL,
	`firstname` VARCHAR(50) NULL DEFAULT NULL,
	`lastname` VARCHAR(50) NULL DEFAULT NULL,
	`street` VARCHAR(50) NULL DEFAULT NULL,
	`country` VARCHAR(10) NULL DEFAULT NULL,
	`code` VARCHAR(10) NULL DEFAULT NULL,
	`city` VARCHAR(50) NULL DEFAULT NULL,
	`phone` VARCHAR(50) NULL DEFAULT '',
	`mobile` VARCHAR(50) NULL DEFAULT '',
	`email` VARCHAR(250) NULL DEFAULT '',
	`concern` VARCHAR(100) NULL DEFAULT '',
	`facebook` VARCHAR(100) NULL DEFAULT '',
	`memo` TEXT NULL DEFAULT '',
	`status` TINYINT(4) NOT NULL,
	`already18` TINYINT(4) NOT NULL,
	`datetimecreated` DATETIME NOT NULL,
	`datetimedone` DATETIME NULL DEFAULT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`registerID`)
);