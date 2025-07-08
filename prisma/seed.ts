// prisma/seed.ts

import { PrismaClient, ComponentType } from "@prisma/client";

// Initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clean up existing data to ensure a fresh start
  console.log("Deleting existing components...");
  await prisma.component.deleteMany({});
  console.log("Existing components deleted.");

  // 2. Seed CPUs
  console.log("Seeding CPUs...");
  await prisma.component.createMany({
    data: [
      {
        name: "Intel Core i9-14900K",
        type: ComponentType.CPU,
        price: 549.99,
        specs: { cores: 24, threads: 32, socket: "LGA1700" },
      },
      {
        name: "Intel Core i7-14700K",
        type: ComponentType.CPU,
        price: 389.99,
        specs: { cores: 20, threads: 28, socket: "LGA1700" },
      },
      {
        name: "AMD Ryzen 9 7950X3D",
        type: ComponentType.CPU,
        price: 599.99,
        specs: { cores: 16, threads: 32, socket: "AM5" },
      },
      {
        name: "AMD Ryzen 7 7800X3D",
        type: ComponentType.CPU,
        price: 359.99,
        specs: { cores: 8, threads: 16, socket: "AM5" },
      },
    ],
  });

  // 3. Seed GPUs
  console.log("Seeding GPUs...");
  await prisma.component.createMany({
    data: [
      {
        name: "NVIDIA GeForce RTX 4090",
        type: ComponentType.GPU,
        price: 1799.99,
        specs: { vram: "24GB GDDR6X", length: "304mm" },
      },
      {
        name: "NVIDIA GeForce RTX 4080 Super",
        type: ComponentType.GPU,
        price: 999.99,
        specs: { vram: "16GB GDDR6X", length: "304mm" },
      },
      {
        name: "AMD Radeon RX 7900 XTX",
        type: ComponentType.GPU,
        price: 929.99,
        specs: { vram: "24GB GDDR6", length: "287mm" },
      },
      {
        name: "AMD Radeon RX 7800 XT",
        type: ComponentType.GPU,
        price: 499.99,
        specs: { vram: "16GB GDDR6", length: "267mm" },
      },
    ],
  });

  // 4. Seed Motherboards
  console.log("Seeding Motherboards...");
  await prisma.component.createMany({
    data: [
      {
        name: "ASUS ROG Strix Z790-E",
        type: ComponentType.MOTHERBOARD,
        price: 479.99,
        specs: { socket: "LGA1700", form_factor: "ATX" },
      },
      {
        name: "Gigabyte B650 AORUS ELITE",
        type: ComponentType.MOTHERBOARD,
        price: 219.99,
        specs: { socket: "AM5", form_factor: "ATX" },
      },
      {
        name: "MSI MAG B650 Tomahawk",
        type: ComponentType.MOTHERBOARD,
        price: 199.99,
        specs: { socket: "AM5", form_factor: "ATX" },
      },
    ],
  });

  // 5. Seed RAM
  console.log("Seeding RAM...");
  await prisma.component.createMany({
    data: [
      {
        name: "Corsair Vengeance 32GB (2x16GB) DDR5 6000",
        type: ComponentType.RAM,
        price: 114.99,
        specs: { type: "DDR5", speed: 6000, size: "32GB" },
      },
      {
        name: "G.Skill Trident Z5 32GB (2x16GB) DDR5 6400",
        type: ComponentType.RAM,
        price: 124.99,
        specs: { type: "DDR5", speed: 6400, size: "32GB" },
      },
    ],
  });

  // 6. Seed Storage
  console.log("Seeding Storage...");
  await prisma.component.createMany({
    data: [
      {
        name: "Samsung 990 Pro 2TB NVMe",
        type: ComponentType.STORAGE,
        price: 169.99,
        specs: { type: "NVMe M.2", capacity: "2TB" },
      },
      {
        name: "Crucial P5 Plus 1TB NVMe",
        type: ComponentType.STORAGE,
        price: 89.99,
        specs: { type: "NVMe M.2", capacity: "1TB" },
      },
      {
        name: "Samsung 870 Evo 4TB SATA SSD",
        type: ComponentType.STORAGE,
        price: 249.99,
        specs: { type: '2.5" SSD', capacity: "4TB" },
      },
    ],
  });

  // 7. Seed PSUs
  console.log("Seeding PSUs...");
  await prisma.component.createMany({
    data: [
      {
        name: "Corsair RM1000e 1000W 80+ Gold",
        type: ComponentType.PSU,
        price: 179.99,
        specs: { wattage: 1000, rating: "80+ Gold" },
      },
      {
        name: "SeaSonic FOCUS Plus Gold 850W",
        type: ComponentType.PSU,
        price: 149.99,
        specs: { wattage: 850, rating: "80+ Gold" },
      },
    ],
  });

  // 8. Seed Cases
  console.log("Seeding Cases...");
  await prisma.component.createMany({
    data: [
      {
        name: "Lian Li O11 Dynamic EVO",
        type: ComponentType.CASE,
        price: 169.99,
        specs: { type: "Mid Tower", form_factor: "ATX" },
      },
      {
        name: "Fractal Design North",
        type: ComponentType.CASE,
        price: 139.99,
        specs: { type: "Mid Tower", form_factor: "ATX" },
      },
      {
        name: "Cooler Master NR200P",
        type: ComponentType.CASE,
        price: 109.99,
        specs: { type: "Mini ITX", form_factor: "ITX" },
      },
    ],
  });

  console.log("Seeding finished.");
}

// Execute the main function and handle potential errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });
