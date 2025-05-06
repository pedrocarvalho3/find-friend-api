/*
  Warnings:

  - The values [ONE,TWO,THREE,FOUR,FIVE] on the enum `EnergyLevel` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `dependency_level` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `age` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PetAge" AS ENUM ('PUPPY', 'ADULT', 'ELDERLY');

-- CreateEnum
CREATE TYPE "DependencyLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- AlterEnum
BEGIN;
CREATE TYPE "EnergyLevel_new" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');
ALTER TABLE "pets" ALTER COLUMN "energy_level" TYPE "EnergyLevel_new" USING ("energy_level"::text::"EnergyLevel_new");
ALTER TYPE "EnergyLevel" RENAME TO "EnergyLevel_old";
ALTER TYPE "EnergyLevel_new" RENAME TO "EnergyLevel";
DROP TYPE "EnergyLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "adoption_requirements" TEXT[],
ADD COLUMN     "dependency_level" "DependencyLevel" NOT NULL,
ADD COLUMN     "photos" TEXT[],
DROP COLUMN "age",
ADD COLUMN     "age" "PetAge" NOT NULL;
