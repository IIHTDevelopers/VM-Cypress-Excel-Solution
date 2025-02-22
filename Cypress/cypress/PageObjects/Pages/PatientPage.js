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
 * @description Searches for a list of patients using their names from the provided array,
 *              verifies if the correct patient appears in the search results, and handles multiple searches.
 * @param {Array<string>} patientNames - Array of patient names to search and verify.
 * @returns {void}
 */

  searchAndVerifyPatients(patientNames) {
    // Click on the patient search element
    cy.xpath(this.patient).first().click();

    const searchBar = this.searchBar;

    // Iterate over the patient names passed as a parameter
    patientNames.forEach((shortName) => {
      if (shortName) {
        // Search for the patient by their ShortName and validate results
        cy.get(searchBar).clear().type(shortName); // Type the ShortName into the search bar
        cy.get('body').type('{enter}'); // Trigger search with Enter

        // Wait for search results to load and validate the result
        cy.xpath("//div[@role='gridcell' and @col-id='ShortName']")
          .should('have.text', shortName) // Verify result matches the expected ShortName
          .then(() => {
            // Clear the search bar for the next iteration
            cy.get(searchBar).clear();
          });
      } else {
        cy.log(`Skipping invalid or empty ShortName: ${shortName}`);
      }
    });
  }


}
export default PatientPage;
