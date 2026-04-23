export const fields = [
  {
    id: 1,
    name: 'North Orchard',
    crop_type: 'Corn',
    planting_date: '2026-03-12',
    current_stage: 'GROWING',
    status: 'ACTIVE',
    assigned_agent: 'Jasmine Park',
    notes: 'Irrigation schedule is stable and growth looks healthy.'
  },
  {
    id: 2,
    name: 'East Pasture',
    crop_type: 'Soybean',
    planting_date: '2026-02-28',
    current_stage: 'READY',
    status: 'AT_RISK',
    assigned_agent: 'Samuel Reed',
    notes: 'Crop appears ready, but weather risk is elevated for the next week.'
  },
  {
    id: 3,
    name: 'South Field',
    crop_type: 'Wheat',
    planting_date: '2026-03-20',
    current_stage: 'PLANTED',
    status: 'ACTIVE',
    assigned_agent: 'Mia Johnson',
    notes: 'New planting phase completed successfully.'
  },
  {
    id: 4,
    name: 'West Grove',
    crop_type: 'Barley',
    planting_date: '2026-01-15',
    current_stage: 'HARVESTED',
    status: 'COMPLETED',
    assigned_agent: 'Daniel Cruz',
    notes: 'Harvest completed with strong yield.'
  }
];

export const agents = [
  { id: 1, name: 'Jasmine Park', email: 'jasmine@example.com', role: 'AGENT' },
  { id: 2, name: 'Samuel Reed', email: 'samuel@example.com', role: 'AGENT' },
  { id: 3, name: 'Mia Johnson', email: 'mia@example.com', role: 'AGENT' },
  { id: 4, name: 'Daniel Cruz', email: 'daniel@example.com', role: 'AGENT' }
];
