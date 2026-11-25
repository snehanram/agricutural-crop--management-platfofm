import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Square, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppShell, type NavSection } from './components/AppShell';
import { AuthPage } from './components/AuthPage';
import { FarmSetupWizard } from './components/FarmSetupWizard';
import { PlantDoctorAgent } from './components/PlantDoctorAgent';
import { PublicWeatherSection } from './components/PublicWeatherSection';
import { WebsiteHome } from './components/WebsiteHome';
import { WebsiteLayout, type WebsitePage } from './components/WebsiteLayout';
import type { CropCategory } from './data/cropKnowledge';
import { api, getAuthToken, setAuthToken, setUnauthorizedHandler } from './lib/api';
import { playTextInLanguage, stopActiveSpeech } from './utils/voiceSpeech';
import { CropGuidePage } from './pages/CropGuidePage';
import { CropsPage } from './pages/CropsPage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmsFieldsPage } from './pages/FarmsFieldsPage';
import { FertilizerPage } from './pages/FertilizerPage';
import { HarvestPage } from './pages/HarvestPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { NearbyPlacesPage } from './pages/NearbyPlacesPage';
import { PestPage } from './pages/PestPage';
import { ReportsPage } from './pages/ReportsPage';
import { WeatherPage } from './pages/WeatherPage';
import type {
  Crop,
  DashboardData,
  DemoLocationOption,
  Farm,
  Farmer,
  FarmWeatherReport,
  FertilizerRecord,
  Field,
  HarvestRecord,
  IrrigationRecord,
  LanguageCode,
  PestObservation,
  WeatherAlertSettings,
} from './types';

type ViewMode = 'website' | 'auth' | 'portal';

