import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Idempotent seed — safe to run on every deploy.
 * Every record is upserted on a unique key, so re-running does not duplicate.
 */
async function main() {
  console.log("🌱 Seeding database...");

  // ─── Vessels ──────────────────────────────────────────────────────────────
  const vesselData = [
    { name: "MSC Aurora", imo: "9839430", flagState: "PA", vesselType: "CONTAINER" as const, teuCapacity: 23000 },
    { name: "Ever Given", imo: "9811000", flagState: "PA", vesselType: "CONTAINER" as const, teuCapacity: 20124 },
    { name: "CMA Titan", imo: "9776171", flagState: "FR", vesselType: "CONTAINER" as const, teuCapacity: 20776 },
    { name: "COSCO Pacific", imo: "9795611", flagState: "HK", vesselType: "CONTAINER" as const, teuCapacity: 19273 },
    { name: "ONE Harmony", imo: "9967141", flagState: "SG", vesselType: "CONTAINER" as const, teuCapacity: 24136 },
    { name: "Baltic Feeder", imo: "9312345", flagState: "DE", vesselType: "FEEDER" as const, teuCapacity: 1200 },
  ];
  const vessels: Record<string, string> = {};
  for (const v of vesselData) {
    const rec = await prisma.vessel.upsert({
      where: { imo: v.imo },
      update: { name: v.name, flagState: v.flagState, vesselType: v.vesselType, teuCapacity: v.teuCapacity },
      create: v,
    });
    vessels[v.name] = rec.id;
  }
  console.log(`   ✓ ${vesselData.length} vessels`);

  // ─── Customers ────────────────────────────────────────────────────────────
  const customerData = [
    { name: "Maersk Line", code: "MAEU", country: "DK", tier: "PREMIUM" as const },
    { name: "Hapag-Lloyd", code: "HLCU", country: "DE", tier: "PREMIUM" as const },
    { name: "CMA CGM", code: "CMDU", country: "FR", tier: "PREMIUM" as const },
    { name: "COSCO", code: "COSU", country: "CN", tier: "STANDARD" as const },
    { name: "ONE Line", code: "ONEY", country: "JP", tier: "STANDARD" as const },
  ];
  const customers: Record<string, string> = {};
  for (const c of customerData) {
    const rec = await prisma.customer.upsert({
      where: { code: c.code },
      update: { name: c.name, country: c.country, tier: c.tier },
      create: c,
    });
    customers[c.name] = rec.id;
  }
  console.log(`   ✓ ${customerData.length} customers`);

  // ─── Services ─────────────────────────────────────────────────────────────
  const serviceData = [
    { code: "AE7", name: "Asia-Europe 7", tradeLane: "Asia-Europe", portRotation: ["DEHAM", "NLRTM", "CNSHA", "SGSIN"] },
    { code: "TP1", name: "Transpacific 1", tradeLane: "Transpacific", portRotation: ["DEHAM", "USNYC", "JPYOK"] },
  ];
  const services: Record<string, string> = {};
  for (const s of serviceData) {
    const rec = await prisma.service.upsert({
      where: { code: s.code },
      update: { name: s.name, tradeLane: s.tradeLane, portRotation: s.portRotation },
      create: s,
    });
    services[s.code] = rec.id;
  }
  console.log(`   ✓ ${serviceData.length} services`);

  // ─── Voyages ──────────────────────────────────────────────────────────────
  const now = Date.now();
  const day = 86_400_000;
  const voyageData = [
    { voyageNo: "AE7-2601W", service: "AE7", vessel: "MSC Aurora",    etdOffset: 3,  etaOffset: 28, ports: ["DEHAM", "NLRTM", "CNSHA"] },
    { voyageNo: "AE7-2602W", service: "AE7", vessel: "Ever Given",    etdOffset: 7,  etaOffset: 33, ports: ["NLRTM", "SGSIN"] },
    { voyageNo: "AE7-2603W", service: "AE7", vessel: "CMA Titan",     etdOffset: 10, etaOffset: 37, ports: ["BEANR", "AEJEA"] },
    { voyageNo: "TP1-2601E", service: "TP1", vessel: "COSCO Pacific", etdOffset: 5,  etaOffset: 22, ports: ["DEHAM", "USNYC"] },
    { voyageNo: "TP1-2602E", service: "TP1", vessel: "ONE Harmony",   etdOffset: 12, etaOffset: 30, ports: ["GBFXT", "JPYOK"] },
  ];
  const voyages: Record<string, string> = {};
  for (const vy of voyageData) {
    const rec = await prisma.voyage.upsert({
      where: { voyageNo: vy.voyageNo },
      update: {
        serviceId: services[vy.service],
        vesselId: vessels[vy.vessel],
        etd: new Date(now + vy.etdOffset * day),
        eta: new Date(now + vy.etaOffset * day),
        portCalls: vy.ports,
      },
      create: {
        voyageNo: vy.voyageNo,
        serviceId: services[vy.service],
        vesselId: vessels[vy.vessel],
        etd: new Date(now + vy.etdOffset * day),
        eta: new Date(now + vy.etaOffset * day),
        portCalls: vy.ports,
      },
    });
    voyages[vy.voyageNo] = rec.id;
  }
  console.log(`   ✓ ${voyageData.length} voyages`);

  // ─── Bookings ─────────────────────────────────────────────────────────────
  const bookingData = [
    { bookingRef: "BKG-001", customer: "Maersk Line", voyage: "AE7-2601W", pol: "DEHAM", pod: "CNSHA", teu: 150, status: "CONFIRMED" as const,   cargoDesc: "General cargo" },
    { bookingRef: "BKG-002", customer: "Hapag-Lloyd", voyage: "AE7-2602W", pol: "NLRTM", pod: "SGSIN", teu: 80,  status: "PENDING" as const,     cargoDesc: "Electronics" },
    { bookingRef: "BKG-003", customer: "CMA CGM",     voyage: "AE7-2603W", pol: "BEANR", pod: "AEJEA", teu: 45,  status: "ROLLED_OVER" as const, cargoDesc: "Machinery" },
    { bookingRef: "BKG-004", customer: "COSCO",       voyage: "TP1-2601E", pol: "DEHAM", pod: "USNYC", teu: 200, status: "CONFIRMED" as const,   cargoDesc: "Automotive parts" },
    { bookingRef: "BKG-005", customer: "ONE Line",    voyage: "TP1-2602E", pol: "GBFXT", pod: "JPYOK", teu: 60,  status: "CANCELLED" as const,   cargoDesc: "Textiles" },
  ];
  for (const b of bookingData) {
    await prisma.booking.upsert({
      where: { bookingRef: b.bookingRef },
      update: {
        customerId: customers[b.customer],
        voyageId: voyages[b.voyage],
        pol: b.pol, pod: b.pod, teu: b.teu, status: b.status, cargoDesc: b.cargoDesc,
      },
      create: {
        bookingRef: b.bookingRef,
        customerId: customers[b.customer],
        voyageId: voyages[b.voyage],
        pol: b.pol, pod: b.pod, teu: b.teu, status: b.status, cargoDesc: b.cargoDesc,
      },
    });
  }
  console.log(`   ✓ ${bookingData.length} bookings`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
