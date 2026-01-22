/**
 * Doctor Data Transformation Utilities
 * Handles transformation between UI forms and API data formats
 */

/**
 * Clinic ID mapping
 */
const CLINIC_ID_MAP = {
  panvel: 1,
  pune: 2,
  mumbai: 3,
  nashik: 4,
};

/**
 * Doctor type ID mapping
 */
const DOCTOR_TYPE_MAP = {
  'full-time': 1,
  'part-time': 2,
  'visiting': 3,
};

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} Transformed data for API
 */
const SPECIALITY_ID_MAP = {
  generalDentist: 1,
  orthodontics: 2,
  periodontics: 3,
  prosthodontics: 4,
  endodontics: 5,
  pedodontics: 6,
  oralMaxillofacial: 7,
  oralPathology: 8,
  conservativeDentist: 9,
  asthesticDentist: 10,
};

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} Transformed data for API
 */
export const transformFormDataToAPI = (formData) => {
  console.log("Transformer received keys:", Object.keys(formData));
  console.log("Transformer check mobile:", formData.mobileNo1, "indemnity:", formData.indemnityPolicyNo);
  const payload = {
    // Mode and IDs
    mode: 1,
    doctorID: formData.doctorID || 0, 
    clinicID: formData.clinicName ? (CLINIC_ID_MAP[formData.clinicName] || 1) : 1, 
    doctorTypeID: (formData.doctorType && DOCTOR_TYPE_MAP[formData.doctorType]) ? DOCTOR_TYPE_MAP[formData.doctorType] : 1,

    // Personal Information
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    middleName: "", 
    gender: formData.gender || "male",
    dob: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date("1990-01-01").toISOString(),
    bloodGroup: formData.bloodGroup || "",

    // Contact Information
    mobile1: formData.mobileNo1 || "",
    mobile2: formData.mobile2 || "",
    email: formData.email || "",

    // Address Information
    residential_Address: formData.addressLine1 || "",
    line1: formData.addressLine1 || "",
    line2: formData.addressLine2 || "",
    areaPin: formData.areaPin || "",
    cityID: null, 
    stateID: null,
    countryID: null,
    locationID: null, 

    // Medical Information
    specialityID: (() => {
      const selectedKey = Object.keys(formData.specialities || {}).find(key => formData.specialities[key]);
      const id = selectedKey ? (SPECIALITY_ID_MAP[selectedKey] || 1) : 1;
      return null; // Try sending null as it matches DB state
    })(),
    basicDegree: formData.currentEducation?.degree || "BDS", 
    degreeUpload1: formData.degreeUpload1 || "",
    degreeUpload2: formData.degreeUpload2 || "",
    
    // Registration & Documents
    registrationNo: formData.registrationNo || "",
    registrationImageUrl: formData.registrationImageUrl || "", 
    panCardNo: formData.panCardNo || "",
    panCardImageUrl: formData.panCardImageUrl || "",
    adharCardNo: formData.adharCardNo || "",
    adharCardImageUrl: formData.adharCardImageUrl || "", 
    identityPolicyNo: formData.indemnityPolicyNo || "",
    identityPolicyImageUrl: formData.identityPolicyImageUrl || "",
    profileImageUrl: formData.profileImageUrl || "",

    // Work Information
    inTime: formData.inTime ? `${formData.inTime}:00` : "09:00:00", 
    outTime: formData.outTime ? `${formData.outTime}:00` : "18:00:00", 
    regDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(), 
    
    // User credentials 
    userName: formData.email || "", 
    password: "Password@123", 
    roleID: 2, 

    // Status & System 
    isActive: true,
    isDeleted: false, 
    isExistUser: true, 
    isTermAccept: true, 
    modifiedDate: new Date().toISOString(), 
    modifiedBy: null,
    createdDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(), 
    otp: null,
  };

  console.log("Transformed API Payload (Full Schema):", payload);
  return payload;
};

/**
 * Transform API response to display format
 * @param {Object} apiDoctor - Doctor data from API
 * @returns {Object} Transformed data for display
 */
export const transformAPIDoctorToDisplay = (apiDoctor) => {
  return {
    srNo: apiDoctor.srNo || apiDoctor.doctorID || apiDoctor.DoctorID,
    doctorID: apiDoctor.doctorID || apiDoctor.DoctorID,
    photo: apiDoctor.profilePhoto || "/placeholder-doctor.png",
    name: `${apiDoctor.title || ''} ${apiDoctor.firstName || ''} ${apiDoctor.lastName || ''}`.trim(),
    mobileNo: apiDoctor.mobile1 || apiDoctor.mobileNo || apiDoctor.MobileNo || apiDoctor.phoneNo1 || apiDoctor.PhoneNo1 || apiDoctor.phoneNo || '',
    emailId: apiDoctor.email || apiDoctor.emailID || apiDoctor.EmailID || apiDoctor.emailid || apiDoctor.Emailid || '',
    regDate: formatDate(apiDoctor.regDate || apiDoctor.createdDate || apiDoctor.registrationDate || apiDoctor.RegistrationDate),
  };
};

// Helper to format date as DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  return date.toLocaleDateString('en-GB').replace(/\//g, '-');
};

/**
 * Normalize API response to handle different field name formats
 * @param {Object} doctor - Raw doctor data from API
 * @returns {Object} Normalized doctor data
 */
