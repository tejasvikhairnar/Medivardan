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
  const payload = {
    // Mode and IDs
    mode: 1,  // Reverting to integer to test
    doctorID: 0, 
    clinicID: formData.clinicName ? CLINIC_ID_MAP[formData.clinicName] : 1, // Default to 1 (Panvel) if missing
    doctorTypeID: DOCTOR_TYPE_MAP[formData.doctorType] || 1,

    // Personal Information
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    gender: formData.gender || "male",
    dob: formData.dateOfBirth || null,
    bloodGroup: formData.bloodGroup || "",

    // Contact Information
    mobile1: formData.mobileNo1 || "",
    mobile2: formData.mobileNo2 || "",
    email: formData.email || "",

    // Address Information
    line1: formData.addressLine1 || "",
    line2: formData.addressLine2 || "",
    areaPin: formData.areaPin || "",
    cityID: null, 
    stateID: null,
    countryID: null,

    // Medical Information
    specialityID: (() => {
      const selectedKey = Object.keys(formData.specialities).find(key => formData.specialities[key]);
      const id = selectedKey ? (SPECIALITY_ID_MAP[selectedKey] || 1) : 1;
      return String(id);
    })(),
    basicDegree: formData.currentEducation.degree || "BDS", // Default degree
    registrationNo: formData.registrationNo || "",
    registrationImageUrl: "", 

    // Documents 
    panCardNo: formData.panCardNo || "",
    panCardImageUrl: "",
    adharCardNo: formData.adharCardNo || "",
    adharCardImageUrl: "", 
    identityPolicyNo: formData.indemnityPolicyNo || "",
    identityPolicyImageUrl: "",
    degreeUpload1: "",
    degreeUpload2: "",
    profileImageUrl: "",

    // Work Information
    inTime: formData.inTime ? `${formData.inTime}:00` : "09:00:00", // Default time
    outTime: formData.outTime ? `${formData.outTime}:00` : "18:00:00", // Default time
    regDate: formData.date || new Date().toISOString().split('T')[0],

    // User credentials 
    userName: null,
    password: null,
    role: null,

    // Status
    isActive: true,
  };

  console.log("Transformed API Payload (Fixed SpecialityID):", payload);
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
