import { Language } from '../types';

export interface Translations {
  // Common & Branding
  appName: string;
  appSubtitle: string;
  ministry: string;
  ashaAnmTitle: string;
  online: string;
  offline: string;
  offlineBanner: string;
  lowBandwidthBanner: string;
  selectLanguage: string;
  profile: string;
  logout: string;
  syncStatus: string;
  allBeneficiaries: string;
  cancel: string;
  save: string;
  confirm: string;
  close: string;
  back: string;
  verified: string;
  call: string;
  loading: string;
  success: string;
  error: string;

  // Bottom Nav
  navHome: string;
  navPatients: string;
  navFollowUps: string;
  navVitals: string;

  // Screen Titles
  titleHome: string;
  titleBeneficiary: string;
  titleVitals: string;
  titleAssessment: string;
  titleReferral: string;
  titlePatients: string;

  // Login Screen
  loginTitle: string;
  loginWelcome: string;
  loginInstruction: string;
  workerIdLabel: string;
  workerIdPlaceholder: string;
  pinLabel: string;
  pinPlaceholder: string;
  forgotPin: string;
  quickDemoFill: string;
  loginButton: string;
  loggingIn: string;
  loginSuccess: string;
  loginFailed: string;
  otpLogin: string;
  localDataEncrypted: string;
  healthMissionSubtitle: string;
  loginGovtFooter: string;

  // Beneficiary Screen
  abhaVerified: string;
  abhaIdLabel: string;
  rchIdLabel: string;
  husbandLabel: string;
  callingToast: string;
  highRiskBadge: string;
  highRiskTitle: string;
  highRisk: string;
  normal: string;
  viewProtocol: string;
  gestationalAge: string;
  gravida: string;
  lmpDate: string;
  eddDate: string;
  vitalsSummary: string;
  bloodPressure: string;
  pulseRate: string;
  oxygenSpO2: string;
  temperature: string;
  bodyWeight: string;
  bloodSugar: string;
  recordNewVitalsBtn: string;
  cdssAssessmentBtn: string;
  teleconsultBtn: string;
  trackReferralBtn: string;
  clinicalProtocolModalTitle: string;

  // Record Vitals Screen
  vitalsScreenTitle: string;
  vitalsFormStep: string;
  bhashiniVoiceInput: string;
  bhashiniListening: string;
  autoFillPrevious: string;
  autoFillToast: string;
  systolicLabel: string;
  systolicHint: string;
  diastolicLabel: string;
  diastolicHint: string;
  tempLabel: string;
  pulseLabel: string;
  spo2Label: string;
  weightLabel: string;
  rbsLabel: string;
  clinicalNotesLabel: string;
  clinicalNotesPlaceholder: string;
  saveAndAssessBtn: string;
  vitalsSavedToast: string;
  highBpAlert: string;
  feverAlert: string;
  lowOxygenAlert: string;

  // Risk Assessment Screen
  cdssHeader: string;
  cdssStep1: string;
  cdssStep2: string;
  cdssStep3: string;
  redFlagsChecklist: string;
  flagBreathing: string;
  flagHeadache: string;
  flagConfusion: string;
  flagBleeding: string;
  flagHighBp: string;
  emrVerifiedRecord: string;
  highRiskAlertTitle: string;
  highRiskRationaleHeader: string;
  highRiskAdvice: string;
  voiceGuidanceBtn: string;
  callAmbulanceBtn: string;
  dispatchReferralBtn: string;
  teleconsultDoctorBtn: string;

  // Referral Tracking Screen
  criticalReferralBadge: string;
  ambulanceEnRoute: string;
  etaMinutes: string;
  arrivedAtGate: string;
  referralManagementTitle: string;
  referralClosedLoopSubtitle: string;
  targetFacilityLabel: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  confirmArrivalBtn: string;
  shareWhatsAppBtn: string;
  teleconsultOfficerBtn: string;
  smsSentToast: string;

  // Patients Directory Screen
  directoryTitle: string;
  directorySubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterHighRisk: string;
  filterNormal: string;
  totalBeneficiaries: string;
  viewPatientDetails: string;

  // Home Screen & New Registration
  homeGreeting: string;
  homeSubCenter: string;
  quickActions: string;
  newRegistrationBtn: string;
  newRegistrationDesc: string;
  quickVitalsBtn: string;
  quickVitalsDesc: string;
  sosAmbulanceBtn: string;
  sosAmbulanceDesc: string;
  teleconsultQuickBtn: string;
  maternalHealthStats: string;
  totalMothers: string;
  highRiskFlagged: string;
  deliveriesMonth: string;
  visitsDueToday: string;
  homeHighRiskAlertTitle: string;
  homeHighRiskAlertSubtitle: string;
  todaysFieldTasks: string;
  recentBeneficiariesTitle: string;
  viewFullDirectory: string;
  registerMotherTitle: string;
  registerMotherSubtitle: string;
  personalDetails: string;
  obstetricHistory: string;
  nationalHealthIds: string;
  motherNameLabel: string;
  motherAgeLabel: string;
  motherPhoneLabel: string;
  husbandNameLabel: string;
  villageLabel: string;
  subCenterLabel: string;
  lmpLabel: string;
  eddLabel: string;
  gestationalAgeLabel: string;
  gravidaLabel: string;
  parityLabel: string;
  generateAbhaBtn: string;
  highRiskChecklist: string;
  initialVitalsTitle: string;
  completeRegistrationBtn: string;
  registrationSuccessToast: string;
}