export const normalizeDoctorData = (doctor) => {
  return {
    doctorID: doctor.doctorID || doctor.DoctorID,
    clinicID: doctor.clinicID || doctor.ClinicID,
    clinicName: doctor.clinicName || doctor.ClinicName,
    firstName: doctor.firstName || doctor.FirstName,
    lastName: doctor.lastName || doctor.LastName,
    mobileNo: doctor.mobileNo || doctor.MobileNo || doctor.phoneNo1,
    MobileNo: doctor.mobileNo || doctor.MobileNo || doctor.phoneNo1,
    emailID: doctor.emailID || doctor.EmailID || doctor.emailid,
    EmailID: doctor.emailID || doctor.EmailID || doctor.emailid,
    profilePhoto: doctor.profilePhoto || doctor.ProfilePhoto,
    registrationDate: doctor.registrationDate || doctor.RegistrationDate || doctor.regDate,
    RegistrationDate: doctor.registrationDate || doctor.RegistrationDate || doctor.regDate,
    ...doctor,
  };
};

/**
 * Transform API response to Form Data for Editing
 * @param {Object} apiDoctor - Doctor data from API
 * @returns {Object} Form data object
 */
export const transformAPItoForm = (apiDoctor) => {
  if (!apiDoctor) return null;

  // Reverse Maps
  const CLINIC_NAME_MAP = {
    1: 'panvel',
    2: 'pune',
    3: 'mumbai',
    4: 'nashik',
  };

  const DOCTOR_TYPE_NAME_MAP = {
    1: 'full-time',
    2: 'part-time',
    3: 'visiting',
  };

  const SPECIALITY_NAME_MAP = {
    1: 'generalDentist',
    2: 'orthodontics',
    3: 'periodontics',
    4: 'prosthodontics',
    5: 'endodontics',
    6: 'pedodontics',
    7: 'oralMaxillofacial',
    8: 'oralPathology',
    9: 'conservativeDentist',
    10: 'asthesticDentist',
  };

  // Safe date helper
  const toISODate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return "";
    }
  };

  // Safe time helper (HH:MM)
  const toTime = (timeStr) => {
    if (!timeStr) return "";
    // If it's full ISO string
    if (timeStr.includes('T')) {
       const date = new Date(timeStr);
       const hours = String(date.getHours()).padStart(2, '0');
       const minutes = String(date.getMinutes()).padStart(2, '0');
       return `${hours}:${minutes}`;
    }
    // If it's HH:MM:SS
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  return {
    doctorID: apiDoctor.doctorID || apiDoctor.DoctorID || 0,
    clinicName: CLINIC_NAME_MAP[apiDoctor.clinicID] || 'panvel',
    doctorType: DOCTOR_TYPE_NAME_MAP[apiDoctor.doctorTypeID] || 'full-time',
    date: toISODate(apiDoctor.createdDate),

    // Personal
    title: apiDoctor.title || "Dr.",
    firstName: apiDoctor.firstName || "",
    lastName: apiDoctor.lastName || "",
    dateOfBirth: toISODate(apiDoctor.dob),
    gender: apiDoctor.gender ? apiDoctor.gender.toLowerCase() : "male",
    addressLine1: apiDoctor.residential_Address || apiDoctor.line1 || "",
    addressLine2: apiDoctor.line2 || "",
    country: "India", // Default or map if available
    state: "Maharashtra", // Default
    city: "Mumbai", // Default
    areaPin: apiDoctor.areaPin || "",
    mobileNo1: apiDoctor.mobile1 || "",
    mobileNo2: apiDoctor.mobile2 || "",
    email: apiDoctor.email || "",
    bloodGroup: apiDoctor.bloodGroup || "",
    inTime: toTime(apiDoctor.inTime),
    outTime: toTime(apiDoctor.outTime),

    // Education
    educationList: [], // Complex to map back if not in response, leave empty for now
    currentEducation: {
      degree: apiDoctor.basicDegree || "",
      board: "",
      upload: null,
    },

    // Speciality
    specialities: {
      asthesticDentist: false,
      generalDentist: false,
      orthodontics: false,
      periodontics: false,
      conservativeDentist: false,
      oralMaxillofacial: false,
      pedodontics: false,
      prosthodontics: false,
      endodontics: false,
      oralPathology: false,
      [SPECIALITY_NAME_MAP[apiDoctor.specialityID]]: true, // Set the primary one
    },

    // Documents (URLs)
    profilePhoto: null, // Files can't be set from URL
    profileImageUrl: apiDoctor.profileImageUrl, // Keep URL to show preview
    
    adharCardNo: apiDoctor.adharCardNo || "",
    adharCardImage: null,
    adharCardImageUrl: apiDoctor.adharCardImageUrl,

    panCardNo: apiDoctor.panCardNo || "",
    panCardImage: null,
    panCardImageUrl: apiDoctor.panCardImageUrl,

    registrationNo: apiDoctor.registrationNo || "",
    certificateImage: null,
    registrationImageUrl: apiDoctor.registrationImageUrl,

    indemnityPolicyNo: apiDoctor.identityPolicyNo || "",
    indemnityPolicyImage: null,
    identityPolicyImageUrl: apiDoctor.identityPolicyImageUrl,
  };
};
