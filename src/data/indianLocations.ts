export interface StateDistrictGroup {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictGroup[] = [
  {
    state: 'Andhra Pradesh',
    districts: [
      'Anantapur',
      'Chittoor',
      'East Godavari',
      'Guntur',
      'Kadapa',
      'Krishna',
      'Kurnool',
      'Nandyal',
      'Nellore',
      'Prakasam',
      'Srikakulam',
      'Tirupati',
      'Visakhapatnam',
      'Vizianagaram',
      'West Godavari',
    ],
  },
  {
    state: 'Assam',
    districts: ['Barpeta', 'Cachar', 'Dibrugarh', 'Jorhat', 'Kamrup', 'Nagaon', 'Sonitpur', 'Tinsukia'],
  },
  {
    state: 'Bihar',
    districts: ['Begusarai', 'Bhagalpur', 'Darbhanga', 'Gaya', 'Muzaffarpur', 'Nalanda', 'Patna', 'Purnia'],
  },
  {
    state: 'Chhattisgarh',
    districts: ['Bilaspur', 'Dhamtari', 'Durg', 'Jagdalpur', 'Korba', 'Raigarh', 'Raipur', 'Rajnandgaon'],
  },
  {
    state: 'Gujarat',
    districts: ['Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bhavnagar', 'Junagadh', 'Kutch', 'Mehsana', 'Rajkot', 'Surat', 'Vadodara'],
  },
  {
    state: 'Haryana',
    districts: ['Ambala', 'Bhiwani', 'Hisar', 'Jhajjar', 'Karnal', 'Kurukshetra', 'Panipat', 'Rohtak', 'Sirsa', 'Sonipat'],
  },
  {
    state: 'Himachal Pradesh',
    districts: ['Bilaspur', 'Kangra', 'Kullu', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
  },
  {
    state: 'Jharkhand',
    districts: ['Bokaro', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Giridih', 'Hazaribagh', 'Ranchi'],
  },
  {
    state: 'Karnataka',
    districts: ['Bagalkot', 'Belagavi', 'Ballari', 'Bengaluru Rural', 'Bidar', 'Davanagere', 'Dharwad', 'Hassan', 'Kalaburagi', 'Kolar', 'Mandya', 'Mysuru', 'Raichur', 'Shivamogga', 'Tumakuru'],
  },
  {
    state: 'Kerala',
    districts: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Wayanad'],
  },
  {
    state: 'Madhya Pradesh',
    districts: ['Bhopal', 'Chhindwara', 'Dewas', 'Gwalior', 'Indore', 'Jabalpur', 'Khandwa', 'Mandsaur', 'Rewa', 'Sagar', 'Sehore', 'Ujjain', 'Vidisha'],
  },
  {
    state: 'Maharashtra',
    districts: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Jalgaon', 'Kolhapur', 'Latur', 'Nagpur', 'Nashik', 'Pune', 'Sangli', 'Satara', 'Solapur', 'Yavatmal'],
  },
  {
    state: 'Odisha',
    districts: ['Balasore', 'Bargarh', 'Bhadrak', 'Cuttack', 'Ganjam', 'Kalahandi', 'Kendrapara', 'Khordha', 'Koraput', 'Puri', 'Sambalpur'],
  },
  {
    state: 'Punjab',
    districts: ['Amritsar', 'Bathinda', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Moga', 'Patiala', 'Sangrur'],
  },
  {
    state: 'Rajasthan',
    districts: ['Ajmer', 'Alwar', 'Bikaner', 'Jaipur', 'Jodhpur', 'Kota', 'Nagaur', 'Pali', 'Sikar', 'Sri Ganganagar', 'Udaipur'],
  },
  {
    state: 'Tamil Nadu',
    districts: ['Coimbatore', 'Cuddalore', 'Dindigul', 'Erode', 'Kanchipuram', 'Madurai', 'Nagapattinam', 'Namakkal', 'Salem', 'Thanjavur', 'Theni', 'Tiruchirappalli', 'Tirunelveli', 'Vellore', 'Villupuram'],
  },
  {
    state: 'Telangana',
    districts: ['Adilabad', 'Hyderabad', 'Jagtial', 'Kamareddy', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Warangal'],
  },
  {
    state: 'Uttar Pradesh',
    districts: ['Agra', 'Aligarh', 'Ayodhya', 'Bareilly', 'Gorakhpur', 'Jhansi', 'Kanpur Nagar', 'Lucknow', 'Mathura', 'Meerut', 'Moradabad', 'Muzaffarnagar', 'Prayagraj', 'Saharanpur', 'Varanasi'],
  },
  {
    state: 'Uttarakhand',
    districts: ['Almora', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Udham Singh Nagar'],
  },
  {
    state: 'West Bengal',
    districts: ['Bankura', 'Bardhaman', 'Birbhum', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Malda', 'Murshidabad', 'Nadia', 'Paschim Medinipur', 'Purba Medinipur'],
  },
];

export interface ParsedLocation {
  village: string;
  district: string;
  state: string;
}

export function parseLocationParts(locationStr?: string | null): ParsedLocation {
  if (!locationStr) {
    return { village: '', district: '', state: '' };
  }
  const parts = locationStr
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return {
      village: parts.slice(0, parts.length - 2).join(', '),
      district: parts[parts.length - 2],
      state: parts[parts.length - 1],
    };
  }
  if (parts.length === 2) {
    const secondIsState = INDIAN_STATES_DISTRICTS.some(
      (s) => s.state.toLowerCase() === parts[1].toLowerCase()
    );
    if (secondIsState) {
      return { village: '', district: parts[0], state: parts[1] };
    }
    return { village: parts[0], district: parts[1], state: '' };
  }
  return { village: parts[0] || '', district: '', state: '' };
}

export function formatLocationString(village: string, district: string, state: string): string {
  return [village.trim(), district.trim(), state.trim()].filter(Boolean).join(', ');
}
