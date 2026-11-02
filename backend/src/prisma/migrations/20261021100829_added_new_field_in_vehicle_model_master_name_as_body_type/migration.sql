/*
  Warnings:

  - Added the required column `bodyType` to the `VehicleModelMaster` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CarBodyType" AS ENUM ('HATCHBACK', 'MICRO_HATCHBACK', 'PREMIUM_HATCHBACK', 'MICROCAR', 'SEDAN', 'COMPACT_SEDAN', 'NOTCHBACK', 'FASTBACK', 'LIFTBACK', 'SUV', 'SUBCOMPACT_SUV', 'COMPACT_SUV', 'MID_SIZE_SUV', 'FULL_SIZE_SUV', 'CROSSOVER', 'COUPE_SUV', 'OFF_ROAD_SUV', 'LUXURY_SUV', 'MPV', 'MINIVAN', 'MICROVAN', 'PASSENGER_VAN', 'COUPE', 'CONVERTIBLE', 'ROADSTER', 'SPYDER', 'TARGA', 'STATION_WAGON', 'ESTATE', 'PICKUP_TRUCK', 'SPORTS_CAR', 'SUPERCAR', 'HYPERCAR', 'LIMOUSINE', 'OTHER');

-- AlterTable
ALTER TABLE "VehicleModelMaster" ADD COLUMN     "bodyType" "CarBodyType" NOT NULL;
