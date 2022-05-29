-- CreateTable
CREATE TABLE "Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isOutside" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "organizerId" INTEGER NOT NULL,
    CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("organizer_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organizer" (
    "organizer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_organizerId_key" ON "Event"("organizerId");
