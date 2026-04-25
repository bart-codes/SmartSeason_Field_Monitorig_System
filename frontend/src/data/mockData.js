export const fields = [
  {
    id: 1,
    name: 'Kigumo Heights',
    crop_type: 'Maize',
    planting_date: '2026-03-12',
    current_stage: 'GROWING',
    status: 'ACTIVE',
    assigned_agent: 'Wanjiru Muthoni',
    notes: 'Crop growing well with good soil moisture. Central region performing excellently.'
  },
  {
    id: 2,
    name: 'Nakuru Spring',
    crop_type: 'Wheat',
    planting_date: '2026-02-28',
    current_stage: 'READY',
    status: 'AT_RISK',
    assigned_agent: 'Kipchoge Koech',
    notes: 'Wheat crop ready but Rift Valley weather conditions unpredictable next week.'
  },
  {
    id: 3,
    name: 'Murang\'a River Bottom',
    crop_type: 'Potatoes',
    planting_date: '2026-03-20',
    current_stage: 'PLANTED',
    status: 'ACTIVE',
    assigned_agent: 'Njeri Kamau',
    notes: 'Potato planting phase completed successfully in fertile valley soil.'
  },
  {
    id: 4,
    name: 'Eldoret Green Valley',
    crop_type: 'Barley',
    planting_date: '2026-01-15',
    current_stage: 'HARVESTED',
    status: 'COMPLETED',
    assigned_agent: 'Chemutai Kiplagat',
    notes: 'Barley harvest completed with strong yield in Rift Valley region.'
  }
];

export const agents = [
  { id: 1, name: 'Wanjiru Muthoni', email: 'wanjiru@example.com', role: 'AGENT' },
  { id: 2, name: 'Kipchoge Koech', email: 'kipchoge@example.com', role: 'AGENT' },
  { id: 3, name: 'Njeri Kamau', email: 'njeri@example.com', role: 'AGENT' },
  { id: 4, name: 'Chemutai Kiplagat', email: 'chemutai@example.com', role: 'AGENT' }
];
