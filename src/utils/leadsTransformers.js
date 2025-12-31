/**
 * Leads Data Transformation Utilities
 * Handles transformation between UI forms and API data formats
 */

/**
 * Clinic ID mapping
 */
const CLINIC_ID_MAP = {
  'Panvel': 1,
  'Pune': 2,
  'Mumbai': 3,
  'Nashik': 4,
};

/**
 * Lead Source mapping
 */
const LEAD_SOURCE_MAP = {
  'google': 1,
  'facebook': 2,
  'instagram': 3,
  'justdial': 4,
  'referral': 5,
  'walkin': 6,
};

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} Transformed data for API
 */
export const transformFormDataToAPI = (formData) => {
  return {
    // Exact Schema from User's CURL
    enquiryID: formData.enquiryID || 0,
    clinicID: formData.clinicName ? CLINIC_ID_MAP[formData.clinicName] : 0,
    sourceid: formData.leadSource ? LEAD_SOURCE_MAP[formData.leadSource] : 0,
    roleId: 0,
    enquiryno: formData.leadNo || "",
    enquiryDate: formData.leadDate ? new Date(formData.leadDate).toISOString() : new Date().toISOString(),
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    dateBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date().toISOString(),
    age: formData.age || "0",
    gender: formData.gender || "Male",
    address: formData.address || "",
    countryId: 0,
    stateid: 0,
    cityid: 0,
    area: formData.area || "",
    email: formData.email || "",
    mobile: formData.mobileNo1 || "",
    telephone: formData.mobileNo2 || "",
    status: formData.patientFollowup || "Patient",
    folllowupdate: new Date().toISOString(),
    interestLevel: formData.interestLevel || "1",
    interestLevelCode: formData.interestLevel || "1",
    createdBy: 0,
    receivedByEmpId: 0,
    assignToEmpId: 0,
    telecallerToEmpId: 0,
    conversation: formData.conversationDetails || "",
    treatmentID: 0,
    modifiedBy: 0,
    isActive: true,
    pstatus: formData.patientStatus || "Co-operative",
    mode: formData.enquiryID ? 2 : 1 // 1 = Insert, 2 = Update (Assuming backend convention based on 'mode': 0 in curl)
  };
};

/**
 * Transform API response to display format
 * @param {Object} apiLead - Lead data from API
 * @returns {Object} Transformed data for display
 */
export const transformAPILeadToDisplay = (apiLead) => {
  return {
    srNo: apiLead.leadID || apiLead.LeadID,
    leadNo: apiLead.leadNo || apiLead.LeadNo || `E${apiLead.leadID}`,
    name: `${apiLead.firstName || ''} ${apiLead.lastName || ''}`.trim(),
    mobileNo: apiLead.phoneNo1 || apiLead.PhoneNo1 || '',
    clinicName: getClinicNameFromID(apiLead.clinicID || apiLead.ClinicID),
    sourceName: getSourceNameFromID(apiLead.leadSourceID || apiLead.LeadSourceID),
    status: apiLead.patientFollowup || apiLead.PatientFollowup || 'Patient',
    date: formatDate(apiLead.leadDate || apiLead.LeadDate),
    email: apiLead.emailid || apiLead.Emailid || '',
  };
};

/**
 * Get clinic name from ID
 * @param {number} clinicID - Clinic ID
 * @returns {string} Clinic name
 */
const getClinicNameFromID = (clinicID) => {
  const reverseMap = Object.entries(CLINIC_ID_MAP).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  return reverseMap[clinicID] || 'Unknown';
};

/**
 * Get source name from ID
 * @param {number} sourceID - Source ID
 * @returns {string} Source name
 */
const getSourceNameFromID = (sourceID) => {
  const reverseMap = Object.entries(LEAD_SOURCE_MAP).reduce((acc, [key, value]) => {
    acc[value] = key.charAt(0).toUpperCase() + key.slice(1);
    return acc;
  }, {});
  return reverseMap[sourceID] || 'Unknown';
};

/**
 * Format date to DD-MMM-YYYY
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Normalize lead data for consistent handling
 * @param {Object} leadData - Raw lead data
 * @returns {Object} Normalized lead data
 */
export const normalizeLeadData = (leadData) => {
  if (!leadData) return null;

  return {
    leadID: leadData.leadID || leadData.LeadID || null,
    firstName: leadData.firstName || leadData.FirstName || '',
    lastName: leadData.lastName || leadData.LastName || '',
    mobileNo: leadData.phoneNo1 || leadData.PhoneNo1 || '',
    email: leadData.emailid || leadData.Emailid || '',
    clinicID: leadData.clinicID || leadData.ClinicID || null,
    leadSourceID: leadData.leadSourceID || leadData.LeadSourceID || null,
  };
};
