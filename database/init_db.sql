-- Adminer 4.8.1 MySQL 5.7.35 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

CREATE DATABASE `chat_app` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_czech_ci */;
USE `chat_app`;

CREATE TABLE `friendrequests` (
  `request_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_user` int(11) unsigned NOT NULL,
  `to_user` int(11) unsigned NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `from_user` (`from_user`),
  KEY `to_user` (`to_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;


CREATE TABLE `friendships` (
  `friendship_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_user_id` int(11) unsigned NOT NULL,
  `second_user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`friendship_id`),
  KEY `first_user_id` (`first_user_id`),
  KEY `second_user_id` (`second_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;


CREATE TABLE `replies` (
  `reply_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `friendship_id` int(11) unsigned NOT NULL,
  `sender_id` int(11) unsigned NOT NULL,
  `text` text COLLATE utf8_czech_ci NOT NULL,
  `date` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reply_id`),
  KEY `friendship_id` (`friendship_id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;


CREATE TABLE `sessions` (
  `session_id` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;


CREATE TABLE `users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `salt` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;
