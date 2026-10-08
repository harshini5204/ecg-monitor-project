const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const patients = [
  {
    patientId: "PAT-1001",
    name: "Aarav Sharma",
    age: 42,
    gender: "MALE",
    dateOfBirth: new Date("1984-03-12T00:00:00.000Z"),
    deviceId: "ECG-ROOM-101",
    roomNumber: "101",
    status: "ACTIVE",
  },
  {
    patientId: "PAT-1002",
    name: "Meera Patel",
    age: 57,
    gender: "FEMALE",
    dateOfBirth: new Date("1969-08-24T00:00:00.000Z"),
    deviceId: "ECG-ROOM-102",
    roomNumber: "102",
    status: "ACTIVE",
  },
  {
    patientId: "PAT-1003",
    name: "Daniel Wilson",
    age: 36,
    gender: "MALE",
    dateOfBirth: new Date("1990-01-18T00:00:00.000Z"),
    deviceId: "ECG-ROOM-201",
    roomNumber: "201",
    status: "ACTIVE",
  },
  {
    patientId: "PAT-1004",
    name: "Sofia Garcia",
    age: 68,
    gender: "FEMALE",
    dateOfBirth: new Date("1958-11-05T00:00:00.000Z"),
    deviceId: "ECG-ROOM-202",
    roomNumber: "202",
    status: "ACTIVE",
  },
];

async function main() {
  for (const patient of patients) {
    await prisma.patient.create({ data: patient });
  }

  console.log(`Seeded ${patients.length} sample patients.`);
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
