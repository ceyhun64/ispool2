-- CreateTable
CREATE TABLE "showcase_image" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showcase_image_pkey" PRIMARY KEY ("id")
);