export default function App() {
  const { t, i18n } = useTranslation();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('website');
  const [websitePage, setWebsitePage] = useState<WebsitePage>('home');
  const [guideInitialCategory, setGuideInitialCategory] = useState<'all' | CropCategory>('all');
  const [demoLoading, setDemoLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [demoLocation, setDemoLocation] = useState<DemoLocationOption | null>(null);
  const [setupSkipped, setSetupSkipped] = useState(false);
  const [forceShowSetup, setForceShowSetup] = useState(false);
  const [dataLoadedFarmerId, setDataLoadedFarmerId] = useState<number | null>(null);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [irrigations, setIrrigations] = useState<IrrigationRecord[]>([]);
  const [fertilizers, setFertilizers] = useState<FertilizerRecord[]>([]);
  const [pests, setPests] = useState<PestObservation[]>([]);
  const [harvests, setHarvests] = useState<HarvestRecord[]>([]);
  const [weatherReports, setWeatherReports] = useState<FarmWeatherReport[]>([]);
  const [weatherSettings, setWeatherSettings] = useState<WeatherAlertSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [doctorGuideSpeaking, setDoctorGuideSpeaking] = useState(false);
  const [doctorGuideLoading, setDoctorGuideLoading] = useState(false);
  const doctorAudioRef = useRef<HTMLAudioElement | null>(null);
  const doctorSpeechAbortRef = useRef<boolean>(false);

  const stopDoctorGuideVoice = useCallback(() => {
    stopActiveSpeech({
      audioRef: doctorAudioRef,
      abortRef: doctorSpeechAbortRef,
      onLoadingChange: setDoctorGuideLoading,
      onSpeakingChange: setDoctorGuideSpeaking,
    });
  }, []);

  useEffect(() => {
    stopDoctorGuideVoice();
  }, [i18n.language, websitePage, viewMode, stopDoctorGuideVoice]);

  const handleToggleDoctorGuideVoice = useCallback(async () => {
    if (doctorGuideSpeaking || doctorGuideLoading) {
      stopDoctorGuideVoice();
      return;
    }
    const lang = (i18n.language || 'en').trim() as LanguageCode;
    await playTextInLanguage({
      text: `${t('website.navPlantDoctor')}. ${t('website.pestVoiceGuideIntro')}`,
      language: lang,
      onLoadingChange: setDoctorGuideLoading,
      onSpeakingChange: setDoctorGuideSpeaking,
      audioRef: doctorAudioRef,
      abortRef: doctorSpeechAbortRef,
    });
  }, [doctorGuideSpeaking, doctorGuideLoading, stopDoctorGuideVoice, i18n.language, t]);

  const handleLogout = useCallback(() => {
    setAuthToken(null);
    setFarmer(null);
    setDemoLocation(null);
    setSetupSkipped(false);
    setForceShowSetup(false);
    setDataLoadedFarmerId(null);
    setDashboard(null);
    setFarms([]);
    setFields([]);
    setCrops([]);
    setIrrigations([]);
    setFertilizers([]);
    setPests([]);
    setHarvests([]);
    setWeatherReports([]);
    setViewMode('website');
    setWebsitePage('home');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(handleLogout);
  }, [handleLogout]);

  const loadAllFarmData = useCallback(async (targetFarmerId?: number) => {
    setLoadingData(true);
    try {
      const [
        dashRes,
        farmsRes,
        fieldsRes,
        cropsRes,
        irrRes,
        fertRes,
        pestRes,
        harvRes,
        weatherRes,
      ] = await Promise.all([
        api.getDashboard(),
        api.getFarms(),
        api.getFields(),
        api.getCrops(),
        api.getIrrigations(),
        api.getFertilizers(),
        api.getPests(),
        api.getHarvests(),
        api.getWeather(),
      ]);

      setDashboard(dashRes);
      setFarms(farmsRes.farms);
      setFields(fieldsRes.fields);
      setCrops(cropsRes.crops);
      setIrrigations(irrRes.irrigations);
      setFertilizers(fertRes.fertilizers);
      setPests(pestRes.pests);
      setHarvests(harvRes.harvests);
      setWeatherReports(weatherRes.reports);
      setWeatherSettings(weatherRes.settings);
      if (typeof targetFarmerId === 'number') {
        setDataLoadedFarmerId(targetFarmerId);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    api
      .me()
      .then((res) => {
        if (!res.farmer) {
          setAuthToken(null);
          return;
        }
        const savedLocal = localStorage.getItem('krishifield_lang');
        if (savedLocal && /^[a-z]{2,8}(-[A-Za-z0-9]+)?$/.test(savedLocal)) {
          setFarmer({ ...res.farmer, preferred_language: savedLocal });
          if (i18n.language !== savedLocal) {
            void i18n.changeLanguage(savedLocal);
          }
          if (res.farmer.preferred_language !== savedLocal) {
            void api.updatePreferences({ preferred_language: savedLocal }).catch(() => {});
          }
        } else {
          setFarmer(res.farmer);
          if (res.farmer.preferred_language) {
            void i18n.changeLanguage(res.farmer.preferred_language);
            localStorage.setItem('krishifield_lang', res.farmer.preferred_language);
          }
        }
      })
      .catch(() => {
        setAuthToken(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const farmerId = farmer?.id ?? null;

  // Depend strictly on farmerId so language / profile updates never trigger a full data reload
  useEffect(() => {
    if (farmerId !== null) {
      void loadAllFarmData(farmerId);
    }
  }, [farmerId, loadAllFarmData]);

  const handleAuthenticated = useCallback(
    (loggedInFarmer: Farmer, options?: { demoLocation?: DemoLocationOption }) => {
      setDemoLocation(options?.demoLocation ?? null);
      setSetupSkipped(false);
      setForceShowSetup(false);
      setDataLoadedFarmerId(null);
      setActiveSection('dashboard');
      setViewMode('portal');

      const savedLocal = localStorage.getItem('krishifield_lang');
      const resolvedLang =
        savedLocal && /^[a-z]{2,8}(-[A-Za-z0-9]+)?$/.test(savedLocal)
          ? savedLocal
          : loggedInFarmer.preferred_language || 'en';

      setFarmer({ ...loggedInFarmer, preferred_language: resolvedLang });
      if (i18n.language !== resolvedLang) {
        void i18n.changeLanguage(resolvedLang);
      }
      localStorage.setItem('krishifield_lang', resolvedLang);
      if (loggedInFarmer.preferred_language !== resolvedLang) {
        void api.updatePreferences({ preferred_language: resolvedLang }).catch(() => {});
      }
    },
    [i18n]
  );

  const handleStartDemo = useCallback(async () => {
    if (farmer) {
      setViewMode('portal');
      return;
    }
    setDemoLoading(true);
    try {
      const currentLang = i18n.language?.trim() || 'en';
      const res = await api.demoLogin(currentLang);
      setAuthToken(res.token);
      handleAuthenticated(res.farmer, { demoLocation: res.demoLocation });
    } catch {
      setViewMode('auth');
    } finally {
      setDemoLoading(false);
    }
  }, [farmer, i18n.language, handleAuthenticated]);

  const handleRerollDemo = useCallback(async () => {
    setDemoLoading(true);
    try {
      const currentLang = i18n.language?.trim() || 'en';
      const res = await api.demoLogin(currentLang);
      setAuthToken(res.token);
      setDemoLocation(res.demoLocation ?? null);
      setFarmer({ ...res.farmer, preferred_language: currentLang });
      await loadAllFarmData(res.farmer.id);
    } finally {
      setDemoLoading(false);
    }
  }, [i18n.language, loadAllFarmData]);

  const handlePersistLanguage = async (lang: LanguageCode) => {
    setFarmer((prev) => (prev ? { ...prev, preferred_language: lang } : prev));
    if (!farmer) return;
    try {
      await api.updatePreferences({ preferred_language: lang });
    } catch {
      // Language already applied client-side without interrupting session
    }
  };

  const handleRefreshData = useCallback(async () => {
    await loadAllFarmData(farmer?.id);
  }, [farmer?.id, loadAllFarmData]);

  const handleWebsiteNavigate = (page: WebsitePage, options?: { category?: 'all' | CropCategory }) => {
    if (options?.category !== undefined) {
      setGuideInitialCategory(options.category);
    } else if (page === 'guide' && websitePage !== 'guide') {
      setGuideInitialCategory('all');
    }
    setWebsitePage(page);
    setViewMode('website');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'auth' && !farmer) {
    return (
      <AuthPage
        onAuthenticated={handleAuthenticated}
        onBackToWebsite={() => setViewMode('website')}
      />
    );
  }

  if (viewMode === 'portal' && farmer) {
    const activeAlertCount = weatherReports.reduce(
      (count, report) =>
        count + report.alerts.filter((a) => !report.acknowledgedKeys.includes(a.alertKey)).length,
      0
    );

    const showSetupWizard =
      dataLoadedFarmerId === farmer.id &&
      !setupSkipped &&
      (forceShowSetup || fields.length === 0);

    return (
      <AppShell
        farmer={farmer}
        activeSection={activeSection}
        onNavigate={(section) => {
          setForceShowSetup(false);
          setActiveSection(section);
        }}
        onLogout={handleLogout}
        onBackToWebsite={() => {
          setViewMode('website');
          setWebsitePage('home');
        }}
        onPersistLanguage={handlePersistLanguage}
        activeAlertCount={activeAlertCount}
      >
        {showSetupWizard ? (
          <FarmSetupWizard
            farmer={farmer}
            demoLocation={demoLocation}
            onCompleted={async (updatedLocation) => {
              setFarmer((prev) => (prev ? { ...prev, location: updatedLocation } : prev));
              setSetupSkipped(true);
              setForceShowSetup(false);
              await loadAllFarmData(farmer.id);
              setActiveSection('dashboard');
            }}
            onSkip={() => {
              setSetupSkipped(true);
              setForceShowSetup(false);
            }}
          />
        ) : (
          <>
            {activeSection === 'dashboard' && (
              <DashboardPage
                data={dashboard}
                weatherReports={weatherReports}
                crops={crops}
                loading={loadingData}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
                hasFields={fields.length > 0}
                isDemoFarmer={farmer.email === 'demo@krishifield.app'}
                onRerollDemo={handleRerollDemo}
                rerollingDemo={demoLoading}
                onOpenSetup={() => {
                  setSetupSkipped(false);
                  setForceShowSetup(true);
                }}
              />
            )}

            {activeSection === 'guide' && (
              <CropGuidePage
                farms={farms}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
                isAuthenticated={true}
              />
            )}

            {activeSection === 'nearby' && (
              <NearbyPlacesPage
                farms={farms}
                farmerLocation={farmer.location}
                isDemoFarmer={farmer.email === 'demo@krishifield.app'}
                farmerPhone={farmer.phone}
                isAuthenticated={true}
                onUpdatePhone={(phone) => setFarmer((prev) => (prev ? { ...prev, phone } : prev))}
              />
            )}

            {activeSection === 'weather' && (
              <WeatherPage
                reports={weatherReports}
                settings={weatherSettings}
                loading={loadingData}
                onRefresh={handleRefreshData}
              />
            )}

            {activeSection === 'farms' && (
              <FarmsFieldsPage farms={farms} fields={fields} onRefresh={handleRefreshData} />
            )}

            {activeSection === 'crops' && (
              <CropsPage
                crops={crops}
                fields={fields}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'irrigation' && (
              <IrrigationPage
                irrigations={irrigations}
                fields={fields}
                crops={crops}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'fertilizers' && (
              <FertilizerPage
                fertilizers={fertilizers}
                fields={fields}
                crops={crops}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'pests' && (
              <PestPage
                pests={pests}
                fields={fields}
                crops={crops}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'harvests' && (
              <HarvestPage
                harvests={harvests}
                fields={fields}
                crops={crops}
                onRefresh={handleRefreshData}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'reports' && (
              <ReportsPage
                farmer={farmer}
                dashboard={dashboard}
                fields={fields}
                crops={crops}
                irrigations={irrigations}
                fertilizers={fertilizers}
                pests={pests}
                harvests={harvests}
              />
            )}
          </>
        )}
      </AppShell>
    );
  }

  return (
    <WebsiteLayout
      activePage={websitePage}
      onNavigatePage={(page) => handleWebsiteNavigate(page)}
      onOpenAuth={() => setViewMode('auth')}
      onStartDemo={() => void handleStartDemo()}
      onOpenPortal={() => setViewMode('portal')}
      farmer={farmer}
      demoLoading={demoLoading}
      onPersistLanguage={handlePersistLanguage}
    >
      {websitePage === 'home' && (
        <WebsiteHome
          farmer={farmer}
          demoLoading={demoLoading}
          onNavigatePage={handleWebsiteNavigate}
          onStartDemo={() => void handleStartDemo()}
          onOpenAuth={() => setViewMode('auth')}
          onOpenPortal={() => setViewMode('portal')}
        />
      )}

      {websitePage === 'doctor' && (
        <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14221B]">
                {t('website.navPlantDoctor')}
              </h1>
              <p className="text-sm sm:text-base text-[#42544B]">
                {t('website.pestUploadPicDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleToggleDoctorGuideVoice()}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-lg border border-[#CBE2D0] bg-white px-4 py-2 text-sm font-semibold text-[#14532D] hover:bg-[#ECFDF3] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {doctorGuideLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#15803D]" />
              ) : doctorGuideSpeaking ? (
                <Square className="h-3.5 w-3.5 text-[#15803D]" />
              ) : (
                <Volume2 className="h-4 w-4 text-[#15803D]" />
              )}
              <span>
                {doctorGuideLoading
                  ? t('website.pestVoiceLoading')
                  : doctorGuideSpeaking
                  ? t('website.pestStopListenBtn')
                  : t('website.pestVoiceGuideBtn')}
              </span>
            </button>
          </div>
          <PlantDoctorAgent mode="public" />
        </div>
      )}

      {websitePage === 'guide' && (
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <CropGuidePage
            farms={farms}
            onRefresh={handleRefreshData}
            initialCategory={guideInitialCategory}
            isAuthenticated={Boolean(farmer)}
            onNavigate={(section) => {
              if (section === 'weather') {
                handleWebsiteNavigate('weather');
              } else if (farmer) {
                setActiveSection(section);
                setViewMode('portal');
              } else {
                setViewMode('auth');
              }
            }}
            onRequireAuth={(mode) => {
              if (mode === 'demo') {
                void handleStartDemo();
              } else {
                setViewMode('auth');
              }
            }}
          />
        </div>
      )}

      {websitePage === 'nearby' && (
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <NearbyPlacesPage
            farms={farms}
            farmerLocation={farmer?.location}
            isDemoFarmer={farmer?.email === 'demo@krishifield.app'}
            farmerPhone={farmer?.phone}
            isAuthenticated={Boolean(farmer)}
            onUpdatePhone={(phone) => setFarmer((prev) => (prev ? { ...prev, phone } : prev))}
          />
        </div>
      )}

      {websitePage === 'weather' && (
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          {farmer && weatherReports.length > 0 ? (
            <WeatherPage
              reports={weatherReports}
              settings={weatherSettings}
              loading={loadingData}
              onRefresh={handleRefreshData}
            />
          ) : (
            <PublicWeatherSection />
          )}
        </div>
      )}
    </WebsiteLayout>
  );
}
