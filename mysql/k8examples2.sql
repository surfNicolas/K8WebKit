CREATE TABLE `TPareas` (
	`areaID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`projectID` INT(10) NOT NULL,
	`areaname` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`areaID`)
);

CREATE TABLE `TPpoints` (
	`pointID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`surfaceID` INT(10) NOT NULL,
	`at` VARCHAR(10) NULL DEFAULT NULL,
	`x` INT(10) NULL DEFAULT NULL,
	`y` INT(10) NULL DEFAULT NULL,
	PRIMARY KEY (`pointID`)
);

CREATE TABLE `TPprojects` (
	`projectID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`projectname` VARCHAR(50) NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`projectID`),
	INDEX `Schl�ssel 2` (`projectname`)
);

CREATE TABLE `TPsurfaces` (
	`surfaceID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`areaID` INT(10) NOT NULL,
	`surfacename` VARCHAR(50) NOT NULL,
	`type` SMALLINT(6) NOT NULL DEFAULT '0',
	PRIMARY KEY (`surfaceID`)
);


CREATE TABLE `hrhelprequest` (
	`requestID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`title` VARCHAR(50) NOT NULL,
	`status` TINYINT(4) NULL DEFAULT NULL,
	`categoryID` INT(11) NULL DEFAULT NULL,
	`descriptionshort` VARCHAR(255) NOT NULL,
	`descriptionlong` TEXT NOT NULL,
	`frequencymode` TINYINT(4) NOT NULL,
	`frequencytext` VARCHAR(50) NULL DEFAULT NULL,
	`startdatetime` DATETIME NOT NULL,
	`enddatetime` DATETIME NULL DEFAULT NULL,
	`latitude` INT(11) NULL DEFAULT NULL,
	`longitude` INT(11) NULL DEFAULT NULL,
	`city` VARCHAR(50) NOT NULL,
	`partoftown` VARCHAR(50) NOT NULL,
	`creatorID` INT(10) NOT NULL,
	`datetimecreated` DATETIME NOT NULL,
	PRIMARY KEY (`requestID`)
);

CREATE TABLE `hrhelpoffer` (
	`offerID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`requestID` INT(10) NOT NULL,
	`message` VARCHAR(500) NOT NULL,
	`creatorID` VARCHAR(500) NOT NULL,
	`datetimecreated` DATETIME NOT NULL,
	PRIMARY KEY (`offerID`)
);