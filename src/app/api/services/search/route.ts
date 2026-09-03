import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

const banglishMap: Record<string, string> = {
  // --- Electrical & Electronics ---
  electrician: 'ইলেকট্রিশিয়ান',
  mistry: 'মিস্ত্রী',
  mistri: 'মিস্ত্রী',
  biddut: 'ইলেকট্রিশিয়ান',
  carant: 'ইলেকট্রিশিয়ান',
  current: 'ইলেকট্রিশিয়ান',
  board: 'ইলেকট্রিশিয়ান',
  switch: 'ইলেকট্রিশিয়ান',
  light: 'ইলেকট্রিশিয়ান',
  batti: 'ইলেকট্রিশিয়ান',
  fan: 'ফ্যান',
  paka: 'ফ্যান',
  'ceiling fan': 'সিলিং ফ্যান',
  generator: 'জেনারেটর',
  solar: 'সোলার',
  batary: 'ব্যাটারি',
  battery: 'ব্যাটারি',
  ips: 'ইনভার্টার',
  inverter: 'ইনভার্টার',
  plc: 'পিএলসি',
  transformer: 'ট্রান্সফরমার',
  mitar: 'ইলেকট্রিশিয়ান',
  meter: 'ইলেকট্রিশিয়ান',
  'short circuit': 'ইলেকট্রিশিয়ান',

  // --- Mechanical & Automobile ---
  gari: 'গাড়ি',
  car: 'গাড়ি',
  bike: 'মোটরসাইকেল',
  motorcycle: 'মোটরসাইকেল',
  engine: 'ইঞ্জিন',
  ingine: 'ইঞ্জিন',
  welding: 'ওয়েল্ডিং',
  'gari thik': 'অটোমোবাইল',
  cnc: 'সিএনসি',
  lathe: 'লেদ মেশিন',
  hydraulic: 'হাইড্রোলিক',
  pump: 'পাম্প',
  pomp: 'পাম্প',
  chaka: 'গাড়ি',

  // --- IT, Computer & Network ---
  computer: 'কম্পিউটার',
  computar: 'কম্পিউটার',
  pc: 'কম্পিউটার',
  laptop: 'ল্যাপটপ',
  mobile: 'মোবাইল',
  phone: 'মোবাইল',
  fon: 'মোবাইল',
  internet: 'নেটওয়ার্ক',
  wifi: 'নেটওয়ার্ক',
  router: 'নেটওয়ার্ক',
  net: 'নেটওয়ার্ক',
  cctv: 'সিসিটিভি',
  camera: 'সিসিটিভি',
  printer: 'প্রিন্টার',
  print: 'প্রিন্টার',
  software: 'সফটওয়্যার',
  server: 'সার্ভার',
  security: 'সাইবার সিকিউরিটি',
  'it support': 'আইটি',

  // --- Construction & Civil ---
  plumber: 'প্লাম্বার',
  plamber: 'প্লাম্বার',
  paip: 'প্লাম্বার',
  pipe: 'প্লাম্বার',
  line: 'প্লাম্বার',
  leak: 'স্যানিটারি',
  'water line': 'প্লাম্বার',
  tap: 'প্লাম্বার',
  koll: 'প্লাম্বার',
  commode: 'স্যানিটারি',
  sanitary: 'স্যানিটারি',
  tiles: 'টাইলস',
  tailes: 'টাইলস',
  marbel: 'টাইলস',
  stone: 'টাইলস',
  painter: 'পেইন্টার',
  color: 'রং',
  rong: 'রং',
  'wall paint': 'পেইন্টার',
  mason: 'রাজমিস্ত্রি',
  rajmistri: 'রাজমিস্ত্রি',
  it: 'রাজমিস্ত্রি',
  gathuni: 'রাজমিস্ত্রি',
  carpenter: 'কাঠমিস্ত্রি',
  wood: 'কাঠমিস্ত্রি',
  kat: 'কাঠমিস্ত্রি',
  darja: 'কাঠমিস্ত্রি',
  janala: 'কাঠমিস্ত্রি',
  sofa: 'কাঠমিস্ত্রি',
  khat: 'কাঠমিস্ত্রি',
  furniture: 'কাঠমিস্ত্রি',
  steel: 'স্টিল',
  surveyor: 'সার্ভেয়ার',
  civil: 'সিভিল',

  // --- HVAC & Home Appliances ---
  ac: 'এসি',
  'air conditioner': 'এসি',
  'ac thanda': 'এসি',
  fridge: 'ফ্রিজ',
  friz: 'ফ্রিজ',
  refrigerator: 'রেফ্রিজারেশন',
  deep: 'ফ্রিজ',
  'washing machine': 'ওয়াশিং মেশিন',
  'kapor dhoa': 'ওয়াশিং মেশিন',
  tv: 'টিভি',
  television: 'টিভি',
  'led tv': 'টিভি',
  oven: 'হোম অ্যাপ্লায়েন্স',
  chula: 'হোম অ্যাপ্লায়েন্স',
  geyser: 'হোম অ্যাপ্লায়েন্স',
  'garm pani': 'হোম অ্যাপ্লায়েন্স',
  'water motor': 'পানির মোটর',

  // --- Medical & Laboratory ---
  lab: 'ল্যাব',
  laboratory: 'ল্যাব',
  blood: 'ল্যাব',
  test: 'ল্যাব',
  xray: 'এক্স-রে',
  'x-ray': 'এক্স-রে',
  dental: 'ডেন্টাল',
  dant: 'ডেন্টাল',
  teeth: 'ডেন্টাল',
  operation: 'অপারেশন থিয়েটার',
  ot: 'অপারেশন থিয়েটার',
  dialysis: 'ডায়ালাইসিস',
  usg: 'আল্ট্রাসনোগ্রাফি',
  ultrasound: 'আল্ট্রাসনোগ্রাফি',
  medical: 'মেডিকেল',

  // --- Telecom & Media ---
  telecom: 'টেলিকম',
  sim: 'টেলিকম',
  'network tower': 'টেলিকম',
  fiber: 'ফাইবার অপটিক',
  broadband: 'ব্রডব্যান্ড',
  sound: 'সাউন্ড',
  spikar: 'সাউন্ড',
  speaker: 'সাউন্ড',
  mic: 'সাউন্ড',
  video: 'ভিডিও',
  edit: 'ভিডিও এডিটর',

  // --- INDUSTRIAL & AUTOMATION ---
  lift: 'লিফট',
  escalator: 'এস্কেলেটর',
  drone: 'ড্রোন',
  robot: 'রোবোটিক্স',
  robotics: 'রোবোটিক্স',
  automation: 'অটোমেশন',
  'smart home': 'স্মার্ট হোম',
  garments: 'গার্মেন্টস',
  textile: 'টেক্সটাইল',
  factory: 'অটোমেশন',

  // --- Common Action Synonyms ---
  thik: 'মেরামত',
  'thik kora': 'মেরামত',
  sara: 'মেরামত',
  sarano: 'মেরামত',
  repair: 'মেরামত',
  repairing: 'মেরামত',
  service: 'সার্ভিস',
  servicing: 'সার্ভিস',
  nosto: 'নষ্ট',
  'chole na': 'নষ্ট',
  khrap: 'নষ্ট',
  problem: 'নষ্ট',
  leakage: 'স্যানিটারি',
  waring: 'ইলেকট্রিশিয়ান',
  wiring: 'ইলেকট্রিশিয়ান',
  fit: 'ফিটার',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const db = await getDB();
    const servicesCollection = db.collection('services');

    const doc = await servicesCollection.findOne({});
    if (!doc) {
      return NextResponse.json({ message: 'Catalog is empty' }, { status: 404 });
    }

    const searchResults: any[] = [];
    const searchTerm = q.toLowerCase().trim();

    let banglishSynonym = '';
    for (const key in banglishMap) {
      if (searchTerm.includes(key)) {
        banglishSynonym = banglishMap[key];
        break;
      }
    }

    for (const categoryKey in doc) {
      if (categoryKey === '_id') continue;

      const categoryGroup = (doc as any)[categoryKey];
      if (categoryGroup && Array.isArray(categoryGroup.services)) {
        categoryGroup.services.forEach((service: any) => {
          const nameEn = (service.en || '').toLowerCase();
          const nameBn = (service.bn || '').toLowerCase();
          const dynamicId = nameEn.replace(/\s+/g, '-');

          const isMatch =
            nameEn.includes(searchTerm) ||
            nameBn.includes(searchTerm) ||
            (banglishSynonym &&
              (nameEn.includes(banglishSynonym.toLowerCase()) ||
                nameBn.includes(banglishSynonym.toLowerCase())));

          if (isMatch) {
            searchResults.push({
              id: dynamicId,
              _id: dynamicId,
              nameEn: service.en,
              nameBn: service.bn,
              categoryName: categoryGroup.category?.bn,
            });
          }
        });
      }
    }

    const uniqueResults = searchResults.filter(
      (value, index, self) => self.findIndex((t) => t.id === value.id) === index,
    );

    return NextResponse.json(uniqueResults.slice(0, 10), { status: 200 });
  } catch (error: any) {
    console.error('Search routing engine error:', error);
    return NextResponse.json(
      { message: 'Internal server error during search data mapping.' },
      { status: 500 },
    );
  }
}
