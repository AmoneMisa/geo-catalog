// Tashkent City Transport Administration registry of route taxis published as
// "routes operating in Tashkent". The page is licensed CC BY 4.0.
// Checked: 2026-09-02.
//
// Important: contract end dates are retained as source metadata only. The public
// page contains rows whose listed contract dates have already elapsed, so those
// dates must not be used alone to infer whether a route is currently inactive.

export const TASHKENT_MINIBUS_OFFICIAL_SOURCE = Object.freeze({
  source: 'official',
  sourceUrl: 'https://toshkent.mintrans.uz/yonalishli-taksi',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  sourceCheckedAt: '2026-09-02',
  sourceClaim: 'operating_routes',
});

const rows = [
  ['1m', 'Qorasuv 6-mavzesi', 'Buyuk Ipak yo‘li metrosi', 7, 'ABDUXALIL TRANS SERVIS', '102', '2021-12-27', '2026-12-27'],
  ['4i', 'Chorsu savdo markazi', 'Chilonzor buyum bozori', 6, 'COMFORT MIKRO DRIVE SERVIS', '206', '2022-12-20', '2027-12-20'],
  ['8i', 'Qo‘yliq dexqon bozori', 'Chilonzor buyum bozori', 25, 'GAZEL AVTO TRANS', '000079', '2021-12-27', '2026-12-27'],
  ['18i', 'TTZ AShB', 'Chilonzor buyum bozori', 16, 'SHIRIN MIRON', '66', '2021-12-07', '2026-12-07'],
  ['19i', 'Geofiziklar qo‘rg‘oni', 'Chilonzor buyum bozori AShB', 10, 'ACTIVE TAXI', '261/2', '2022-07-07', '2026-07-07'],
  ['25m', 'Yangi Darxon mahallasi', 'Sergeli yarmarka bekati', 9, 'ABDUXALIL TRANS SERVIS', '1078/2', '2024-11-13', '2029-11-13'],
  ['27m', 'Yunusobod 19 daha', 'Chorsu savdo markazi', 10, 'SHERZOD SMART AVTO MChJ', '519/1/1/1/1', '2023-09-29', '2027-09-29'],
  ['31m', 'Qorasuv 1-mavzesi', 'Buyuk Ipak yo‘li metrosi', 9, 'AVTOELIT', '75', '2025-01-27', '2026-01-27'],
  ['40i', 'Yunusobod mavzesi 17-daha', 'Chilonzor buyum bozori', 22, 'YUKSALISH TRANS SERVIS', '906/2', '2024-09-20', '2025-09-20'],
  ['41m', 'Haydarobod MFY', 'Bo‘z bozor bekati', 8, 'FAVORITE MOTORS', '163', '2025-02-25', '2026-02-25'],
  ['43m', 'Xumoyun mavzesi', 'Do‘stlik metrosi AShB', 20, 'KAPITAL TRANS SERVIS PLUS', '701', '2024-07-15', '2029-07-15'],
  ['52m', 'Ibn Sino 2-mavzesi', 'Malika fabrikasi', 11, 'MADAD-TAXI', '26/1', '2025-01-20', '2026-10-12'],
  ['55m', 'Qo‘yliq dexqon bozori', 'M.Yusuf ko‘chasi', 13, 'COMFORT MIKRO DRIVE SERVIS', '207', '2022-12-20', '2026-12-20'],
  ['61m', 'Qo‘yliq kiyim bozori', 'Yunusobod mavzesi 4-daha', 8, 'ABDUMALIK TRANS SERVIS', '660', '2025-06-24', '2028-06-24'],
  ['68m', 'Xasanboy mavzesi', 'Chorsu savdo markazi', 7, 'ABDUXALIL TRANS SERVIS', '387', '2025-04-29', '2026-04-29'],
  ['76m', 'TTZ AShB', 'Paxtakor metrosi AShB', 20, 'MAGICAR TRANS', '73', '2021-12-27', '2026-12-27'],
  ['88m', 'Majnuntol mahallasi', 'Oloy bozori', 10, 'JASUR AVTO TRANS', '74/1', '2025-05-12', '2026-12-27'],
  ['92m', 'Do‘mbiraobod mavzesi', 'Chorsu metrosi AShB', 13, 'NIXOL NUR SERVIS', '30', '2021-11-10', '2026-11-10'],
  ['93m', 'Shofayzi ko‘chasi', 'Gulobod ko‘chasi AShB', 9, 'MIRKAMOL TRANS SERVIS', '75', '2021-12-27', '2026-12-27'],
  ['99m', 'TTZ AShB', 'Qo‘yliq bozori', 24, 'TEMUR EXPRESS TAKSI', '76', '2021-12-27', '2026-12-27'],
  ['104m', 'To‘labiy sh.x.', 'Chorsu savdo markazi', 6, 'AS TRUSTED ROUTE GROUP', '2270', '2025-08-08', '2025-10-07'],
  ['105m', 'Aviasozlar AShB', 'Qo‘yliq 5-mavzesi', 12, 'AUTO - MED MChJ', '897', '2024-09-19', '2025-09-19'],
  ['130m', 'Farxod bozori bekati', 'Paxtakor metrosi AShB', 10, 'SIRIUS TRANS GROUP', '199/8', '2022-12-20', '2025-12-20'],
  ['135m', 'M.Ulug‘bek qo‘rg‘oni', 'Bo‘z bozor bekati (Buyuk ipak yo‘li metro bekati)', 12, 'BAXROM ROAD BIZNESS SERVIS', '51/5', '2022-08-05', '2026-08-05'],
  ['139m', 'Suvsoz mavzesi', 'M.Yusuf ko‘chasi', 6, 'MIRKAMOL TRANS SERVIS', '175', '2022-06-23', '2026-06-23'],
  ['163m', 'Qo‘yliq bozori', 'Tashkent vokzali', 10, 'KOMPLIMENT AVTO TRANS', '1174', '2024-11-30', '2027-11-30'],
  ['166m', 'Tuzel 3-mavzesi', 'Mashinasozlar metrosi', 8, 'KOMPLIMENT AVTO TRANS', '1173', '2024-11-30', '2025-11-30'],
  ['171m', 'Yunusobod mavzesi 9-daha', 'Paxtakor metrosi AShB', 5, 'KAPITAL TRANS SERVIS PLUS', '2184', '2025-07-03', '2025-09-01'],
  ['182m', 'Gulobod ko‘chasi', 'Chilonzor mavzesi 25-daha AShB', 6, 'ABDUMALIK TRANS SERVIS', '100', '2025-02-02', '2030-02-02'],
  ['186m', 'Chorsu savdo markazi', 'Xasanboy jamoa xo‘jaligi', 6, 'NIXOL NUR SERVIS', '74', '2025-01-26', '2030-01-26'],
  ['190m', 'Qo‘yliq M-3', 'Chorsu savdo markazi', 14, 'GRAND AGAVA', '48/1', '2022-08-04', '2026-08-04'],
  ['191m', 'Beshqo‘rg‘on mahallasi', 'Chorsu savdo markazi', 8, 'MIRKAMOL TRANS SERVIS', '28', '2021-10-12', '2026-10-12'],
];

export const TASHKENT_MINIBUS_OFFICIAL_REGISTRY = Object.freeze(rows.map(([
  ref,
  from,
  to,
  plannedVehicles,
  operator,
  contractNumber,
  contractStart,
  contractEnd,
]) => Object.freeze({
  ref,
  from,
  to,
  plannedVehicles,
  operator,
  contractNumber,
  contractStart,
  contractEnd,
})));
