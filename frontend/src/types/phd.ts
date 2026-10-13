export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified' | 'outdated' | 'conflicting';

export type FundingStatus = 
  | 'fully_funded_verified'
  | 'competitive_funding'
  | 'partially_funded'
  | 'self_funded'
  | 'funding_unknown';

export type ApplicationStage = 
  | 'interested'
  | 'researching'
  | 'eligibility_checked'
  | 'supervisor_identified'
  | 'supervisor_contacted'
  | 'documents_preparing'
  | 'in_progress'
  | 'submitted'
  | 'interview_scheduled'
  | 'offer_received'
  | 'waitlisted'
  | 'rejected'
  | 'accepted'
  | 'declined'
  | 'withdrawn';

export interface PhDStats {
  total_universities: number;
  countries_covered: number;
  total_programmes: number;
  total_funding_opportunities: number;
  saved_applications: number;
  shortlisted_items: number;
  upcoming_verified_deadlines: number;
  last_updated: string;
}

export interface PhDSupervisor {
  id: string;
  university?: string;
  university_name?: string;
  university_short_name?: string;
  country?: string;
  name: string;
  designation: string;
  department: string;
  lab_name?: string;
  lab_url?: string;
  faculty_profile_url: string;
  email?: string;
  research_interests: string[];
  recruitment_status: 'confirmed_open' | 'published_recruitment' | 'general_fit' | 'unknown';
  funded_positions_note?: string;
  recent_publications?: Array<{ title: string; venue?: string; year?: string }>;
  verification_status: VerificationStatus;
  last_verified_at?: string;
}

export interface PhDProgramme {
  id: string;
  university: string;
  university_name: string;
  university_short_name: string;
  country: string;
  country_code: string;
  city: string;
  website_url?: string;
  university_type?: string;
  title: string;
  department: string;
  degree_type: string;
  research_areas: string[];
  research_keywords: string[];
  official_url: string;
  application_portal_url?: string;
  admission_cycle: string;
  application_deadline: string;
  deadline_date?: string | null;
  deadline_timezone: string;
  intake_term: string;
  eligibility_criteria: string;
  mtech_accepted: boolean;
  mtech_details?: string;
  min_gpa_or_percent?: string;
  prerequisites: string[];
  required_documents: Array<{ name: string; status: 'required' | 'recommended' | 'conditionally_required' | 'not_required' }>;
  english_requirements?: string;
  test_requirements?: string;
  application_fee?: string;
  tuition_fee?: string;
  funding_status: FundingStatus;
  funding_details?: string;
  stipend_amount?: string;
  stipend_currency: string;
  supervisor_availability_note?: string;
  verification_status: VerificationStatus;
  source_url: string;
  last_verified_at?: string;
  notes_and_limitations?: string;
  supervisors?: PhDSupervisor[];
}

export interface PhDUniversity {
  id: string;
  name: string;
  short_name?: string;
  country: string;
  country_code: string;
  state_region?: string;
  city: string;
  website_url: string;
  admissions_url: string;
  departments: string[];
  research_centers: string[];
  university_type: string;
  verification_status: VerificationStatus;
  last_verified_at?: string;
  ranking_note?: string;
  programmes_count?: number;
  supervisors_count?: number;
  programmes?: PhDProgramme[];
}

export interface PhDResearchArea {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  key_topics: string[];
}

export interface PhDFundingOpportunity {
  id: string;
  title: string;
  provider: string;
  funding_type: string;
  eligible_countries: string[];
  stipend_amount: string;
  tuition_coverage: string;
  living_allowance?: string;
  travel_allowance?: string;
  deadline_description?: string;
  is_guaranteed_or_competitive: string;
  official_source_url: string;
  verification_status: VerificationStatus;
  last_verified_at?: string;
}

export interface PhDUserShortlist {
  id: string;
  user_id: string;
  university?: string;
  programme?: string;
  supervisor?: string;
  funding?: string;
  item_type: 'programme' | 'university' | 'supervisor' | 'funding';
  priority: 'high' | 'medium' | 'low';
  preferred_intake?: string;
  notes?: string;
  created_at: string;
  programme_details?: PhDProgramme;
  university_details?: PhDUniversity;
  supervisor_details?: PhDSupervisor;
  funding_details?: PhDFundingOpportunity;
}

export interface PhDApplicationDocument {
  id: string;
  application: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'ready' | 'submitted';
  notes?: string;
  updated_at?: string;
}

export interface PhDUserApplication {
  id: string;
  user_id: string;
  programme: string;
  programme_title?: string;
  university_name?: string;
  university_short_name?: string;
  country?: string;
  official_url?: string;
  application_portal_url?: string;
  stipend_amount?: string;
  stage: ApplicationStage;
  submission_deadline?: string | null;
  submission_date?: string | null;
  interview_date?: string | null;
  portal_login_url?: string;
  application_reference_number?: string;
  potential_supervisor?: string;
  sop_draft_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  documents?: PhDApplicationDocument[];
}

export interface PhDUserProfile {
  id?: string;
  user_id?: string;
  highest_qualification: string;
  degree_title: string;
  specialization: string;
  institution: string;
  cgpa_or_percent: string;
  graduation_year: number;
  research_experience_months: number;
  publications_count: number;
  thesis_title: string;
  primary_research_interests: string[];
  preferred_countries: string[];
  has_mtech: boolean;
  has_gate: boolean;
  gate_score?: string;
  has_gre: boolean;
  has_toefl_ielts: boolean;
  funding_requirement: string;
  target_intake: string;
}

export interface PhDEligibilityAssessmentResult {
  programme_id: string;
  programme_title: string;
  university_name: string;
  country: string;
  category: 'strong_match' | 'potential_match' | 'additional_qualification_required' | 'does_not_meet';
  category_label: string;
  matched_criteria: string[];
  unmatched_criteria: string[];
  unknown_criteria: string[];
  official_url: string;
  funding_status: string;
  stipend?: string;
  verification_status: VerificationStatus;
}

export interface PhDComparisonItem {
  id: string;
  title: string;
  university: string;
  country: string;
  city: string;
  degree_type: string;
  research_areas: string[];
  funding_status: string;
  stipend: string;
  tuition_fees: string;
  application_deadline: string;
  mtech_accepted: string;
  mtech_details: string;
  test_requirements: string;
  english_requirements: string;
  supervisors_count: number;
  official_url: string;
  verification_status: string;
  source_url: string;
}

export interface PhDDeadlineItem {
  programme_id: string;
  title: string;
  university: string;
  university_short: string;
  country: string;
  country_code: string;
  deadline_text: string;
  deadline_date?: string | null;
  deadline_timezone: string;
  intake_term: string;
  is_upcoming: boolean;
  days_left?: number | null;
  verification_status: VerificationStatus;
  official_url: string;
  portal_url?: string;
}
