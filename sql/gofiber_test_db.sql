-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2025 at 12:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gofiber_test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext DEFAULT NULL,
  `stock` bigint(20) DEFAULT NULL,
  `price` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `stock`, `price`) VALUES
(1, '2025-12-23 15:00:54.997', '2025-12-24 12:12:50.730', '2025-12-24 13:48:38.395', 'Laptop', 0, 15000000),
(2, '2025-12-24 12:29:45.362', '2025-12-24 15:42:15.290', NULL, 'Komputer', 31, 12000000),
(3, '2025-12-24 13:45:40.532', '2025-12-24 15:42:15.291', NULL, 'Kursi', 9, 380000),
(4, '2025-12-24 13:50:31.629', '2025-12-24 15:42:15.292', NULL, 'Laptop', 83, 8500000);

-- --------------------------------------------------------

--
-- Table structure for table `purchasings`
--

CREATE TABLE `purchasings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `grand_total` double NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchasings`
--

INSERT INTO `purchasings` (`id`, `created_at`, `updated_at`, `deleted_at`, `date`, `grand_total`, `user_id`, `supplier_id`) VALUES
(1, '2025-12-23 18:20:42.292', '2025-12-23 18:20:42.292', NULL, '2025-12-23 18:20:42.292', 15000000, 4, 1),
(2, '2025-12-23 18:21:06.018', '2025-12-23 18:21:06.018', NULL, '2025-12-23 18:21:06.018', 60000000, 4, 1),
(3, '2025-12-23 18:35:02.732', '2025-12-23 18:35:02.732', NULL, '2025-12-23 18:35:02.731', 30000000, 4, 1),
(4, '2025-12-23 18:47:38.817', '2025-12-23 18:47:38.817', NULL, '2025-12-23 18:47:38.816', 15000000, 4, 1),
(5, '2025-12-23 19:19:09.045', '2025-12-23 19:19:09.045', NULL, '2025-12-23 19:19:09.045', 15000000, 4, 1),
(6, '2025-12-24 12:12:50.736', '2025-12-24 12:12:50.736', NULL, '2025-12-24 12:12:50.736', 15000000, 3, 1),
(7, '2025-12-24 13:10:34.676', '2025-12-24 13:10:34.676', NULL, '2025-12-24 13:10:34.676', 25000000, 3, 1),
(8, '2025-12-24 13:40:03.531', '2025-12-24 13:40:03.531', NULL, '2025-12-24 13:40:03.530', 37500000, 3, 2),
(9, '2025-12-24 13:45:59.570', '2025-12-24 13:45:59.570', NULL, '2025-12-24 13:45:59.569', 1500000, 3, 2),
(10, '2025-12-24 14:05:58.769', '2025-12-24 14:05:58.769', NULL, '2025-12-24 14:05:58.768', 24000000, 3, 2),
(11, '2025-12-24 14:24:53.163', '2025-12-24 14:24:53.163', NULL, '2025-12-24 14:24:53.163', 29375000, 3, 1),
(12, '2025-12-24 15:10:07.316', '2025-12-24 15:10:07.316', NULL, '2025-12-24 15:10:07.315', 53760000, 3, 3),
(13, '2025-12-24 15:15:30.446', '2025-12-24 15:15:30.446', NULL, '2025-12-24 15:15:30.446', 42140000, 3, 2),
(14, '2025-12-24 15:42:15.292', '2025-12-24 15:42:15.292', NULL, '2025-12-24 15:42:15.291', 20880000, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `purchasing_details`
--

CREATE TABLE `purchasing_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `qty` bigint(20) NOT NULL,
  `sub_total` double NOT NULL,
  `purchasing_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchasing_details`
--

INSERT INTO `purchasing_details` (`id`, `created_at`, `updated_at`, `deleted_at`, `qty`, `sub_total`, `purchasing_id`, `item_id`) VALUES
(1, '2025-12-23 18:20:42.293', '2025-12-23 18:20:42.293', NULL, 1, 15000000, 1, 1),
(2, '2025-12-23 18:21:06.018', '2025-12-23 18:21:06.018', NULL, 4, 60000000, 2, 1),
(3, '2025-12-23 18:35:02.734', '2025-12-23 18:35:02.734', NULL, 2, 30000000, 3, 1),
(4, '2025-12-23 18:47:38.817', '2025-12-23 18:47:38.817', NULL, 1, 15000000, 4, 1),
(5, '2025-12-23 19:19:09.045', '2025-12-23 19:19:09.045', NULL, 1, 15000000, 5, 1),
(6, '2025-12-24 12:12:50.738', '2025-12-24 12:12:50.738', NULL, 1, 15000000, 6, 1),
(7, '2025-12-24 13:10:34.676', '2025-12-24 13:10:34.676', NULL, 2, 25000000, 7, 2),
(8, '2025-12-24 13:40:03.531', '2025-12-24 13:40:03.531', NULL, 3, 37500000, 8, 2),
(9, '2025-12-24 13:45:59.570', '2025-12-24 13:45:59.570', NULL, 4, 1500000, 9, 3),
(10, '2025-12-24 14:05:58.769', '2025-12-24 14:05:58.769', NULL, 2, 24000000, 10, 2),
(11, '2025-12-24 14:24:53.164', '2025-12-24 14:24:53.164', NULL, 1, 12000000, 11, 2),
(12, '2025-12-24 14:24:53.164', '2025-12-24 14:24:53.164', NULL, 1, 375000, 11, 3),
(13, '2025-12-24 14:24:53.164', '2025-12-24 14:24:53.164', NULL, 2, 17000000, 11, 4),
(14, '2025-12-24 15:10:07.316', '2025-12-24 15:10:07.316', NULL, 3, 36000000, 12, 2),
(15, '2025-12-24 15:10:07.320', '2025-12-24 15:10:07.320', NULL, 2, 760000, 12, 3),
(16, '2025-12-24 15:10:07.321', '2025-12-24 15:10:07.321', NULL, 2, 17000000, 12, 4),
(17, '2025-12-24 15:15:30.447', '2025-12-24 15:15:30.447', NULL, 2, 24000000, 13, 2),
(18, '2025-12-24 15:15:30.447', '2025-12-24 15:15:30.447', NULL, 2, 17000000, 13, 4),
(19, '2025-12-24 15:15:30.447', '2025-12-24 15:15:30.447', NULL, 3, 1140000, 13, 3),
(20, '2025-12-24 15:42:15.293', '2025-12-24 15:42:15.293', NULL, 1, 12000000, 14, 2),
(21, '2025-12-24 15:42:15.293', '2025-12-24 15:42:15.293', NULL, 1, 380000, 14, 3),
(22, '2025-12-24 15:42:15.293', '2025-12-24 15:42:15.293', NULL, 1, 8500000, 14, 4);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` longtext DEFAULT NULL,
  `email` longtext DEFAULT NULL,
  `address` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `email`, `address`) VALUES