export const translations: Record<Language, Translations> = {
  mr: {
    // Common & Branding
    appName: 'संजीवन-नेट',
    appSubtitle: 'आशा आणि एएनएम माता आरोग्य प्रणाली',
    ministry: 'सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन',
    ashaAnmTitle: 'आशा / एएनएम • NRHM',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन मोड',
    offlineBanner: 'ऑफलाइन मोड: सर्व नोंदी सुरक्षित जतन केल्या आहेत. नेटवर्क आल्यावर आपोआप सिंक होतील.',
    lowBandwidthBanner: 'कमी-बँडविड्थ मोड सक्रिय.',
    selectLanguage: 'भाषा निवडा',
    profile: 'माझे प्रोफाइल',
    logout: 'लॉगआउट',
    syncStatus: 'डेटा सिंक स्थिती',
    allBeneficiaries: 'सर्व माता यादी',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    confirm: 'नक्की करा',
    close: 'बंद करा',
    back: 'मागे',
    verified: 'सत्यापित',
    call: 'कॉल करा',
    loading: 'लोड होत आहे...',
    success: 'यशस्वी',
    error: 'त्रुटी आली',

    // Bottom Nav
    navHome: 'मुख्य',
    navPatients: 'माता यादी',
    navFollowUps: 'फॉलो-अप',
    navVitals: 'वाइटल्स',

    // Screen Titles
    titleHome: 'आशा डॅशबोर्ड',
    titleBeneficiary: 'मातेची माहिती',
    titleVitals: 'वाइटल्स नोंदवा',
    titleAssessment: 'धोका मूल्यांकन',
    titleReferral: 'रेफरल ट्रॅकिंग',
    titlePatients: 'सर्व मातांची यादी',

    // Login Screen
    loginTitle: 'आशा / एएनएम लॉगिन',
    loginWelcome: 'नमस्ते ताई! स्वागत आहे',
    loginInstruction: 'तुमच्या नोंदणीकृत आशा आयडी आणि ४-अंकी सुरक्षा पिनने लॉगिन करा.',
    workerIdLabel: 'मोबाईल नंबर किंवा आशा आयडी',
    workerIdPlaceholder: 'उदा. 9823456789 किंवा MH-ASHA-042',
    pinLabel: 'सुरक्षा पिन (४ अंक)',
    pinPlaceholder: '४ अंकी पिन टाका',
    forgotPin: 'पिन विसरलात?',
    quickDemoFill: 'डेमो वापरकर्ते (Quick Demo Fill)',
    loginButton: 'लॉगिन करा',
    loggingIn: 'प्रमाणित होत आहे...',
    loginSuccess: 'प्रवेश यशस्वी झाला!',
    loginFailed: 'लॉगिन अयशस्वी. कृपया पिन पुन्हा तपासा.',
    otpLogin: 'ओटीपीने लॉगिन करा',
    localDataEncrypted: 'स्थानिक डेटा: सुरक्षित जतन',
    healthMissionSubtitle: 'आरोग्य नोंदणी प्रणाली • महाराष्ट्र शासन',
    loginGovtFooter: 'राष्ट्रीय ग्रामीण आरोग्य अभियान • सार्वजनिक आरोग्य विभाग, महाराष्ट्र शासन',

    // Beneficiary Screen
    abhaVerified: 'ABHA सत्यापित',
    abhaIdLabel: 'ABHA आयडी',
    rchIdLabel: 'RCH आयडी',
    husbandLabel: 'पती',
    callingToast: 'कॉल केला जात आहे',
    highRiskBadge: 'अति-धोका (HIGH RISK)',
    highRiskTitle: 'गर्भधारणा उच्च रक्तदाब व प्री-एक्लॅम्पसियाची लक्षणे आढळली आहेत.',
    highRisk: 'अति-धोका',
    normal: 'सामान्य ANC',
    viewProtocol: 'प्रोटोकॉल पहा',
    gestationalAge: 'गर्भधारणा वय',
    gravida: 'गरोदरपण (Gravida)',
    lmpDate: 'शेवटची मासिक पाळी (LMP)',
    eddDate: 'अपेक्षित प्रसूती तारीख (EDD)',
    vitalsSummary: 'वाइटल्स सारांश (ताजी नोंद)',
    bloodPressure: 'रक्तदाब (BP)',
    pulseRate: 'नाडीचे ठोके',
    oxygenSpO2: 'ऑक्सिजन (SpO2)',
    temperature: 'तापमान',
    bodyWeight: 'वजन',
    bloodSugar: 'रक्त शर्करा (RBS)',
    recordNewVitalsBtn: 'नवीन वाइटल्स नोंदवा',
    cdssAssessmentBtn: 'धोका पातळी मूल्यांकन',
    teleconsultBtn: 'डॉक्टरांशी व्हिडिओ कॉल',
    trackReferralBtn: 'रुग्णालय रेफरल ट्रॅक करा',
    clinicalProtocolModalTitle: 'उच्च रक्तदाब व प्री-एक्लॅम्पसिया प्रोटोकॉल',

    // Record Vitals Screen
    vitalsScreenTitle: 'सामान्य मातृ वाइटल्स तपासणी',
    vitalsFormStep: 'पायरी २: वाइटल्स मोजा व नोंदवा',
    bhashiniVoiceInput: 'व्हॉईस इनपुट',
    bhashiniListening: 'ऐकत आहे... बोला',
    autoFillPrevious: 'मानक सामान्य वाइटल्स भरा (१२०/८० mmHg)',
    autoFillToast: 'मानक सामान्य वाइटल्स भरण्यात आले!',
    systolicLabel: 'सिस्टोलिक BP (वरचा अंक)',
    systolicHint: 'सामान्य: ११०-१२० mmHg, वाढलेला: ≥१४०',
    diastolicLabel: 'डायस्टोलिक BP (खालचा अंक)',
    diastolicHint: 'सामान्य: ७०-८० mmHg, वाढलेला: ≥९०',
    tempLabel: 'शरीराचे तापमान',
    pulseLabel: 'नाडीचे ठोके (Pulse Rate bpm)',
    spo2Label: 'ऑक्सिजन संपृक्तता (SpO2 %)',
    weightLabel: 'वजन (किलोग्रॅम kg)',
    rbsLabel: 'रँडम ब्लड शुगर (RBS mg/dL)',
    clinicalNotesLabel: 'वैद्यकीय नोंदी व लक्षणे',
    clinicalNotesPlaceholder: 'लक्षणे नमूद करा (उदा. डोकेदुखी, पायावर सूज...)',
    saveAndAssessBtn: 'वाइटल्स जतन करा आणि मूल्यांकन करा',
    vitalsSavedToast: 'वाइटल्स सुरक्षित जतन केले!',
    highBpAlert: 'चेतावणी: उच्च रक्तदाब (Hypertension) आढळला!',
    feverAlert: 'ताप आढळला: तापमान सामान्यपेक्षा जास्त आहे.',
    lowOxygenAlert: 'ऑक्सिजन पातळी कमी आहे: तातडीने लक्ष द्या!',

    // Risk Assessment Screen
    cdssHeader: 'धोका पातळी मूल्यांकन',
    cdssStep1: '१ माहिती',
    cdssStep2: '२ वाइटल्स',
    cdssStep3: '३ मूल्यांकन',
    redFlagsChecklist: 'धोकादायक लक्षणे (Red Flags Check)',
    flagBreathing: 'श्वास घेण्यास त्रास किंवा छातीत धडधड?',
    flagHeadache: 'तीव्र डोकेदुखी किंवा डोळ्यांसमोर अंधारी?',
    flagConfusion: 'भोवळ, ग्लानी किंवा शुद्ध हरपणे?',
    flagBleeding: 'पोटात तीव्र कळा किंवा रक्तस्राव?',
    flagHighBp: 'रक्तदाब (BP) > १४०/९० mmHg नोंदवला आहे?',
    emrVerifiedRecord: 'मातृ आरोग्य तपासणी नोंद',
    highRiskAlertTitle: 'अति-धोका / HIGH RISK PREGNANCY',
    highRiskRationaleHeader: 'मूल्यांकनाचा आधार (DECISION RATIONALE)',
    highRiskAdvice: 'माता उच्च रक्तदाब व प्री-एक्लॅम्पसियाच्या धोक्यात आहे. त्वरित प्राथमिक आरोग्य केंद्र (PHC) येथे १०८ रुग्णवाहिकेद्वारे पाठवा.',
    voiceGuidanceBtn: 'ध्वनी मार्गदर्शन ऐका',
    callAmbulanceBtn: '१०८ रुग्णवाहिका तात्काळ कॉल',
    dispatchReferralBtn: 'तातडीने रेफरल पाठवा (Referral Now)',
    teleconsultDoctorBtn: 'डॉक्टरांशी व्हिडिओ कॉल',

    // Referral Tracking Screen
    criticalReferralBadge: 'तात्काळ रेफरल (CRITICAL REFERRAL)',
    ambulanceEnRoute: '१०८ रुग्णवाहिका निघाली आहे',
    etaMinutes: 'पोहोचण्याची वेळ: अंदाजे',
    arrivedAtGate: 'आरोग्य केंद्राच्या गेटवर पोहोचली',
    referralManagementTitle: 'रेफरल व्यवस्थापन व ट्रॅकिंग',
    referralClosedLoopSubtitle: 'डिजिटल रेफरल प्रणाली',
    targetFacilityLabel: 'रेफरल आरोग्य केंद्र निवडा',
    step1Title: 'रेफरल तयार व पाठवले',
    step1Desc: 'आशा कार्यकर्तीने रुग्ण नोंदणी करून PHC कडे डिजिटल टोकन पाठवले.',
    step2Title: '१०८ रुग्णवाहिका रवाना',
    step2Desc: 'रुग्णवाहिका मातेकडे निघाली आहे.',
    step3Title: 'रुग्णवाहिका आगमन',
    step3Desc: 'माता प्राथमिक आरोग्य केंद्र बेलोरा येथे सुरक्षित पोहोचली.',
    step4Title: 'वैद्यकीय अधिकारी तपासणी व दाखल',
    step4Desc: 'डॉ. अनिता शर्मा यांच्याकडून तात्काळ उपचार व दाखल प्रक्रिया सुरू.',
    confirmArrivalBtn: 'आगमन नोंदवा (Confirm Arrival)',
    shareWhatsAppBtn: 'व्हॉट्सॲप रेफरल स्लिप पाठवा',
    teleconsultOfficerBtn: 'डॉक्टरांशी संपर्क करा',
    smsSentToast: 'कुटुंबीयांना व आशा सुपरवायझरला एसएमएस पाठवला!',

    // Patients Directory Screen
    directoryTitle: 'सर्व गर्भवती मातांची यादी',
    directorySubtitle: 'पंजीकृत माता (Sub-Center Khairi)',
    searchPlaceholder: 'नाव, गाव किंवा ABHA आयडीने शोधा...',
    filterAll: 'सर्व माता',
    filterHighRisk: 'अति-धोका',
    filterNormal: 'सामान्य',
    totalBeneficiaries: 'एकूण नोंदणी',
    viewPatientDetails: 'तपशील पहा',

    // Home Screen & New Registration
    homeGreeting: 'नमस्ते, संगीता ताई!',
    homeSubCenter: 'करजगाव उपकेंद्र ०४ • प्रभाग ३',
    quickActions: 'जलद कृती व सेवा',
    newRegistrationBtn: 'नवीन गर्भवती नोंदणी',
    newRegistrationDesc: 'नवीन मातेची ABHA व RCH नोंदणी',
    quickVitalsBtn: 'वाइटल्स नोंदवा',
    quickVitalsDesc: 'रक्तदाब, वजन व नाडी दर नोंदणी',
    sosAmbulanceBtn: '१०८ तातडीचे रेफरल',
    sosAmbulanceDesc: 'तातडीची रुग्णवाहिका व पीएचसी अलर्ट',
    teleconsultQuickBtn: 'ई-संजीवनी टेलिकन्सल्ट',
    maternalHealthStats: 'मातृत्व आरोग्य आकडेवारी',
    totalMothers: 'एकूण नोंदणी',
    highRiskFlagged: 'अति-धोका माता',
    deliveriesMonth: 'या महिन्यातील प्रसूती',
    visitsDueToday: 'आजच्या प्रलंबित भेटी',
    homeHighRiskAlertTitle: 'तात्काळ लक्ष देण्याची गरज',
    homeHighRiskAlertSubtitle: 'उच्च रक्तदाब व गुंतागुंत असलेली माता',
    todaysFieldTasks: 'आजचे फील्ड वेळापत्रक व भेटी',
    recentBeneficiariesTitle: 'अलिकडील नोंदणीकृत माता',
    viewFullDirectory: 'सर्व मातांची यादी पहा',
    registerMotherTitle: 'नवीन गर्भवती महिला नोंदणी (ANC)',
    registerMotherSubtitle: 'ABHA आयडी, RCH पोर्टल व प्रसूतीपूर्व तपासणी',
    personalDetails: 'वैयक्तिक व संपर्क माहिती',
    obstetricHistory: 'प्रसूती इतिहास व गर्भधारणा',
    nationalHealthIds: 'राष्ट्रीय आरोग्य ओळख (ABHA / RCH)',
    motherNameLabel: 'मातेचे संपूर्ण नाव',
    motherAgeLabel: 'वय (वर्षे)',
    motherPhoneLabel: 'मोबाईल क्रमांक',
    husbandNameLabel: 'पतीचे नाव',
    villageLabel: 'गाव / वॉर्ड',
    subCenterLabel: 'उपकेंद्र',
    lmpLabel: 'मासिक पाळीची शेवटची तारीख (LMP)',
    eddLabel: 'संभाव्य प्रसूती तारीख (EDD)',
    gestationalAgeLabel: 'गर्भधारणा कालावधी (Gestational Age)',
    gravidaLabel: 'गर्भधारणा संख्या (Gravida)',
    parityLabel: 'मागील प्रसूती (Parity)',
    generateAbhaBtn: 'आधारने ABHA तयार / सत्यापित करा',
    highRiskChecklist: 'आरंभीक धोका तपासणी (High-Risk Screening)',
    initialVitalsTitle: 'आरंभीक वाइटल्स (Baseline Vitals)',
    completeRegistrationBtn: 'नोंदणी पूर्ण करा (Register)',
    registrationSuccessToast: 'नवीन गर्भवती मातेची नोंदणी यशस्वीरित्या जतन झाली!',
  },

  hi: {
    // Common & Branding
    appName: 'संजीवन-नेट',
    appSubtitle: 'आशा व एएनएम मातृत्व सुरक्षा पोर्टल',
    ministry: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार',
    ashaAnmTitle: 'आशा / एएनएम • NRHM',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन मोड',
    offlineBanner: 'ऑफ़लाइन मोड सक्रिय: सभी रिकॉर्ड सुरक्षित सहेजे गए हैं। नेटवर्क आने पर सिंक होंगे।',
    lowBandwidthBanner: 'कम-बैंडविड्थ मोड सक्रिय।',
    selectLanguage: 'भाषा चुनें',
    profile: 'मेरी प्रोफाइल',
    logout: 'लॉगआउट',
    syncStatus: 'डेटा सिंक स्थिति',
    allBeneficiaries: 'मरीज़ सूची',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    confirm: 'पुष्टि करें',
    close: 'बंद करें',
    back: 'वापस',
    verified: 'सत्यापित',
    call: 'कॉल करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल',
    error: 'त्रुटि हुई',

    // Bottom Nav
    navHome: 'होम',
    navPatients: 'मरीज़',
    navFollowUps: 'फॉलो-अप',
    navVitals: 'वाइटल्स',

    // Screen Titles
    titleHome: 'आशा डैशबोर्ड',
    titleBeneficiary: 'गर्भवती महिला विवरण',
    titleVitals: 'वाइटल्स दर्ज करें',
    titleAssessment: 'जोखिम मूल्यांकन',
    titleReferral: 'रेफरल ट्रैकिंग',
    titlePatients: 'सभी गर्भवती महिलाओं की सूची',

    // Login Screen
    loginTitle: 'आशा / एएनएम लॉगिन',
    loginWelcome: 'नमस्ते दीदी! आपका स्वागत है',
    loginInstruction: 'अपने पंजीकृत आशा आईडी और 4-अंकीय सुरक्षा पिन से लॉगिन करें।',
    workerIdLabel: 'मोबाइल नंबर या आशा आईडी',
    workerIdPlaceholder: 'उदा. 9823456789 या MH-ASHA-042',
    pinLabel: 'सुरक्षा पिन (4 अंक)',
    pinPlaceholder: '4 अंकों का पिन दर्ज करें',
    forgotPin: 'पिन भूल गए?',
    quickDemoFill: 'डेमो उपयोगकर्ता (Quick Demo Fill)',
    loginButton: 'लॉगिन करें',
    loggingIn: 'सत्यापित किया जा रहा है...',
    loginSuccess: 'लॉगिन सफल हुआ!',
    loginFailed: 'लॉगिन असफल. कृपया पिन पुनः जांचें।',
    otpLogin: 'ओटीपी से लॉगिन करें',
    localDataEncrypted: 'स्थानीय डेटा: सुरक्षित व सहेजा हुआ',
    healthMissionSubtitle: 'राष्ट्रीय ग्रामीण स्वास्थ्य नेटवर्क • भारत सरकार',
    loginGovtFooter: 'राष्ट्रीय ग्रामीण स्वास्थ्य मिशन • स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार',

    // Beneficiary Screen
    abhaVerified: 'ABHA सत्यापित',
    abhaIdLabel: 'ABHA आईडी',
    rchIdLabel: 'RCH आईडी',
    husbandLabel: 'पति',
    callingToast: 'कॉल की जा रही है',
    highRiskBadge: 'उच्च जोखिम (HIGH RISK)',
    highRiskTitle: 'गर्भावधि उच्च रक्तचाप और प्री-एक्लेम्पसिया के लक्षण पाए गए हैं।',
    highRisk: 'उच्च जोखिम',
    normal: 'सामान्य ANC',
    viewProtocol: 'प्रोटोकॉल देखें',
    gestationalAge: 'गर्भधारण अवधि',
    gravida: 'गर्भावस्था (Gravida)',
    lmpDate: 'अंतिम माहवारी तिथि (LMP)',
    eddDate: 'अपेक्षित प्रसव तिथि (EDD)',
    vitalsSummary: 'वाइटल्स सारांश (ताज़ा रिकॉर्ड)',
    bloodPressure: 'रक्तचाप (BP)',
    pulseRate: 'नाड़ी गति (Pulse)',
    oxygenSpO2: 'ऑक्सीजन स्तर (SpO2)',
    temperature: 'तापमान',
    bodyWeight: 'वजन',
    bloodSugar: 'रैंडम ब्लड शुगर (RBS)',
    recordNewVitalsBtn: 'नए वाइटल्स दर्ज करें',
    cdssAssessmentBtn: 'मरीज जोखिम मूल्यांकन',
    teleconsultBtn: 'डॉक्टर से वीडियो परामर्श',
    trackReferralBtn: 'अस्पताल रेफरल ट्रैक करें',
    clinicalProtocolModalTitle: 'उच्च रक्तचाप व प्री-एक्लेम्पसिया क्लिनिकल प्रोटोकॉल',

    // Record Vitals Screen
    vitalsScreenTitle: 'सामान्य मातृ वाइटल्स जांच',
    vitalsFormStep: 'चरण 2: शारीरिक वाइटल्स मापें और दर्ज करें',
    bhashiniVoiceInput: 'वॉयस इनपुट',
    bhashiniListening: 'सुन रहा हूँ... बोलिए',
    autoFillPrevious: 'मानक सामान्य वाइटल्स भरें (120/80 mmHg)',
    autoFillToast: 'मानक सामान्य वाइटल्स भर दिए गए!',
    systolicLabel: 'सिस्टोलिक BP (ऊपरी संख्या)',
    systolicHint: 'सामान्य: 110-120 mmHg, उच्च: ≥140',
    diastolicLabel: 'डायस्टोलिक BP (निचली संख्या)',
    diastolicHint: 'सामान्य: 70-80 mmHg, उच्च: ≥90',
    tempLabel: 'शरीर का तापमान',
    pulseLabel: 'नाड़ी गति (Pulse Rate bpm)',
    spo2Label: 'ऑक्सीजन स्तर (SpO2 %)',
    weightLabel: 'वजन (किलोग्राम kg)',
    rbsLabel: 'रैंडम ब्लड शुगर (RBS mg/dL)',
    clinicalNotesLabel: 'नैदानिक नोट्स व लक्षण',
    clinicalNotesPlaceholder: 'लक्षण दर्ज करें (जैसे सिरदर्द, पैरों में सूजन...)',
    saveAndAssessBtn: 'रिकॉर्ड सहेजें और जोखिम मूल्यांकन करें',
    vitalsSavedToast: 'वाइटल्स सफलतापूर्वक सहेजे गए!',
    highBpAlert: 'चेतावनी: उच्च रक्तचाप (Hypertension) दर्ज हुआ!',
    feverAlert: 'बुखार दर्ज: तापमान सामान्य से अधिक है।',
    lowOxygenAlert: 'ऑक्सीजन स्तर कम: तत्काल ध्यान दें!',

    // Risk Assessment Screen
    cdssHeader: 'मरीज जोखिम मूल्यांकन',
    cdssStep1: '1 मूल विवरण',
    cdssStep2: '2 वाइटल्स',
    cdssStep3: '3 मूल्यांकन',
    redFlagsChecklist: 'रेड-फ्लैग लक्षण चेकलिस्ट',
    flagBreathing: 'सांस लेने में अत्यधिक कठिनाई या सीने में भारीपन?',
    flagHeadache: 'तेज़ सिरदर्द या आँखों से धुंधला दिखना?',
    flagConfusion: 'बेहोशी, चक्कर या मानसिक भ्रम की स्थिति?',
    flagBleeding: 'पेट के निचले हिस्से में तीव्र दर्द या रक्तस्राव?',
    flagHighBp: 'रक्तचाप (BP) > 140/90 mmHg दर्ज किया गया?',
    emrVerifiedRecord: 'मातृ स्वास्थ्य जांच रिकॉर्ड',
    highRiskAlertTitle: 'उच्च जोखिम / HIGH RISK PREGNANCY',
    highRiskRationaleHeader: 'निर्णय का आधार (DECISION RATIONALE)',
    highRiskAdvice: 'माता उच्च रक्तचाप व प्री-एक्लेम्पसिया के गंभीर जोखिम में है। 108 एम्बुलेंस के माध्यम से प्राथमिक स्वास्थ्य केंद्र (PHC) तत्काल रेफर करें।',
    voiceGuidanceBtn: 'ध्वनि मार्गदर्शन सुनें',
    callAmbulanceBtn: '108 एम्बुलेंस आपातकालीन कॉल',
    dispatchReferralBtn: 'तत्काल रेफरल भेजें (Referral Now)',
    teleconsultDoctorBtn: 'डॉक्टर से वीडियो परामर्श करें',

    // Referral Tracking Screen
    criticalReferralBadge: 'आपातकालीन रेफरल (CRITICAL REFERRAL)',
    ambulanceEnRoute: '108 एम्बुलेंस रवाना हो चुकी है',
    etaMinutes: 'पहुंचने का समय: लगभग',
    arrivedAtGate: 'अस्पताल गेट पर पहुंच चुकी है',
    referralManagementTitle: 'रेफरल प्रबंधन एवं स्थिति ट्रैकिंग',
    referralClosedLoopSubtitle: 'डिजिटल रेफरल नेटवर्क',
    targetFacilityLabel: 'रेफरल स्वास्थ्य केंद्र चुनें',
    step1Title: 'रेफरल तैयार व भेजा गया',
    step1Desc: 'आशा कार्यकर्ता ने डिजिटल रेफरल टोकन प्राथमिक स्वास्थ्य केंद्र को प्रेषित किया।',
    step2Title: '108 एम्बुलेंस रवाना',
    step2Desc: 'एम्बुलेंस मरीज के लिए रवाना हो गई है।',
    step3Title: 'एम्बुलेंस अस्पताल आगमन',
    step3Desc: 'मरीज सुरक्षित रूप से PHC बेलोरा के आपातकालीन गेट पर पहुंच गई।',
    step4Title: 'चिकित्सा अधिकारी जांच व भर्ती',
    step4Desc: 'डॉ. अनिता शर्मा द्वारा आपातकालीन जांच और भर्ती की प्रक्रिया जारी।',
    confirmArrivalBtn: 'आगमन दर्ज करें (Confirm Arrival)',
    shareWhatsAppBtn: 'व्हाट्सएप रेफरल पर्ची साझा करें',
    teleconsultOfficerBtn: 'डॉक्टर से संपर्क करें',
    smsSentToast: 'परिवार और आशा सुपरवाइजर को एसएमएस भेजा गया!',

    // Patients Directory Screen
    directoryTitle: 'पंजीकृत गर्भवती महिलाएं',
    directorySubtitle: 'उप-केंद्र खैरी (Sub-Center Khairi)',
    searchPlaceholder: 'नाम, गाँव या ABHA आईडी से खोजें...',
    filterAll: 'सभी महिलाएं',
    filterHighRisk: 'उच्च जोखिम',
    filterNormal: 'सामान्य',
    totalBeneficiaries: 'कुल पंजीकृत',
    viewPatientDetails: 'विवरण देखें',

    // Home Screen & New Registration
    homeGreeting: 'नमस्ते, संगीता दीदी!',
    homeSubCenter: 'करजगांव उपकेंद्र 04 • वार्ड 3',
    quickActions: 'त्वरित कार्य एवं सेवाएं',
    newRegistrationBtn: 'नई गर्भवती पंजीकरण',
    newRegistrationDesc: 'नई गर्भवती महिला का ABHA व RCH पंजीकरण',
    quickVitalsBtn: 'वाइटल्स दर्ज करें',
    quickVitalsDesc: 'रक्तचाप, वजन और पल्स रेट जांच',
    sosAmbulanceBtn: '108 आपातकालीन रेफरल',
    sosAmbulanceDesc: 'तत्काल एम्बुलेंस व पीएचसी अलर्ट',
    teleconsultQuickBtn: 'ई-संजीवनी टेलीकंसल्ट',
    maternalHealthStats: 'मातृत्व स्वास्थ्य सांख्यिकी',
    totalMothers: 'कुल पंजीकृत',
    highRiskFlagged: 'उच्च जोखिम',
    deliveriesMonth: 'इस माह प्रसव',
    visitsDueToday: 'आज की विज़िट',
    homeHighRiskAlertTitle: 'तत्काल ध्यान देने योग्य',
    homeHighRiskAlertSubtitle: 'उच्च रक्तचाप व जटिलता वाली गर्भवती महिला',
    todaysFieldTasks: 'आज का फील्ड शेड्यूल व गृह भेंट',
    recentBeneficiariesTitle: 'हाल ही में पंजीकृत महिलाएं',
    viewFullDirectory: 'सभी महिलाओं की सूची देखें',
    registerMotherTitle: 'नई गर्भवती महिला पंजीकरण (ANC)',
    registerMotherSubtitle: 'ABHA आईडी, RCH पोर्टल व प्रसवपूर्व जांच',
    personalDetails: 'व्यक्तिगत एवं संपर्क विवरण',
    obstetricHistory: 'प्रसव इतिहास एवं गर्भावस्था',
    nationalHealthIds: 'राष्ट्रीय स्वास्थ्य पहचान (ABHA / RCH)',
    motherNameLabel: 'गर्भवती महिला का पूरा नाम',
    motherAgeLabel: 'आयु (वर्ष)',
    motherPhoneLabel: 'मोबाइल नंबर',
    husbandNameLabel: 'पति का नाम',
    villageLabel: 'गाँव / वार्ड',
    subCenterLabel: 'उप-केंद्र',
    lmpLabel: 'अंतिम माहवारी की तारीख (LMP)',
    eddLabel: 'संभावित प्रसव तारीख (EDD)',
    gestationalAgeLabel: 'गर्भधारण अवधि (Gestational Age)',
    gravidaLabel: 'गर्भधारण संख्या (Gravida)',
    parityLabel: 'पूर्व प्रसव (Parity)',
    generateAbhaBtn: 'आधार से ABHA बनाएं / सत्यापित करें',
    highRiskChecklist: 'प्रारंभिक जोखिम स्क्रीनिंग (High-Risk Screening)',
    initialVitalsTitle: 'प्रारंभिक वाइटल्स (Baseline Vitals)',
    completeRegistrationBtn: 'पंजीकरण पूर्ण करें (Register)',
    registrationSuccessToast: 'नई गर्भवती महिला का पंजीकरण सफलतापूर्वक सुरक्षित हुआ!',
  },

  en: {
    // Common & Branding
    appName: 'Sanjeevani-Net',
    appSubtitle: 'ASHA & ANM Maternal Health Network',
    ministry: 'Ministry of Health & Family Welfare, Govt. of India',
    ashaAnmTitle: 'ASHA / ANM • NRHM',
    online: 'Online',
    offline: 'Offline Mode',
    offlineBanner: 'Offline Mode: All records are saved securely on device. Auto-sync on network reconnect.',
    lowBandwidthBanner: 'Low-bandwidth network mode active.',
    selectLanguage: 'Select Language',
    profile: 'My Profile',
    logout: 'Logout',
    syncStatus: 'Data Sync Status',
    allBeneficiaries: 'All Beneficiaries',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    verified: 'Verified',
    call: 'Call',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error occurred',

    // Bottom Nav
    navHome: 'Home',
    navPatients: 'Patients',
    navFollowUps: 'Follow-ups',
    navVitals: 'Vitals',

    // Screen Titles
    titleHome: 'Field Dashboard',
    titleBeneficiary: 'Beneficiary Details',
    titleVitals: 'Record Vital Signs',
    titleAssessment: 'Clinical Risk Assessment',
    titleReferral: 'Referral Tracking',
    titlePatients: 'Beneficiaries Directory',

    // Login Screen
    loginTitle: 'ASHA / ANM Login',
    loginWelcome: 'Welcome, Health Worker!',
    loginInstruction: 'Sign in with your registered ASHA ID and 4-digit security PIN.',
    workerIdLabel: 'Mobile Number or ASHA ID',
    workerIdPlaceholder: 'e.g. 9823456789 or MH-ASHA-042',
    pinLabel: 'Security PIN (4 digits)',
    pinPlaceholder: 'Enter 4-digit PIN',
    forgotPin: 'Forgot PIN?',
    quickDemoFill: 'Quick Demo Fill',
    loginButton: 'Sign In Securely',
    loggingIn: 'Verifying credentials...',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed. Please check your PIN.',
    otpLogin: 'Sign In via OTP',
    localDataEncrypted: 'Local Storage: Encrypted & Stored',
    healthMissionSubtitle: 'National Rural Health Network • Digital Health Mission',
    loginGovtFooter: 'National Rural Health Mission • Ministry of Health & Family Welfare, Govt of India',

    // Beneficiary Screen
    abhaVerified: 'ABHA Verified',
    abhaIdLabel: 'ABHA ID',
    rchIdLabel: 'RCH ID',
    husbandLabel: 'Husband',
    callingToast: 'Calling',
    highRiskBadge: 'HIGH RISK ALERT',
    highRiskTitle: 'Gestational Hypertension & Imminent Pre-Eclampsia detected.',
    highRisk: 'HIGH RISK',
    normal: 'NORMAL ANC',
    viewProtocol: 'View Protocol',
    gestationalAge: 'Gestational Age',
    gravida: 'Gravida',
    lmpDate: 'Last Menstrual Period (LMP)',
    eddDate: 'Expected Delivery Date (EDD)',
    vitalsSummary: 'Vitals Summary (Latest Reading)',
    bloodPressure: 'Blood Pressure (BP)',
    pulseRate: 'Pulse Rate',
    oxygenSpO2: 'Oxygen Saturation (SpO2)',
    temperature: 'Temperature',
    bodyWeight: 'Weight',
    bloodSugar: 'Random Blood Sugar (RBS)',
    recordNewVitalsBtn: 'Record New Vitals',
    cdssAssessmentBtn: 'Clinical Risk Assessment',
    teleconsultBtn: 'Emergency Teleconsult MO',
    trackReferralBtn: 'Track Facility Referral',
    clinicalProtocolModalTitle: 'High Blood Pressure & Pre-Eclampsia Protocol',

    // Record Vitals Screen
    vitalsScreenTitle: 'General Maternal Vitals Checkup',
    vitalsFormStep: 'Step 2: Capture Clinical Vital Signs',
    bhashiniVoiceInput: 'Voice Input',
    bhashiniListening: 'Listening... please speak',
    autoFillPrevious: 'Auto-fill Normal Baseline (120/80 mmHg)',
    autoFillToast: 'Standard normal baseline auto-filled!',
    systolicLabel: 'Systolic BP (Upper Number)',
    systolicHint: 'Normal: 110-120 mmHg, Elevated: ≥140',
    diastolicLabel: 'Diastolic BP (Lower Number)',
    diastolicHint: 'Normal: 70-80 mmHg, Elevated: ≥90',
    tempLabel: 'Body Temperature',
    pulseLabel: 'Pulse Rate (bpm)',
    spo2Label: 'Oxygen Saturation (SpO2 %)',
    weightLabel: 'Body Weight (kg)',
    rbsLabel: 'Random Blood Sugar (RBS mg/dL)',
    clinicalNotesLabel: 'Clinical Notes & Symptoms',
    clinicalNotesPlaceholder: 'Enter symptoms (e.g. headache, pedal edema...)',
    saveAndAssessBtn: 'Save Vitals & Clinical Assessment',
    vitalsSavedToast: 'Vitals saved securely!',
    highBpAlert: 'Warning: Elevated Blood Pressure (Hypertension) detected!',
    feverAlert: 'Fever detected: Temperature above normal threshold.',
    lowOxygenAlert: 'Low Oxygen: SpO2 below 95%, immediate attention required!',

    // Risk Assessment Screen
    cdssHeader: 'Clinical Risk Assessment',
    cdssStep1: '1 Details',
    cdssStep2: '2 Vitals',
    cdssStep3: '3 Assessment',
    redFlagsChecklist: 'Red-Flag Symptoms Checklist',
    flagBreathing: 'Severe breathing difficulty or chest tightness?',
    flagHeadache: 'Severe headache or blurred vision?',
    flagConfusion: 'Fainting, dizziness, or altered consciousness?',
    flagBleeding: 'Severe abdominal pain or vaginal bleeding?',
    flagHighBp: 'Recorded BP > 140/90 mmHg?',
    emrVerifiedRecord: 'Maternal Health Examination Record',
    highRiskAlertTitle: 'HIGH RISK PREGNANCY ALERT',
    highRiskRationaleHeader: 'Clinical Decision Rationale',
    highRiskAdvice: 'Patient exhibits severe gestational hypertension and imminent pre-eclampsia. Immediate transit to Primary Health Centre via 108 Ambulance is mandatory.',
    voiceGuidanceBtn: 'Play Voice Guidance',
    callAmbulanceBtn: 'Call 108 Emergency Ambulance',
    dispatchReferralBtn: 'Dispatch Emergency Referral',
    teleconsultDoctorBtn: 'Video Call with Doctor',

    // Referral Tracking Screen
    criticalReferralBadge: 'CRITICAL REFERRAL',
    ambulanceEnRoute: '108 Ambulance Dispatched',
    etaMinutes: 'Estimated Time of Arrival:',
    arrivedAtGate: 'Arrived at Facility Emergency Gate',
    referralManagementTitle: 'Referral Management & Tracking',
    referralClosedLoopSubtitle: 'Digital Referral System',
    targetFacilityLabel: 'Select Referral Health Facility',
    step1Title: 'Referral Initiated & Queued',
    step1Desc: 'ASHA worker submitted beneficiary triage token to PHC.',
    step2Title: '108 Ambulance Dispatched',
    step2Desc: 'Ambulance assigned and en route.',
    step3Title: 'Transit & Facility Arrival',
    step3Desc: 'Patient safely arrived at PHC Belora emergency gate.',
    step4Title: 'Doctor Handover & Admission',
    step4Desc: 'Dr. Anita Sharma commenced active triage and magnesium sulfate protocol.',
    confirmArrivalBtn: 'Confirm Arrival at Gate',
    shareWhatsAppBtn: 'Share WhatsApp Referral Slip',
    teleconsultOfficerBtn: 'Teleconsult Medical Officer',
    smsSentToast: 'SMS notification sent to family and ASHA supervisor!',

    // Patients Directory Screen
    directoryTitle: 'Beneficiaries Directory',
    directorySubtitle: 'Registered ANC Mothers (Sub-Center Khairi)',
    searchPlaceholder: 'Search by name, village, or ABHA ID...',
    filterAll: 'All Mothers',
    filterHighRisk: 'High Risk',
    filterNormal: 'Normal ANC',
    totalBeneficiaries: 'Total Registered',
    viewPatientDetails: 'View Details',

    // Home Screen & New Registration
    homeGreeting: 'Welcome, Savita Bai!',
    homeSubCenter: 'Karajgaon Sub-Center 04 • Ward 3',
    quickActions: 'Quick Actions & Services',
    newRegistrationBtn: 'New ANC Registration',
    newRegistrationDesc: 'Register new pregnant mother with ABHA & RCH',
    quickVitalsBtn: 'Record Vitals',
    quickVitalsDesc: 'Log blood pressure, pulse, SpO2 & weight',
    sosAmbulanceBtn: '108 Emergency SOS',
    sosAmbulanceDesc: 'Instant ambulance dispatch & PHC alert',
    teleconsultQuickBtn: 'e-Sanjeevani Teleconsult',
    maternalHealthStats: 'Maternal Health Statistics',
    totalMothers: 'Total Registered',
    highRiskFlagged: 'High-Risk Flagged',
    deliveriesMonth: 'Deliveries This Month',
    visitsDueToday: 'Visits Due Today',
    homeHighRiskAlertTitle: 'Urgent Clinical Attention Required',
    homeHighRiskAlertSubtitle: 'Severe hypertension & complication flags',
    todaysFieldTasks: "Today's Field Schedule & Home Visits",
    recentBeneficiariesTitle: 'Recently Registered Mothers',
    viewFullDirectory: 'View Beneficiaries Directory',
    registerMotherTitle: 'New Pregnant Mother Registration (ANC)',
    registerMotherSubtitle: 'ABHA ID verification, RCH tracking & initial screening',
    personalDetails: 'Personal & Contact Information',
    obstetricHistory: 'Obstetric History & Gestation',
    nationalHealthIds: 'National Health Identifiers (ABHA / RCH)',
    motherNameLabel: "Mother's Full Name",
    motherAgeLabel: 'Age (Years)',
    motherPhoneLabel: 'Mobile Phone Number',
    husbandNameLabel: "Husband's Name",
    villageLabel: 'Village / Ward',
    subCenterLabel: 'Sub-Center',
    lmpLabel: 'Last Menstrual Period (LMP)',
    eddLabel: 'Estimated Date of Delivery (EDD)',
    gestationalAgeLabel: 'Gestational Age',
    gravidaLabel: 'Gravida (Total Pregnancies)',
    parityLabel: 'Parity (Past Deliveries)',
    generateAbhaBtn: 'Generate / Verify ABHA with Aadhaar',
    highRiskChecklist: 'Initial High-Risk Screening',
    initialVitalsTitle: 'Baseline Vitals',
    completeRegistrationBtn: 'Complete Registration',
    registrationSuccessToast: 'New pregnant mother registered and saved successfully!',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};
