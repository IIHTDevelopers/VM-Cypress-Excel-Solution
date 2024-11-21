import PatientSearchHelper from "../../e2e/ReusableMethod";

class PatientPage {
  patient = "//span[text()='Patient']";
  searchBar = "#quickFilterInput";

  patientDropdownClick() {
    cy.xpath(this.patient).should("be.visible").first().click();
  }

  /**
   * @Test11.2
   * @description Initiates the patient search process in the patient page.
   *              It creates an instance of the `PatientSearchHelper` class, clicks on the
   *              patient dropdown, and then calls the `searchPatient()` method from the helper
   *              to perform the actual search.
   * @returns {void}
   */
  searchPatientInPatientPage() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    this.patientDropdownClick();
    cy.wait(2000);
    patientSearchHelper.searchPatient();
  }

  /**
   * @Test8
   * @description Searches for a list of patients using their names from the `patientData` array,
   *              verifies if the correct patient appears in the search results, and handles multiple searches.
   *              The method iterates over the first 5 patients, searching and verifying each patient’s name
   *              in the displayed results.
   * @returns {boolean} - Returns true if all searches are successfully verified; otherwise, it will stop at the first failure.
   */

  searchAndVerifyPatients() {
    // Click on the patient search element
    cy.xpath(this.patient).first().click();
  
    const searchBar = this.searchBar;
  
    // Load the patient data from Excel directly and iterate over it
    cy.loadExcelData('PatientNames').then(() => {
      // Access the loaded patient data and iterate directly
      cy.get('@PatientNames').then((patientData) => {
        // Ensure data exists
        if (!patientData || patientData.length === 0) {
          throw new Error('No patient data found in the Excel file.');
        }
  
        // Iterate over each patient
        patientData.forEach((patient) => {
          // Access the 'ShortName' from the loaded patient data
          const shortName = patient.ShortName ? patient.ShortName.trim() : ''; // Safely access ShortName
  
          if (shortName) {
            // Search for the patient by their ShortName and validate results
            cy.get(searchBar).clear().type(shortName); // Type the ShortName into the search bar
            cy.get('body').type('{enter}'); // Trigger search with Enter
  
            // Wait for search results to load and validate the result
            cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").should('have.text', shortName); // Verify result matches the expected ShortName
  
            // Clear the search bar for the next iteration
            cy.get(searchBar).clear();
          } else {
            cy.log(`Skipping invalid or empty ShortName for: ${JSON.stringify(patient)}`);
          }
        });
      });
    });
  }  
}
export default PatientPage;