(1, '2025-12-23 15:03:24.853', '2025-12-24 14:10:26.509', NULL, 'PT. Technology First', 'technologyfirst@gmail.com', 'Bogor, Jawa Barat'),
(2, '2025-12-24 13:39:43.967', '2025-12-24 14:50:17.718', NULL, 'PT. Technology Second', 'technologysecond@gmail.com', 'DKI Jakarta, Indonesia'),
(3, '2025-12-24 14:49:33.212', '2025-12-24 14:49:33.212', NULL, 'PT. Technology Third', 'technologythird@gmail.com', 'Serang, Banten'),
(4, '2025-12-24 15:42:44.237', '2025-12-24 15:43:07.921', NULL, 'PT. Technology Fourth', 'technologyfourth@gmail.com', 'Malang, Jawa Timur');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `username` varchar(191) DEFAULT NULL,
  `password` longtext DEFAULT NULL,
  `role` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `username`, `password`, `role`) VALUES
(1, '2025-12-24 16:27:22.316', '2025-12-24 16:27:22.316', NULL, 'carlos', '$2a$10$d.Tg..T.xoXPNYUxlly5bek85YZvtrDgMji3t4c/u6llPLXL2Xa9C', 'admin'),
(2, '2025-12-24 16:27:40.687', '2025-12-24 16:27:40.687', NULL, 'gerardi', '$2a$10$w0waEA6faEK4c7vDQPZKSuwaOAXKK0lF7.TRceGo4bRYz5swUO2zK', 'staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_items_deleted_at` (`deleted_at`);

--
-- Indexes for table `purchasings`
--
ALTER TABLE `purchasings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_purchasings_deleted_at` (`deleted_at`),
  ADD KEY `fk_suppliers_purchasings` (`supplier_id`),
  ADD KEY `fk_users_purchasings` (`user_id`);

--
-- Indexes for table `purchasing_details`
--
ALTER TABLE `purchasing_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_purchasing_details_deleted_at` (`deleted_at`),
  ADD KEY `fk_items_purchasing_details` (`item_id`),
  ADD KEY `fk_purchasings_purchasing_details` (`purchasing_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_suppliers_deleted_at` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_users_username` (`username`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchasings`
--
ALTER TABLE `purchasings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchasing_details`
--
ALTER TABLE `purchasing_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `purchasings`
--
ALTER TABLE `purchasings`
  ADD CONSTRAINT `fk_suppliers_purchasings` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `fk_users_purchasings` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `purchasing_details`
--
ALTER TABLE `purchasing_details`
  ADD CONSTRAINT `fk_items_purchasing_details` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `fk_purchasings_purchasing_details` FOREIGN KEY (`purchasing_id`) REFERENCES `purchasings` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
