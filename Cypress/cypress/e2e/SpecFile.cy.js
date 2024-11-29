// Import the page object for interacting with elements
import LoginPage from "../PageObjects/LoginPage";
import HomePage from "../PageObjects/HomePage";
import AppointmentPage from "../PageObjects/AppointmentPage";
import ProcurementPage from "../PageObjects/Pages/ProcurementPage";
import DispensaryPage from "../PageObjects/Pages/DispensaryPage";
import LaboratoryPage from "../PageObjects/Pages/LaboratoryPage";
import RadiologyPage from "../PageObjects/Pages/RadiologyPage";
import UtilitiesPage from "../PageObjects/Pages/UtilitiesPage";
import PatientPage from "../PageObjects/Pages/PatientPage";
import ADTPage from "../PageObjects/Pages/ADTPage";

describe("Automation Suite for Yaksha Application", () => {
  // Create instance of the classes
  const login = new LoginPage();
  const home = new HomePage();
  const appointment = new AppointmentPage();
  const procurement = new ProcurementPage();
  const utilPage = new UtilitiesPage();
  const dispensaryPage = new DispensaryPage();
  const laboratoryPage = new LaboratoryPage();
  const radiologyPage = new RadiologyPage();
  const patient = new PatientPage();
  const adt = new ADTPage();

  const billingCounterUrl =
    "https://healthapp.yaksha.com/Home/Index#/Utilities/ChangeBillingCounter";

  // Set an acceptable load time in milliseconds
  const acceptableLoadTime = 100;

  // Run before each test
  beforeEach(() => {
    cy.launchBrowser(); // Launch the browser
    cy.navigatingToBaseURL(); // Hit base URL
    cy.loadExcelData('ValidLogin');
    cy.login(login, home, null, null, '@ValidLogin');
    cy.wait(3000);
  });

  it("TS-1 Verify Login with Valid Credentials", () => {
    // Load Excel data for 'ValidLogin' sheet
    cy.loadExcelData('ValidLogin');

    // Access the Excel data using keys
    cy.get('@ValidLogin').then((loginData) => {
      const username = loginData['ValidUserName']; // Access using key
      const password = loginData['ValidPassword']; // Access using key

      cy.log('Username and Password are:', username, password);

      login.clickAdmin();
      login.clickLogout();
      cy.wait(3000);
      cy.login(login, home, username, password, '@ValidLogin');
      home.verifyRegisteredPatientText();
    });
  });


  it("TS-2 Verify Page Navigation and Load Time for Billing Counter", () => {
    utilPage.verifyBillingCounterLoadState().then((result) => {
      expect(result).to.be.true;
    });
  });

  it("TS-3 Verify Patient Search with Valid Data for appointment", () => {
    appointment.appointmentDropdownClick();
    appointment.counterSelectionClick();
    appointment.getFirstPatientName().then((patientName) => {
      cy.log(`Searching for patient: ${patientName}`);
      appointment.searchPatient(patientName);
      cy.wait(3000);
      appointment.validatePatientDetail(patientName);
    });
  });

  it("TS-4 Activate Counter in Dispensary", () => {
    dispensaryPage.verifyActiveCounterMessageInDispensary();
  });

  it("TS-5 Purchase Request List Load", () => {
    procurement.verifyAllElementsVisible();
  });

  it("TS-6 Lab Dashboard Data Validation", () => {
    cy.loadExcelData('LabTestText').then(() => {
      cy.get('@LabTestText').then((labTestData) => {
        const labTestErrorMessage = labTestData['LabTest']
        laboratoryPage.verifyErrorMessage(labTestErrorMessage);
      });
    });
  });

  it("TS-7 Handle Alert on Billing Counter", () => {
    cy.loadExcelData('DateRange').then(() => {
      cy.get('@DateRange').then((dateRangeData) => {
        const fromDate = dateRangeData['fromDate'];
        radiologyPage
          .performRadiologyRequestAndHandleAlert(fromDate)
          .then((result) => {
            expect(result).to.be.true;
          });
      });
    });
  });

  it("TS-8 Data-Driven Testing for Patient Search", () => {
    // Load the patient data and prepare the array
    cy.loadExcelData('PatientNames').then(() => {
      cy.get('@PatientNames').then((patientData) => {
        // Extract patient names into an array
        const patientNames = Object.keys(patientData).map((key) => key.trim());

        patient.searchAndVerifyPatients(patientNames);
      });
    });
  });

  it("TS-9 Error Handling and Logging in Purchase Request List", () => {
    procurement.verifyNoticeMessageAfterEnteringIncorrectFilters();
  });

  it("TS-10 Keyword-Driven Framework for Appointment Search", () => {
    appointment.searchAndVerifyPatient();
  });

  it("TS-11 Modular Script for Patient Search", () => {
    appointment.searchPatientInAppointment();
    patient.searchPatientInPatientPage();
    adt.searchPatientInADT();
  });

  it("TS-12 Verify Assertion for Counter Activation", () => {
    dispensaryPage.verifyCounterisActivated();
  });

  it("TS-14 Verify Locator Strategy for Appointment Search", () => {
    appointment.searchAndVerifyPatientList();
  });

  it("TS-15 Element Inspection and Handling Alerts in Lab Dashboard", () => {
    cy.loadExcelData('ToolTipText').then(() => {
      cy.get('@ToolTipText').then((tooltipData) => {
        const tooltipText = tooltipData['tooltipText'];
        laboratoryPage.verifyStarTooltip(tooltipText);
      });
    });
  });

  it("TS-16 Navigation Exception Handling on Dispensary Page", () => {
    dispensaryPage.navigateToDispensary();
  });

  it("TS-17 Web Element Handling for Dropdowns in Purchase Request", () => {
    cy.loadExcelData('DateRange').then(() => {
      cy.get('@DateRange').then((dateRangeData) => {

        const fromDate = dateRangeData['fromDate'];
        const toDate = dateRangeData['toDate'];

        procurement
          .verifyRequestedDateColumnDateWithinRange(fromDate, toDate)
          .then((result) => {
            expect(result).to.be.true;
          });
      });
    });
  });

  it("TS-18 Form Authentication and Error Messages", () => {
    cy.loadExcelData('InvalidLogin');
    cy.get('@InvalidLogin').then((loginData) => {
      const username = loginData['InvalidUserName'];
      const password = loginData['InvalidPassword'];
      cy.log('usernamd and password are: ' + username, password);
      login.clickAdmin();
      login.clickLogout();
      cy.wait(3000);
      cy.login(login, home, username, password, '@InvalidLogin');
      login.errorMsgValidate();
    });
  });

  // Run after all tests
  after(() => {
    cy.closeBrowser();
  });
});
