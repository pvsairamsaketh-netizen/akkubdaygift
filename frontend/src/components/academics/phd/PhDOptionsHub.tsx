import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Globe, 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Users, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Trash2, 
  ChevronRight, 
  Building, 
  BookOpen, 
  ArrowRight, 
  Cpu, 
  BrainCircuit, 
  X,
  Send,
  Sliders,
  Check
} from 'lucide-react';
import { api } from '../../../services/api';
import type {
  PhDStats,
  PhDUniversity,
  PhDProgramme,
  PhDSupervisor,
  PhDFundingOpportunity,
  PhDResearchArea,
  PhDUserShortlist,
  PhDUserApplication,
  PhDUserProfile,
  PhDEligibilityAssessmentResult,
  PhDComparisonItem,
  PhDDeadlineItem,
  ApplicationStage
} from '../../../types/phd';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export type PhDSubTab = 
  | 'universities'
  | 'programmes'
  | 'research_areas'
  | 'funding'
  | 'supervisors'
  | 'deadlines'
  | 'compare'
  | 'shortlist'
  | 'applications'
  | 'eligibility'
  | 'checklist'
  | 'ai_advisor';

interface PhDOptionsHubProps {
  initialSubTab?: PhDSubTab;
}

export const PhDOptionsHub: React.FC<PhDOptionsHubProps> = ({
  initialSubTab = 'programmes'
}) => {
  const { isDark } = useAcademicsTheme();
  const [activeTab, setActiveTab] = useState<PhDSubTab>(initialSubTab);

  // Data states
  const [stats, setStats] = useState<PhDStats | null>(null);
  const [universities, setUniversities] = useState<PhDUniversity[]>([]);
  const [programmes, setProgrammes] = useState<PhDProgramme[]>([]);
  const [supervisors, setSupervisors] = useState<PhDSupervisor[]>([]);
  const [fundingOpps, setFundingOpps] = useState<PhDFundingOpportunity[]>([]);
  const [researchCategories, setResearchCategories] = useState<Record<string, PhDResearchArea[]>>({});
  const [deadlines, setDeadlines] = useState<PhDDeadlineItem[]>([]);
  const [shortlist, setShortlist] = useState<PhDUserShortlist[]>([]);
  const [applications, setApplications] = useState<PhDUserApplication[]>([]);
  const [profile, setProfile] = useState<PhDUserProfile | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'india' | 'abroad'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [researchAreaFilter, setResearchAreaFilter] = useState<string>('');
  const [fundingFilter, setFundingFilter] = useState<string>('');
  const [mtechOnlyFilter, setMtechOnlyFilter] = useState<boolean>(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState<boolean>(false);

  // Modals & Active Selections
  const [selectedProgramme, setSelectedProgramme] = useState<PhDProgramme | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [comparisonMatrix, setComparisonMatrix] = useState<PhDComparisonItem[]>([]);
  const [isComparingModalOpen, setIsComparingModalOpen] = useState<boolean>(false);

  // Eligibility Workflow State
  const [eligibilityResults, setEligibilityResults] = useState<PhDEligibilityAssessmentResult[]>([]);
  const [isEvaluatingEligibility, setIsEvaluatingEligibility] = useState<boolean>(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState<boolean>(false);

  // AI Advisor State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiMatchedProgrammes, setAiMatchedProgrammes] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [
        statsData,
        unisData,
        progsData,
        supsData,
        fundsData,
        areasData,
        deadlinesData,
        shortlistData,
        appsData,
        profData
      ] = await Promise.all([
        api.phd.getStats().catch(() => null),
        api.phd.getUniversities().catch(() => ({ results: [] })),
        api.phd.getProgrammes().catch(() => ({ results: [] })),
        api.phd.getSupervisors().catch(() => ({ results: [] })),
        api.phd.getFundingOpportunities().catch(() => ({ results: [] })),
        api.phd.getResearchAreas().catch(() => ({ categories: {} })),
        api.phd.getDeadlines().catch(() => ({ deadlines: [] })),
        api.phd.getShortlist().catch(() => ({ shortlist: [] })),
        api.phd.getApplications().catch(() => ({ applications: [] })),
        api.phd.getProfile().catch(() => null)
      ]);

      if (statsData) setStats(statsData);
      setUniversities(unisData.results || []);
      setProgrammes(progsData.results || []);
      setSupervisors(supsData.results || []);
      setFundingOpps(fundsData.results || []);
      setResearchCategories(areasData.categories || {});
      setDeadlines(deadlinesData.deadlines || []);
      setShortlist(shortlistData.shortlist || []);
      setApplications(appsData.applications || []);
      if (profData) setProfile(profData);
    } catch (err: any) {
      console.error("Error loading PhD database:", err);
      setErrorMsg("Failed to connect to the PhD repository. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Programmes
  const filteredProgrammes = useMemo(() => {
    return programmes.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          p.title.toLowerCase().includes(q) ||
          p.university_name.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.research_areas.some(a => a.toLowerCase().includes(q)) ||
          p.research_keywords.some(k => k.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      if (locationFilter === 'india' && p.country_code !== 'IN') return false;
      if (locationFilter === 'abroad' && p.country_code === 'IN') return false;
      if (countryFilter && p.country.toLowerCase() !== countryFilter.toLowerCase()) return false;
      if (researchAreaFilter && !p.research_areas.some(a => a.toLowerCase().includes(researchAreaFilter.toLowerCase()))) return false;
      if (fundingFilter && p.funding_status !== fundingFilter) return false;
      if (mtechOnlyFilter && !p.mtech_accepted) return false;
      if (verifiedOnlyFilter && p.verification_status !== 'verified') return false;
      return true;
    });
  }, [programmes, searchQuery, locationFilter, countryFilter, researchAreaFilter, fundingFilter, mtechOnlyFilter, verifiedOnlyFilter]);

  // Unique country list
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    universities.forEach(u => set.add(u.country));
    return Array.from(set).sort();
  }, [universities]);

  // Shortlist Toggle
  const handleToggleShortlist = async (programmeId: string) => {
    const existing = shortlist.find(s => s.programme === programmeId);
    if (existing) {
      try {
        await api.phd.removeFromShortlist(existing.id);
        setShortlist(prev => prev.filter(s => s.id !== existing.id));
      } catch (err) {
        console.error("Failed to remove shortlist:", err);
      }
    } else {
      try {
        const created = await api.phd.addToShortlist({
          programme_id: programmeId,
          priority: 'high'
        });
        setShortlist(prev => [created, ...prev]);
      } catch (err) {
        console.error("Failed to add shortlist:", err);
      }
    }
  };

  // Track Application Add
  const handleStartApplication = async (programmeId: string) => {
    try {
      const created = await api.phd.createApplication({
        programme_id: programmeId,
        stage: 'interested'
      });
      setApplications(prev => [created, ...prev]);
      setActiveTab('applications');
    } catch (err) {
      alert("Application already in progress or created.");
    }
  };

  // Compare Handler
  const handleToggleCompare = (id: string) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          alert("You can compare up to 4 programmes simultaneously.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleOpenComparisonMatrix = async () => {
    if (comparisonIds.length === 0) {
      alert("Select at least 1 programme to compare.");
      return;
    }
    try {
      const res = await api.phd.compare(comparisonIds);
      setComparisonMatrix(res.comparison || []);
      setIsComparingModalOpen(true);
    } catch (err) {
      console.error("Comparison failed:", err);
    }
  };

  // Eligibility Evaluation Trigger
  const handleRunEligibilityAssessment = async () => {
    setIsEvaluatingEligibility(true);
    try {
      const res = await api.phd.assessEligibility(profile);
      setEligibilityResults(res.results || []);
      setActiveTab('eligibility');
    } catch (err) {
      console.error("Eligibility check failed:", err);
    } finally {
      setIsEvaluatingEligibility(false);
    }
  };

  // AI Advisor Search Trigger
  const handleRunAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await api.phd.askAISearch(aiQuery.trim());
      setAiResponse(res.answer || null);
      setAiMatchedProgrammes(res.matched_programmes || []);
    } catch (err) {
      console.error("AI Search failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Document Toggle Status Handler
  const handleToggleDocStatus = async (docId: string, currentStatus: string) => {
    const nextStatus = 
      currentStatus === 'not_started' ? 'in_progress' :
      currentStatus === 'in_progress' ? 'ready' :
      currentStatus === 'ready' ? 'submitted' : 'not_started';
    
    try {
      await api.phd.updateDocumentStatus(docId, nextStatus);
      setApplications(prev => prev.map(app => {
        if (!app.documents) return app;
        return {
          ...app,
          documents: app.documents.map(d => d.id === docId ? { ...d, status: nextStatus as any } : d)
        };
      }));
    } catch (err) {
      console.error("Document update failed:", err);
    }
  };

  // Navigation Subtabs
  const subNavItems: { id: PhDSubTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'programmes', label: 'Explore PhD Programmes', icon: <GraduationCap className="w-3.5 h-3.5" />, badge: `${programmes.length}` },
    { id: 'universities', label: 'Explore Universities', icon: <Building className="w-3.5 h-3.5" />, badge: `${universities.length}` },
    { id: 'research_areas', label: 'Research Areas', icon: <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'funding', label: 'Fully Funded Opportunities', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Stipends' },
    { id: 'supervisors', label: 'Research Supervisors', icon: <Users className="w-3.5 h-3.5 text-purple-400" />, badge: `${supervisors.length}` },
    { id: 'deadlines', label: 'Admission Deadlines', icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />, badge: 'Verified' },
    { id: 'compare', label: 'Compare Universities', icon: <Sliders className="w-3.5 h-3.5 text-sky-400" />, badge: comparisonIds.length ? `${comparisonIds.length}` : undefined },
    { id: 'shortlist', label: 'My Shortlist', icon: <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />, badge: `${shortlist.length}` },
    { id: 'applications', label: 'My Applications', icon: <FileText className="w-3.5 h-3.5 text-emerald-400" />, badge: `${applications.length}` },
    { id: 'eligibility', label: 'Eligibility Assessment', icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> },
    { id: 'checklist', label: 'Application Checklist', icon: <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'ai_advisor', label: 'AI Research Advisor', icon: <Sparkles className="w-3.5 h-3.5 text-yellow-300" />, badge: 'Grounded' }
  ];

  if (isLoading && programmes.length === 0) {
    return (
      <div className={`p-16 rounded-2xl border flex flex-col items-center justify-center gap-3 ${
        isDark ? 'bg-[#0d1117] border-stone-800 text-stone-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <span className="text-sm font-semibold">Loading verified PhD discovery dataset...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full font-sans transition-colors animate-fade-in">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MASTER HEADER & VERIFIED METRIC TILES (PHASE 3)                        */}
      {/* ========================================================================= */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-xl flex flex-col gap-5 transition-all ${
        isDark ? 'bg-[#0d1117] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0 text-white">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  PhD Options in India &amp; Abroad
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 font-mono uppercase tracking-wide">
                  Verified Official Sources
                </span>
              </div>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                Discover PhD programmes, research opportunities, supervisors, funding, and admission deadlines around the world.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunEligibilityAssessment}
              disabled={isEvaluatingEligibility}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isEvaluatingEligibility
                  ? 'bg-amber-700/50 text-white cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-amber-900/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isEvaluatingEligibility ? 'Evaluating...' : 'Check My Eligibility'}</span>
            </button>

            {comparisonIds.length > 0 && (
              <button
                onClick={handleOpenComparisonMatrix}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm cursor-pointer animate-pulse"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Compare Selected ({comparisonIds.length})</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              title="Refresh verified records"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'border-stone-800 hover:bg-stone-800 text-stone-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Summary Metrics Cards (Phase 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">Universities in DB</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-sky-400">{stats?.total_universities ?? universities.length}</span>
              <span className="text-[10px] opacity-60">Verified</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">Countries Covered</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-indigo-400">{stats?.countries_covered ?? availableCountries.length}</span>
              <span className="text-[10px] opacity-60">India &amp; Global</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">PhD Programmes</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-purple-400">{stats?.total_programmes ?? programmes.length}</span>
              <span className="text-[10px] opacity-60">Active</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">Funding Schemes</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-emerald-400">{stats?.total_funding_opportunities ?? fundingOpps.length}</span>
              <span className="text-[10px] opacity-60">Full / RA / TA</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">Saved Applications</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-amber-400">{applications.length}</span>
              <span className="text-[10px] opacity-60">Tracker</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col gap-1 transition-colors ${
            isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-70 font-medium">Upcoming Deadlines</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-rose-400">{stats?.upcoming_verified_deadlines ?? deadlines.filter(d => d.is_upcoming).length}</span>
              <span className="text-[10px] opacity-60">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVIGATION TABS (ALL 12 MODULES)                                   */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {subNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-900/40 ring-1 ring-sky-400/50'
                  : isDark
                  ? 'bg-[#0d1117] text-stone-400 hover:text-stone-200 hover:bg-[#161b22] border border-stone-800'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isDark ? 'bg-stone-800 text-stone-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC CONTENT VIEWS                                                  */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB A: EXPLORE PHD PROGRAMMES (PRIMARY SEARCH & FILTER VIEW)              */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'programmes' && (
        <div className="flex flex-col gap-4">
          {/* Advanced Search & Filtering Bar */}
          <div className={`p-4 rounded-2xl border shadow-sm flex flex-col gap-3 transition-colors ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className={`flex items-center gap-2 flex-1 w-full px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Search className="w-4 h-4 opacity-50 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by university, topic (Data Engineering, Databases, AI, Lakehouse), department, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-hidden w-full text-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-sm hover:opacity-100 opacity-60">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Location Toggle: All vs India vs Abroad */}
              <div className={`flex items-center p-1 rounded-xl border text-xs shrink-0 ${
                isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setLocationFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    locationFilter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  All ({programmes.length})
                </button>
                <button
                  onClick={() => setLocationFilter('india')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    locationFilter === 'india' ? 'bg-sky-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  India 🇮🇳 ({programmes.filter(p => p.country_code === 'IN').length})
                </button>
                <button
                  onClick={() => setLocationFilter('abroad')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    locationFilter === 'abroad' ? 'bg-sky-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Abroad 🌍 ({programmes.filter(p => p.country_code !== 'IN').length})
                </button>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-stone-800/20">
              <div className="flex items-center gap-1 opacity-75 font-semibold text-[11px] mr-1">
                <Filter className="w-3 h-3" />
                <span>Filters:</span>
              </div>

              {/* Country Select */}
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs outline-hidden cursor-pointer ${
                  isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">All Countries</option>
                {availableCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Research Area Filter */}
              <select
                value={researchAreaFilter}
                onChange={(e) => setResearchAreaFilter(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs outline-hidden cursor-pointer ${
                  isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">All Research Fields</option>
                <option value="Data Engineering">Data Engineering &amp; Systems</option>
                <option value="Data Science">Data Science &amp; Analytics</option>
                <option value="Artificial Intelligence">AI &amp; Machine Learning</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Systems">Cloud, HPC &amp; Systems</option>
              </select>

              {/* Funding Status Filter */}
              <select
                value={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs outline-hidden cursor-pointer ${
                  isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="">Funding: All Types</option>
                <option value="fully_funded_verified">Fully Funded &amp; Verified Only</option>
                <option value="competitive_funding">Competitive Fellowships Available</option>
              </select>

              {/* M.Tech Accepted Toggle */}
              <button
                onClick={() => setMtechOnlyFilter(!mtechOnlyFilter)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  mtechOnlyFilter
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : isDark ? 'bg-[#161b22] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Check className={`w-3 h-3 ${mtechOnlyFilter ? 'opacity-100' : 'opacity-40'}`} />
                <span>M.Tech Accepted</span>
              </button>

              {/* Verified Only Toggle */}
              <button
                onClick={() => setVerifiedOnlyFilter(!verifiedOnlyFilter)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  verifiedOnlyFilter
                    ? 'bg-teal-600 text-white border-teal-500'
                    : isDark ? 'bg-[#161b22] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className={`w-3 h-3 ${verifiedOnlyFilter ? 'opacity-100' : 'opacity-40'}`} />
                <span>Verified Only</span>
              </button>

              {/* Clear filters button */}
              {(countryFilter || researchAreaFilter || fundingFilter || mtechOnlyFilter || verifiedOnlyFilter || searchQuery || locationFilter !== 'all') && (
                <button
                  onClick={() => {
                    setCountryFilter('');
                    setResearchAreaFilter('');
                    setFundingFilter('');
                    setMtechOnlyFilter(false);
                    setVerifiedOnlyFilter(false);
                    setSearchQuery('');
                    setLocationFilter('all');
                  }}
                  className="text-xs text-rose-500 hover:underline ml-auto cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Result Count and Comparison Trigger */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="opacity-75 font-medium">
              Showing <strong>{filteredProgrammes.length}</strong> verified PhD programmes
            </span>

            {comparisonIds.length > 0 && (
              <span className="text-sky-400 font-medium">
                {comparisonIds.length} selected for comparison
              </span>
            )}
          </div>

          {/* Programme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProgrammes.map((p) => {
              const isShortlisted = shortlist.some(s => s.programme === p.id);
              const isCompared = comparisonIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                    isDark ? 'bg-[#0d1117] border-stone-800 hover:border-stone-700' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                          p.country_code === 'IN'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {p.country_code === 'IN' ? '🇮🇳 India' : `🌍 ${p.country}`}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono ${
                          p.funding_status === 'fully_funded_verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          {p.funding_status === 'fully_funded_verified' ? '100% Fully Funded' : 'Competitive Funding'}
                        </span>

                        {p.mtech_accepted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold font-mono">
                            M.Tech Priority
                          </span>
                        )}
                      </div>

                      {/* Official Verified Badge */}
                      <a
                        href={p.source_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Direct link to verified official source page"
                        className="flex items-center gap-1 text-[10px] text-emerald-500 hover:underline font-mono"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Verified</span>
                      </a>
                    </div>

                    {/* Programme Title & University */}
                    <h3 
                      onClick={() => setSelectedProgramme(p)}
                      className="font-bold text-base hover:text-sky-400 cursor-pointer transition-colors leading-snug"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 opacity-60" />
                      <span>{p.university_name}</span>
                      <span>•</span>
                      <span>{p.city}</span>
                    </p>

                    {/* Research Areas / Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      {p.research_areas.map((ra, idx) => (
                        <span 
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-md ${
                            isDark ? 'bg-[#161b22] text-stone-300' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ra}
                        </span>
                      ))}
                    </div>

                    {/* Key Facts Summary */}
                    <div className={`mt-3.5 p-3 rounded-xl text-xs flex flex-col gap-1.5 ${
                      isDark ? 'bg-[#161b22]/70' : 'bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="opacity-70 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          <span>Stipend:</span>
                        </span>
                        <span className="font-semibold text-emerald-400 font-mono text-right">{p.stipend_amount || 'Subsidized fellowship'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="opacity-70 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>Deadline:</span>
                        </span>
                        <span className="font-semibold text-amber-400 font-mono">{p.application_deadline}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="opacity-70 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-sky-400" />
                          <span>Degree Type:</span>
                        </span>
                        <span className="font-medium opacity-90">{p.degree_type} ({p.department})</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/20 text-xs">
                    <button
                      onClick={() => handleToggleCompare(p.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                        isCompared
                          ? 'bg-sky-600 text-white'
                          : isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleShortlist(p.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isShortlisted
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                            : isDark ? 'border-stone-800 hover:bg-stone-800 text-stone-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                        title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => setSelectedProgramme(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer text-xs"
                      >
                        <span>Full Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProgrammes.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border flex flex-col items-center gap-3 ${
              isDark ? 'bg-[#0d1117] border-stone-800 text-stone-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <AlertCircle className="w-10 h-10 opacity-40 text-amber-500" />
              <h3 className="text-base font-bold">No verified programmes match your current filters</h3>
              <p className="text-xs max-w-md opacity-75">
                Try expanding your search query or reset the location/funding filters to view all available verified doctoral programmes.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('all');
                  setCountryFilter('');
                  setResearchAreaFilter('');
                  setFundingFilter('');
                  setMtechOnlyFilter(false);
                }}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-500 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB B: EXPLORE UNIVERSITIES (PHASE 5)                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((u) => (
            <div
              key={u.id}
              className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                    u.country_code === 'IN'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {u.country_code === 'IN' ? '🇮🇳 India' : `🌍 ${u.country}`}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <h3 className="font-bold text-base leading-snug">{u.name}</h3>
                <p className="text-xs opacity-75 mt-0.5">{u.city}, {u.state_region || u.country}</p>
                <p className="text-[11px] opacity-60 mt-1">{u.university_type}</p>

                {u.ranking_note && (
                  <p className="text-[11px] text-amber-500/90 font-medium mt-2 bg-amber-500/10 p-2 rounded-lg">
                    {u.ranking_note}
                  </p>
                )}

                <div className="mt-3 flex flex-col gap-1 text-xs opacity-80">
                  <span className="font-semibold text-[11px]">Departments &amp; Schools:</span>
                  <ul className="list-disc list-inside text-[11px] opacity-75 space-y-0.5">
                    {u.departments.slice(0, 3).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-800/20 text-xs">
                <a
                  href={u.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Official Website</span>
                </a>

                <a
                  href={u.admissions_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <span>Admissions Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB C: RESEARCH AREAS (PHASE 4)                                           */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'research_areas' && (
        <div className="flex flex-col gap-6">
          <div className={`p-4 rounded-xl border text-xs ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm text-sky-400 mb-1">Supported Research Disciplines (Phase 4)</h3>
            <p className="opacity-75">
              Doctoral programmes and active research groups in the database are categorized under these official sub-fields. Click any area to explore matching doctoral opportunities.
            </p>
          </div>

          {Object.entries(researchCategories).map(([categoryName, areas]) => (
            <div key={categoryName} className="flex flex-col gap-3">
              <h2 className="text-sm font-bold tracking-tight uppercase opacity-75 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>{categoryName}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {areas.map((ra) => (
                  <div
                    key={ra.id}
                    onClick={() => {
                      setResearchAreaFilter(ra.name);
                      setActiveTab('programmes');
                    }}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer ${
                      isDark ? 'bg-[#0d1117] border-stone-800 hover:border-sky-500/50' : 'bg-white border-slate-200 hover:border-sky-500/50'
                    }`}
                  >
                    <h3 className="font-bold text-sm text-sky-400 flex items-center justify-between">
                      <span>{ra.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </h3>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">{ra.description}</p>
                    
                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      {ra.key_topics.map((t, idx) => (
                        <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-[#161b22] text-stone-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB D: FULLY FUNDED OPPORTUNITIES & FELLOWSHIPS (PHASE 10)                 */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'funding' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fundingOpps.map((f) => (
              <div
                key={f.id}
                className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-3 ${
                  isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                      {f.tuition_coverage}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Scheme</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-emerald-400">{f.title}</h3>
                  <p className="text-xs opacity-75 mt-0.5 font-medium">{f.provider}</p>

                  <div className={`mt-3 p-3 rounded-xl flex flex-col gap-1.5 text-xs ${
                    isDark ? 'bg-[#161b22]' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Stipend Amount:</span>
                      <span className="font-bold text-emerald-400 font-mono">{f.stipend_amount}</span>
                    </div>
                    {f.travel_allowance && (
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Travel / Contingency Grant:</span>
                        <span className="font-medium text-amber-300 text-right">{f.travel_allowance}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Competition Nature:</span>
                      <span className="font-medium capitalize">{f.is_guaranteed_or_competitive.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/20 flex items-center justify-between">
                  <span className="text-[11px] opacity-70">Deadline: {f.deadline_description}</span>
                  <a
                    href={f.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-sky-400 hover:underline font-semibold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB E: RESEARCH SUPERVISORS (PHASE 9)                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'supervisors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supervisors.map((s) => (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 ${
                isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono ${
                    s.recruitment_status === 'confirmed_open'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {s.recruitment_status === 'confirmed_open' ? '🟢 Confirmed Open Position' : 'General Research Fit'}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                <h3 className="font-bold text-base">{s.name}</h3>
                <p className="text-xs opacity-75">{s.designation} • {s.department}</p>
                <p className="text-xs text-sky-400 font-medium">{s.university_name}</p>

                {s.lab_name && (
                  <p className="text-[11px] opacity-70 mt-1 italic">Lab: {s.lab_name}</p>
                )}

                <div className="mt-3 flex flex-col gap-1 text-xs">
                  <span className="font-semibold text-[11px]">Research Interests:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {s.research_interests.map((ri, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-[#161b22] text-stone-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ri}
                      </span>
                    ))}
                  </div>
                </div>

                {s.recent_publications && s.recent_publications.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl text-[11px] opacity-80 border border-stone-800/40">
                    <span className="font-semibold text-[10px] text-amber-400 block mb-1">Recent Publication:</span>
                    <p className="line-clamp-2">"{s.recent_publications[0].title}" ({s.recent_publications[0].venue})</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-800/20 flex items-center justify-between text-xs">
                {s.email && (
                  <span className="text-[11px] font-mono opacity-70 truncate max-w-[150px]">{s.email}</span>
                )}
                <a
                  href={s.faculty_profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 ml-auto"
                >
                  <span>Faculty Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB F: ADMISSION DEADLINES (PHASE 16)                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'deadlines' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {deadlines.map((d, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{d.title}</h4>
                    <p className="text-xs opacity-75">{d.university} ({d.country})</p>
                    <p className="text-[11px] text-amber-400 font-mono mt-1">Deadline: {d.deadline_text}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {d.days_left !== undefined && d.days_left !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                      d.days_left <= 30
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {d.days_left} Days Left
                    </span>
                  )}
                  <a
                    href={d.portal_url || d.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB G: MY SHORTLIST (PHASE 13)                                            */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'shortlist' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="opacity-75">
              You have <strong>{shortlist.length}</strong> saved doctoral opportunities in your private shortlist.
            </span>
            <a
              href={api.phd.getShortlistExportUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Shortlist to CSV</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortlist.map((item) => {
              const p = item.programme_details;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        item.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <button
                        onClick={() => api.phd.removeFromShortlist(item.id).then(() => setShortlist(prev => prev.filter(s => s.id !== item.id)))}
                        className="text-stone-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm">{p?.title || 'Saved Opportunity'}</h4>
                    <p className="text-xs opacity-75">{p?.university_name} ({p?.country})</p>

                    {item.notes && (
                      <p className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded-lg mt-2">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800/20 text-xs">
                    <button
                      onClick={() => p && handleStartApplication(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Track Application
                    </button>
                    {p?.official_url && (
                      <a href={p.official_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-xs">
                        <span>Official URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {shortlist.length === 0 && (
            <div className={`p-10 text-center rounded-2xl border flex flex-col items-center gap-2 ${
              isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
            }`}>
              <Bookmark className="w-8 h-8 opacity-40 text-rose-400" />
              <p className="text-xs opacity-75">Your shortlist is currently empty. Click the bookmark icon on any programme to save it.</p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB H: MY APPLICATION TRACKER (PHASE 14)                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'applications' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="opacity-75">
              Tracking <strong>{applications.length}</strong> active university applications across 15 admission milestones.
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`p-5 rounded-2xl border flex flex-col gap-4 ${
                  isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base">{app.programme_title}</h3>
                    <p className="text-xs opacity-75">{app.university_name} ({app.country})</p>
                  </div>

                  {/* Stage Selector */}
                  <select
                    value={app.stage}
                    onChange={(e) => {
                      const nextStage = e.target.value as ApplicationStage;
                      api.phd.updateApplication(app.id, { stage: nextStage }).then(() => {
                        setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stage: nextStage } : a));
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono outline-hidden cursor-pointer ${
                      isDark ? 'bg-[#161b22] border-stone-700 text-sky-400' : 'bg-slate-50 border-slate-200 text-sky-700'
                    }`}
                  >
                    <option value="interested">1. Interested</option>
                    <option value="researching">2. Researching Requirements</option>
                    <option value="eligibility_checked">3. Eligibility Checked</option>
                    <option value="supervisor_identified">4. Supervisor Identified</option>
                    <option value="supervisor_contacted">5. Supervisor Contacted</option>
                    <option value="documents_preparing">6. Documents Being Prepared</option>
                    <option value="in_progress">7. Application In Progress</option>
                    <option value="submitted">8. Application Submitted</option>
                    <option value="interview_scheduled">9. Interview Scheduled</option>
                    <option value="offer_received">10. Offer Received 🎉</option>
                    <option value="waitlisted">11. Waitlisted</option>
                    <option value="rejected">12. Rejected</option>
                    <option value="accepted">13. Offer Accepted ❤️</option>
                    <option value="declined">14. Offer Declined</option>
                    <option value="withdrawn">15. Withdrawn</option>
                  </select>
                </div>

                {/* Document Checklist for this application */}
                {app.documents && app.documents.length > 0 && (
                  <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    isDark ? 'bg-[#161b22] border-stone-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-xs font-bold flex items-center gap-1.5 text-sky-400">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Application Document Checklist:</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {app.documents.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleToggleDocStatus(doc.id, doc.status)}
                          className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                            doc.status === 'submitted' || doc.status === 'ready'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : doc.status === 'in_progress'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : isDark ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="text-[11px] truncate mr-2">{doc.name}</span>
                          <span className="text-[10px] font-bold font-mono uppercase shrink-0">
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {applications.length === 0 && (
            <div className={`p-10 text-center rounded-2xl border flex flex-col items-center gap-2 ${
              isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
            }`}>
              <FileText className="w-8 h-8 opacity-40 text-emerald-400" />
              <p className="text-xs opacity-75">No applications tracked yet. Start tracking any programme by clicking "Track Application" on a programme card.</p>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB I: ELIGIBILITY ASSESSMENT (PHASE 11)                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'eligibility' && (
        <div className="flex flex-col gap-5">
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Personalized Compatibility Assessment</span>
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Evaluated against profile: <strong>{profile?.degree_title} ({profile?.specialization})</strong> • CGPA: {profile?.cgpa_or_percent} • GATE: {profile?.has_gate ? 'Yes' : 'No'}
              </p>
            </div>

            <button
              onClick={() => setShowProfileEditModal(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Update Profile Credentials
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibilityResults.map((r, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                  isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono ${
                      r.category === 'strong_match'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : r.category === 'potential_match'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {r.category_label}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono">Verified</span>
                  </div>

                  <h4 className="font-bold text-sm">{r.programme_title}</h4>
                  <p className="text-xs opacity-75">{r.university_name} ({r.country})</p>

                  <div className="mt-3 flex flex-col gap-1.5 text-xs">
                    {r.matched_criteria.map((m, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                    {r.unmatched_criteria.map((u, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-amber-400 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{u}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] opacity-70">{r.funding_status}</span>
                  <a href={r.official_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 font-semibold">
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {eligibilityResults.length === 0 && (
            <div className={`p-10 text-center rounded-2xl border flex flex-col items-center gap-3 ${
              isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
            }`}>
              <ShieldCheck className="w-10 h-10 opacity-40 text-amber-400" />
              <p className="text-xs opacity-75">Click "Check My Eligibility" at the top to evaluate all database programmes against your credentials.</p>
              <button
                onClick={handleRunEligibilityAssessment}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs cursor-pointer"
              >
                Run Assessment Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB J: AI RESEARCH ADVISOR (PHASE 17)                                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'ai_advisor' && (
        <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${
          isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2 text-yellow-300">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>AI-Assisted PhD Research Advisor</span>
            </h3>
            <p className="text-xs opacity-75 mt-0.5">
              Ask natural-language queries about PhD options. Grounded exclusively in verified database records and official university portal links.
            </p>
          </div>

          {/* Sample Query Chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="opacity-60 text-[11px]">Try asking:</span>
            {[
              "Find PhD programmes in Data Engineering in India",
              "Find funded AI PhD opportunities in Germany",
              "Compare IISc and IIT Bombay for data systems",
              "Show programmes accepting M.Tech without GRE"
            ].map((sq, i) => (
              <button
                key={i}
                onClick={() => setAiQuery(sq)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-[#161b22] border-stone-800 hover:border-sky-500 text-stone-300' : 'bg-slate-100 border-slate-200 hover:border-sky-500 text-slate-700'
                }`}
              >
                "{sq}"
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleRunAISearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about PhD admissions, funding, or supervisor fit..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs outline-hidden ${
                isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAiLoading ? 'Synthesizing...' : 'Ask Advisor'}</span>
            </button>
          </form>

          {/* AI Advisor Response Render */}
          {aiResponse && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex flex-col gap-3 ${
              isDark ? 'bg-[#161b22] border-stone-800 text-stone-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="whitespace-pre-line font-sans">{aiResponse}</div>

              {aiMatchedProgrammes.length > 0 && (
                <div className="pt-3 border-t border-stone-800/20 flex flex-col gap-2">
                  <span className="font-bold text-[11px] text-sky-400">Directly Grounded Programmes:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiMatchedProgrammes.map((p, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                        isDark ? 'bg-[#0d1117] border-stone-800' : 'bg-white border-slate-200'
                      }`}>
                        <div>
                          <div className="font-bold">{p.title}</div>
                          <div className="text-[10px] opacity-75">{p.university_name}</div>
                        </div>
                        {p.official_programme_url && (
                          <a href={p.official_programme_url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]">
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS (PROGRAMME DETAILS, COMPARISON MATRIX, PROFILE EDIT)            */}
      {/* ========================================================================= */}

      {/* Programme Detail Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 flex flex-col gap-5 shadow-2xl ${
            isDark ? 'bg-[#0d1117] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-3 border-b border-stone-800/20 pb-3">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-bold font-mono">
                  {selectedProgramme.degree_type} • {selectedProgramme.department}
                </span>
                <h2 className="text-xl font-bold mt-1.5">{selectedProgramme.title}</h2>
                <p className="text-xs opacity-75">{selectedProgramme.university_name} — {selectedProgramme.city}, {selectedProgramme.country}</p>
              </div>
              <button
                onClick={() => setSelectedProgramme(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <h4 className="font-bold text-sky-400 mb-1">Academic Eligibility Requirements:</h4>
                <p className="opacity-80 leading-relaxed">{selectedProgramme.eligibility_criteria}</p>
              </div>

              {selectedProgramme.mtech_details && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <h4 className="font-bold text-[11px] mb-0.5">M.Tech / Post-Graduate Recognition:</h4>
                  <p>{selectedProgramme.mtech_details}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-bold text-emerald-400 text-[11px] mb-1">Funding &amp; Stipend:</h4>
                  <p className="font-mono">{selectedProgramme.stipend_amount || 'Fully Funded'}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">{selectedProgramme.funding_details}</p>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-bold text-amber-400 text-[11px] mb-1">Admission Deadlines:</h4>
                  <p className="font-mono">{selectedProgramme.application_deadline}</p>
                  <p className="text-[11px] opacity-75 mt-0.5">Intake: {selectedProgramme.intake_term}</p>
                </div>
              </div>

              {selectedProgramme.required_documents && (
                <div>
                  <h4 className="font-bold text-sky-400 mb-1.5">Required Application Documents:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProgramme.required_documents.map((doc, idx) => (
                      <div key={idx} className={`p-2 rounded-lg border flex items-center justify-between ${
                        isDark ? 'bg-[#161b22] border-stone-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span>{doc.name}</span>
                        <span className="text-[10px] font-bold font-mono opacity-70 uppercase">{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800/20">
              <a
                href={selectedProgramme.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Source Page</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleStartApplication(selectedProgramme.id);
                    setSelectedProgramme(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Track Application
                </button>
                <a
                  href={selectedProgramme.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Official Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isComparingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 flex flex-col gap-5 shadow-2xl ${
            isDark ? 'bg-[#0d1117] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-stone-800/20 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>University &amp; Programme Comparison Matrix</span>
              </h3>
              <button
                onClick={() => setIsComparingModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-stone-800/40">
                    <th className="p-2 text-left font-bold opacity-60 w-36">Criteria</th>
                    {comparisonMatrix.map(m => (
                      <th key={m.id} className="p-2 text-left font-bold text-sky-400 max-w-xs">{m.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/20">
                  <tr>
                    <td className="p-2 font-semibold opacity-70">University</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2">{m.university}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Country</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2">{m.country} ({m.city})</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Funding</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2 text-emerald-400 font-bold">{m.funding_status}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Stipend</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2 font-mono">{m.stipend}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Tuition Fees</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2">{m.tuition_fees}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Deadline</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2 text-amber-400 font-mono">{m.application_deadline}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">M.Tech Priority</td>
                    {comparisonMatrix.map(m => <td key={m.id} className="p-2">{m.mtech_accepted}</td>)}
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold opacity-70">Verified Source</td>
                    {comparisonMatrix.map(m => (
                      <td key={m.id} className="p-2">
                        <a href={m.official_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                          <span>Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEditModal && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-4 shadow-2xl text-xs ${
            isDark ? 'bg-[#0d1117] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-stone-800/20 pb-3">
              <h3 className="font-bold text-sm">Update Academic Credentials</h3>
              <button onClick={() => setShowProfileEditModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="font-semibold block mb-1">Degree Title:</label>
                <input
                  type="text"
                  value={profile.degree_title}
                  onChange={(e) => setProfile({ ...profile, degree_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Specialization:</label>
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">CGPA / Percentage:</label>
                  <input
                    type="text"
                    value={profile.cgpa_or_percent}
                    onChange={(e) => setProfile({ ...profile, cgpa_or_percent: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Has GATE Score:</label>
                  <select
                    value={profile.has_gate ? 'true' : 'false'}
                    onChange={(e) => setProfile({ ...profile, has_gate: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent"
                  >
                    <option value="true">Yes (Valid GATE)</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-800/20">
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="px-3 py-1.5 rounded-lg border cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  api.phd.updateProfile(profile).then(() => {
                    setShowProfileEditModal(false);
                    handleRunEligibilityAssessment();
                  });
                }}
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer"
              >
                Save &amp; Re-Assess
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
