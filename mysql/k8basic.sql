/* k8basic 2024-05-31 */
CREATE TABLE `k8login` (
	`userID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`username` VARCHAR(50) NOT NULL,
	`email` VARCHAR(100) NOT NULL,
	`password` VARCHAR(50) NOT NULL,
	`title` VARCHAR(10) NULL DEFAULT NULL,
	`firstname` VARCHAR(50) NULL DEFAULT NULL,
	`lastname` VARCHAR(50) NULL DEFAULT NULL,
	`street` VARCHAR(50) NULL DEFAULT NULL,
	`country` VARCHAR(10) NULL DEFAULT NULL,
	`code` VARCHAR(10) NULL DEFAULT NULL,
	`city` VARCHAR(50) NULL DEFAULT NULL,
	`phone` VARCHAR(50) NULL DEFAULT NULL,
	`mobile` VARCHAR(50) NULL DEFAULT NULL,
	`categoryID` INT(10) NULL DEFAULT NULL,
	`active` TINYINT(4) NOT NULL,
	`roleID` INT(11) NOT NULL,
	`roles` VARCHAR(255) NOT NULL,
	`settings` TEXT NOT NULL,
	`rightgroupIDdefault` INT(11) NOT NULL,
	`datetimecreated` DATETIME NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`userID`),
	UNIQUE INDEX `username` (`username`)
);

CREATE TABLE `k8loginfriends` (
	`ID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NULL DEFAULT NULL,
	`userID` INT(10) NULL DEFAULT NULL,
	`friendID` INT(10) NULL DEFAULT NULL,
	`roleID` INT(10) NULL DEFAULT NULL,
	`usergroupID` INT(10) NULL DEFAULT NULL,
	PRIMARY KEY (`ID`)
);

CREATE TABLE `k8references` (
	`clientID` INT(10) NULL DEFAULT '0',
	`ID` INT(10) NOT NULL AUTO_INCREMENT,
	`basetype` VARCHAR(50) NULL DEFAULT NULL,
	`baseID` INT(10) NULL DEFAULT '0',
	`marking` VARCHAR(50) NULL DEFAULT NULL,
	`type` VARCHAR(50) NULL DEFAULT NULL,
	`title` VARCHAR(50) NULL DEFAULT NULL,
	`description` TEXT NULL,
	`descriptionlarge` TEXT NULL,
	`path` VARCHAR(255) NULL DEFAULT NULL,
	`filename` VARCHAR(255) NULL DEFAULT NULL,
	`filetype` VARCHAR(50) NULL DEFAULT NULL,
	`height` INT(10) NULL DEFAULT '0',
	`width` INT(10) NULL DEFAULT '0',
	`duration` DOUBLE NULL DEFAULT '0',
	`creatorID` INT(10) NULL DEFAULT '0',
	`datecreated` DATETIME NULL DEFAULT NULL,
	`ready` TINYINT(4) NULL DEFAULT '0',
	`checked` INT(11) NULL DEFAULT '0',
	`sort` INT(11) NULL DEFAULT '0',
	`points` SMALLINT(6) NULL DEFAULT NULL,
	`language` INT(11) NULL DEFAULT '0',
	`childID` INT(11) NULL DEFAULT '0',
	`latitude` DOUBLE NULL DEFAULT '0',
	`longitude` DOUBLE NULL DEFAULT '0',
	`copyright` VARCHAR(500) NULL DEFAULT NULL,
	`mydatetime` DATETIME NULL DEFAULT NULL,
	`addressline` VARCHAR(255) NULL DEFAULT NULL,
	PRIMARY KEY (`ID`)
);

CREATE TABLE `k8languages` (
	`ID` INT(10) NOT NULL AUTO_INCREMENT,
	`pk` INT(10) NULL DEFAULT NULL,
	`languageID` INT(10) NOT NULL,
	`module` VARCHAR(50) NOT NULL,
	`key` VARCHAR(50) NOT NULL,
	`value` TEXT NULL DEFAULT NULL,
	PRIMARY KEY (`ID`),
	INDEX `lang_mod_key` (`pk`, `languageID`, `module`, `key`)
);

