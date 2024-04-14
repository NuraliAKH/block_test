-- CreateTable
CREATE TABLE "TestBlockToScience" (
    "id" SERIAL NOT NULL,
    "testBlockId" INTEGER NOT NULL,
    "scienceId" INTEGER NOT NULL,

    CONSTRAINT "TestBlockToScience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestBlockToScience_testBlockId_scienceId_key" ON "TestBlockToScience"("testBlockId", "scienceId");

-- AddForeignKey
ALTER TABLE "TestBlockToScience" ADD CONSTRAINT "TestBlockToScience_testBlockId_fkey" FOREIGN KEY ("testBlockId") REFERENCES "TestBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestBlockToScience" ADD CONSTRAINT "TestBlockToScience_scienceId_fkey" FOREIGN KEY ("scienceId") REFERENCES "Science"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