CREATE TABLE `k8groups` (
	`groupID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NOT NULL,
	`parentID` INT(10) NOT NULL,
	`sort` INT(11) NOT NULL,
	`type` VARCHAR(20) NOT NULL,
	`title` VARCHAR(50) NOT NULL,
	`fontcolor` VARCHAR(30) NOT NULL,
	`backgroundcolor` VARCHAR(30) NOT NULL,
	`value` TEXT NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`groupID`)
);

CREATE TABLE `k8menuentries` (
	`IDentry` INT(10) NOT NULL AUTO_INCREMENT,
	`parentID` INT(10) NOT NULL,
	`sort` FLOAT NOT NULL,
	`ID` INT(10) NOT NULL,
	`mypage` VARCHAR(50) NOT NULL,
	`activeby` VARCHAR(50) NOT NULL,
	`href` VARCHAR(254) NOT NULL,
	`target` VARCHAR(50) NOT NULL,
	`title` VARCHAR(50) NOT NULL,
	`condition` VARCHAR(254) NOT NULL,
	`li_attributes` VARCHAR(254) NOT NULL,
	`a_attributes` VARCHAR(254) NOT NULL,
	`creatorID` INT(11) NOT NULL,
	PRIMARY KEY (`IDentry`)
);

CREATE TABLE `k8pages` (
	`pageID` INT(10) NOT NULL AUTO_INCREMENT,
	`titleID` INT(10) NOT NULL,
	`clientID` INT(10) NOT NULL,
	`parentID` INT(11) NOT NULL,
	`groupID` INT(11) NULL DEFAULT NULL,
	`classmain` VARCHAR(100) NULL DEFAULT NULL,
	`sort` INT(10) NOT NULL,
	`language` INT(11) NOT NULL,
	`marking` VARCHAR(50) NOT NULL,
	`headtitle` VARCHAR(255) NULL DEFAULT NULL,
	`headdescription` VARCHAR(255) NULL DEFAULT NULL,
	`headkeywords` VARCHAR(255) NULL DEFAULT NULL,
	`head` TEXT NULL DEFAULT NULL,
	`h1` VARCHAR(255) NULL DEFAULT NULL,
	`content` TEXT NULL DEFAULT NULL,
	`preview` TEXT NULL DEFAULT NULL,
	`site` TEXT NULL DEFAULT NULL,
	`foot` TEXT NULL DEFAULT NULL,
	`settings` TEXT NULL DEFAULT NULL,
	`active` TINYINT(4) NULL DEFAULT NULL,
	`pageIDprevious` INT(11) NULL DEFAULT NULL,
	`pageIDnext` INT(11) NULL DEFAULT NULL,
	`datetimechanged` DATETIME NULL DEFAULT NULL,
	`datetimecreated` DATETIME NULL DEFAULT NULL,
	`creatorID` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`pageID`),
	UNIQUE INDEX `marking` (`marking`)
);

CREATE TABLE `k8clients` (
	`clientID` INT(10) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(60) NULL DEFAULT NULL,
	`description` TEXT NULL DEFAULT NULL,
	`datetimecreated` DATETIME NULL DEFAULT NULL,
	`creatorID` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`clientID`),
	UNIQUE INDEX `Name` (`name`)
);

CREATE TABLE `k8rightgroups` (
	`rightgroupID` INT(10) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`description` TEXT NULL DEFAULT NULL,
	`datecreated` DATE NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`rightgroupID`),
	UNIQUE INDEX `Name` (`name`)
);

CREATE TABLE `k8rightmembers` (
	`ID` INT(10) NOT NULL AUTO_INCREMENT,
	`rightgroupID` INT(10) NOT NULL,
	`status` TINYINT(4) NOT NULL,
	`userID` INT(10) NOT NULL,
	PRIMARY KEY (`ID`),
	UNIQUE INDEX `rightgroup_user` (`rightgroupID`, `userID`)
);

CREATE TABLE `k8components` (
	`componentID` INT(10) NOT NULL AUTO_INCREMENT,
	`clientID` INT(10) NULL DEFAULT NULL,
	`componentnumber` VARCHAR(20) NULL DEFAULT NULL,
	`status` TINYINT(4) NULL,
	`text1` VARCHAR(50) NULL DEFAULT NULL,
	`text2` VARCHAR(50) NULL DEFAULT NULL,
	`textdimensions` TEXT NULL DEFAULT NULL,
	`descriptionlong` TEXT NULL DEFAULT NULL,
	`category` VARCHAR(20) NULL DEFAULT NULL,
	`baseunit` VARCHAR(10) NULL DEFAULT NULL,
	`salesunit` VARCHAR(10) NULL DEFAULT NULL,
	`vatclass` INT(11) NULL DEFAULT NULL,
	`conversionfactorsales` FLOAT NULL DEFAULT NULL,
	`servicefactor` DECIMAL(16,8) NULL DEFAULT NULL,
	`price` FLOAT NULL DEFAULT NULL,
	`dateactive` DATE NULL DEFAULT NULL,
	`creatorID` INT(11) NULL DEFAULT NULL,
	`datecreated` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`componentID`),
	INDEX `componentnumber` (`componentnumber`)
);

CREATE TABLE `k8datadefinitions` (
	`ID` INT(10) NOT NULL AUTO_INCREMENT,
	`mydatadefID` VARCHAR(50) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`mytable` VARCHAR(50) NOT NULL,
	`myheadtitlecolumn` VARCHAR(50) NOT NULL,
	`myheaddescriptioncolumn` VARCHAR(50) NOT NULL,
	`mypage` VARCHAR(50) NOT NULL,
	`catalogtemplate` VARCHAR(50) NOT NULL,
	`detailtemplate` VARCHAR(50) NOT NULL,
	`creatorID` INT(10) NOT NULL,
	PRIMARY KEY (`ID`),
	UNIQUE INDEX `datadefID` (`mydatadefID`)
);

CREATE TABLE `k8groupdefinitions` (
	`groupdefID` INT(10) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(50) NULL DEFAULT NULL,
	`type` VARCHAR(50) NULL DEFAULT NULL,
	`special` TINYINT(4) NULL DEFAULT NULL,
	`creatorID` INT(10) NULL DEFAULT NULL,
	PRIMARY KEY (`groupdefID`),
	UNIQUE INDEX `Schlüssel 2` (`type`)
);

REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `site`, `foot`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (1, 0, 0, 0, NULL, 0, 0, 'privacypolicy', 'Privacy Policy', 'This is the privacy policy', 'privacy policy', '', 'Privacy Policy', '<p>Please enter your privacy policy here.</p>', '', '', NULL, NULL, NULL, NULL, '2021-07-30 11:43:33', 1);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `site`, `foot`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (2, 0, 0, 0, NULL, 0, 0, 'termsofuse', 'Terms of Use', 'This are our terms of use.', 'terms of use', '', 'Terms of Use', '<p>Please enter the terms of use here.</p>', '', '', NULL, NULL, NULL, NULL, '2024-03-18 17:36:13', 1);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `site`, `foot`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (3, 0, 0, 0, NULL, 0, 0, 'legalnotice', 'Imprint', 'This is our legal notice.', 'terms of use', '', 'Terms of Use', '<p>Please enter the legal notice here.</p>', '', '', NULL, NULL, NULL, NULL, '2024-03-18 17:36:13', 1);

REPLACE INTO `k8login` (`userID`, `clientID`, `username`, `email`, `password`, `title`, `firstname`, `lastname`, `street`, `country`, `code`, `city`, `phone`, `mobile`, `categoryID`, `active`, `roleID`, `roles`, `settings`, `rightgroupIDdefault`, `datetimecreated`, `creatorID`) VALUES (1, 1, 'admin', 'xy@gmail.com', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2', '', 0, '2024-01-01 12:00:00', 4);
REPLACE INTO `k8login` (`userID`, `clientID`, `username`, `email`, `password`, `title`, `firstname`, `lastname`, `street`, `country`, `code`, `city`, `phone`, `mobile`, `categoryID`, `active`, `roleID`, `roles`, `settings`, `rightgroupIDdefault`, `datetimecreated`, `creatorID`) VALUES (2, 0, 'superuser', 'xx@gmail.com', 'superuser', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, '2', '', 0, '2024-01-01 12:00:00', 4);

REPLACE INTO `k8groups` (`groupID`, `clientID`, `parentID`, `sort`, `type`, `title`, `fontcolor`, `backgroundcolor`, `value`, `creatorID`) VALUES (1, 0, 0, 0, 'page_group', 'System', '', '', '', 2);
REPLACE INTO `k8groups` (`groupID`, `clientID`, `parentID`, `sort`, `type`, `title`, `fontcolor`, `backgroundcolor`, `value`, `creatorID`) VALUES (2, 0, 0, 0, 'page_group', 'Services', '', '', '', 2);
REPLACE INTO `k8groups` (`groupID`, `clientID`, `parentID`, `sort`, `type`, `title`, `fontcolor`, `backgroundcolor`, `value`, `creatorID`) VALUES (3, 0, 0, 0, 'page_group', 'Others', '', '', '', 2);
REPLACE INTO `k8groups` (`groupID`, `clientID`, `parentID`, `sort`, `type`, `title`, `fontcolor`, `backgroundcolor`, `value`, `creatorID`) VALUES (4, 0, 0, 0, 'page_group', 'Examples', '', '', '', 2);

REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (1, 0, 0, 0, 1, 'container py-4', 3, 0, 'privacypolicy', 'Privacy Policy', 'This is the privacy policy', 'Privacy policy', '', 'Privacy Policy', '<p>Please enter your privacy policy here.</p>', '', '', '', '', NULL, NULL, NULL, NULL, '2021-07-30 11:43:33', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (2, 0, 0, 0, 1, 'container py-4', 4, 0, 'termsofuse', 'Terms of Use', 'This are our terms of use.', 'Terms of use', '', 'Terms of Use', '<p>Please enter the terms of use here.</p>', 'This are our terms of use.', '', '', '', NULL, NULL, NULL, NULL, '2024-03-18 17:36:13', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (3, 0, 0, 0, 1, 'container py-4', 2, 0, 'legalnotice', 'Imprint', 'This is our legal notice.', 'Legal notice, Impring', '', 'Terms of Use', '<p>Please enter the legal notice here.</p>', 'This is our legal notice.', '', '', '', NULL, NULL, NULL, NULL, '2024-03-18 17:36:13', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (4, 0, 0, 0, 1, '', 1, 0, 'home', 'Home', 'This page is made by K8 Web Kit', 'K8 Web Kit', '', NULL, '<div class="container block1 py-2 py-md-5" data-aos="fade-up">\r\n<div class="row align-items-center">\r\n<div class="col-md-5 pb-2" data-aos="zoom-in" data-aos-delay="300"><img class="img-fluid d-block py-3" src="img/webkitb5.jpg" /></div>\r\n<div class="col-md-7">\r\n<h1>K8 Web Kit with bootstrap 5</h1>\r\n<div>\r\n<p>this is the record: k8pages.marking=\'home\'.<br />Logged in with \'superuser\'?</p>\r\n<p>To change this entry, just edit the record.</p>\r\n</div>\r\n<h2>Documentation</h2>\r\n<p>Please check out the documentation for <a href="https://tom24.info/webkitb5/" target="blank">K8 Webkit with Bootstrap 5</a>.</p>\r\n</div>\r\n</div>\r\n</div>\r\n<div class="block2">\r\n<div class="container-fluid py-2 py-md-5 bg-light" data-aos="fade-up">\r\n<div class="row align-items-center">\r\n<div class="col-md-6 generate-content">\r\n<h2>Creating your Web App</h2>\r\n<p>This is the K8 Web Kit prototype with bootstrap 5:</p>\r\n<ul>\r\n<li>register your test usernames</li>\r\n<li>create the tables</li>\r\n<li>generate the datadefinitions</li>\r\n<li>choose your elements and put it on the page</li>\r\n<li>write your menu</li>\r\n<li>design the page</li>\r\n</ul>\r\n<ul>\r\n<li><a href="get_datadefinition.php">Generate data definition</a></li>\r\n</ul>\r\n</div>\r\n<div class="col-md-6 pb-2" data-aos="zoom-in" data-aos-delay="300"><img class="img-fluid d-block py-3" src="https://k8webkit.com/zpages/website/k8pages_datadefinition.jpg" /></div>\r\n</div>\r\n</div>\r\n</div>\r\n<div class="block3">block3</div>', '', '{\r\n    "elements": [\r\n      {\r\n        "selector":".block3",\r\n        "datadefID":"k8pagesaos",\r\n        "page":"catext",\r\n        "datadefinition":{\r\n          "masterdata":{\r\n            "clause":"groupID=4 and pageID>=0"\r\n          }\r\n        }\r\n      }\r\n    ]\r\n  }', '', '', NULL, NULL, NULL, NULL, '2024-06-03 10:52:19', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (5, 0, 0, 0, 2, 'container py-4', 10, 0, 'service1', 'Service 1', 'This is our main Service.', 'Main service', '', 'Service 1', 'This is our main Service.', 'This is our main Service.', '', '', '', NULL, NULL, NULL, NULL, '2024-06-03 10:56:43', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (6, 0, 0, 0, 2, 'container py-4', 11, 0, 'service2', 'Service 2', 'This is our second service.', 'Second Service', '', 'Service 2', 'This is our second service.', 'This is our second service.', '', '', '', NULL, NULL, NULL, NULL, '2024-06-03 10:59:49', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (7, 0, 0, 0, 4, 'container', 101, 0, 'pre_catalog', 'Customer Catalog', 'Catalogs are essential for the internet. K8 Web Kit provides edit and upload functions. Add the fields in the HTML template, configure the pagination and it works.', 'catalog, template, image upload, edit form ', '', NULL, '', '', '', '', '{\r\n"image_external":"k8pages_50.jpg"\r\n}', 1, NULL, NULL, NULL, '2024-01-05 23:23:32', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (8, 0, 0, 0, 4, 'container', 102, 0, 'pre_masterdata', 'Master data', 'It\'s so easy to generate a master data form out of my SQL table: customer. With K8 Form and tabulator I configure the columns and the form is good looking', 'SQL table, master data form, Stammdaten, bootstrap form, tabulator list', '', NULL, '', '', '', '', '{\r\n"image_external":"k8pages_53.jpg"\r\n}', 1, NULL, NULL, NULL, '2024-01-07 20:52:18', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (9, 0, 0, 0, 4, 'container', 100, 0, 'pre_form', 'Bootstrap form builder', 'Generate a form out of your sql table with the integrated bootstrap 5 form builder. Thanks to the master data plugin all fields are automatically stored in the MySQL table.', 'bootstrap 5 form builder, bootstrap 5 form, bootstrap form builder, bootstrap form, generate form, registration form', '', NULL, '', '', '', '', '{\r\n"image_external":"k8pages_56.jpg"\r\n}', 1, NULL, NULL, NULL, '2024-01-08 00:10:12', 2);
REPLACE INTO `k8pages` (`pageID`, `titleID`, `clientID`, `parentID`, `groupID`, `classmain`, `sort`, `language`, `marking`, `headtitle`, `headdescription`, `headkeywords`, `head`, `h1`, `content`, `preview`, `site`, `foot`, `settings`, `active`, `pageIDprevious`, `pageIDnext`, `datetimechanged`, `datetimecreated`, `creatorID`) VALUES (10, 0, 0, 0, 1, 'container', 10, 0, 'membership', 'Membership', 'This is the member page. It\'s called after the login.', 'member', '', NULL, '<div id="html2">#html2</div>\r\n<div id="html3">#html3</div>\r\n<div id="html4">#html4</div>', '', '{\r\n    "autoappend":false,\r\n    "elements":[\r\n      {\r\n        "datadefID": "k8login",\r\n        "selector":"#html2",\r\n        "alias":true,\r\n        "page": "element",\r\n        "datadefinition":{\r\n          "masterdata":{\r\n            "edittype":0,\r\n            "clause":"userID=§userID"\r\n          }\r\n         }\r\n      },\r\n      {\r\n        "datadefID": "k8components",\r\n        "selector":"#html3",\r\n        "page": "list",\r\n        "datadefinition":{\r\n              "name":"My items",\r\n              "masterdata":{\r\n                    "htag":"h2",\r\n                    "edittype":4,\r\n                    "clause":"creatorID=§userID",\r\n                    "tabulatorfilter2url":false\r\n              }\r\n         }\r\n      },\r\n      {\r\n        "datadefID": "k8pages",\r\n        "selector":"#html4",\r\n        "page": "list",\r\n        "datadefinition":{\r\n              "name":"My pages",\r\n              "masterdata":{\r\n                    "htag":"h2",\r\n                    "clause":"creatorID=§userID",\r\n                    "tabulatorfilter2url":false\r\n              }\r\n         }\r\n      }\r\n    ]\r\n}', '', '', NULL, NULL, NULL, NULL, '2024-06-13 15:08:34', 2);

REPLACE INTO `k8references` (`clientID`, `ID`, `basetype`, `baseID`, `marking`, `type`, `title`, `description`, `descriptionlarge`, `path`, `filename`, `filetype`, `height`, `width`, `duration`, `creatorID`, `datecreated`, `ready`, `checked`, `sort`, `points`, `language`, `childID`, `latitude`, `longitude`, `copyright`, `mydatetime`, `addressline`) VALUES (0, 1, 'k8login', 2, NULL, 'image', NULL, NULL, NULL, 'uploads', 'k8login_1.jpg', 'jpg', 1280, 1280, 0, 2, '2024-06-22 19:53:58', 0, 0, 10, NULL, 0, 0, 0, 0, NULL, NULL, NULL);

REPLACE INTO `k8components` (`componentID`, `clientID`, `componentnumber`, `status`, `text1`, `text2`, `textdimensions`, `descriptionlong`, `category`, `baseunit`, `salesunit`, `vatclass`, `conversionfactorsales`, `servicefactor`, `price`, `creatorID`, `datecreated`) VALUES (1, 0, '123456', 0, 'Test page', '', '', '', '', NULL, NULL, NULL, 0, NULL, 111, 2, '2024-06-13 12:57:04');