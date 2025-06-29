document.addEventListener("DOMContentLoaded", () => {

  /* WIP 
  Local save function = Done. 
  */

  /* Too long, needs a refactor: 
   * Create Equipment table: 500 -> Refactor in progress
   * Create Offer row: 300 
   * Create Cable row: 300 
   * Save changes: 150
   * Half the file is 4 functions...
   */
   
   /* Current bugs: 
   * Cable table isn't working in review view -> Shows the main table instead of the review one, fix WIP
   * Return to main page is broken.  
   * Save function doesn't work with cables
   * Cable linked equipment is broken 
   * Control panel may need to get segemented like the main page
   * Review page isn't ordered like the main page
   */

   /* To be Added: 
    * Other UX improvements
    * Handeling several projects 
    * Deploying the webstie 
    */

  // Class declerations  
  class Equipment {
    constructor(name = "Equipment Name", voltage = "Voltage", selection = "Include", type) {
      this.name = name;
      this.voltage = voltage;
      this.id = voltage + "-" + name;
      this.selection = selection;
      this.type = type;
      this.listOfOffers = Array(new Offer());
    }
  }

  class Offer{
    constructor(vendor ="Vendor Name", unit = 0, quantity = 0, FAT = 0, shipping = 0, customs = 15, additional = 0, notes = "Note section", PDF = "PDF URL", isSelected = false, linkedEquipmentIds = []){
      this.vendor =  vendor
      this.unit = unit
      this.price = unit*quantity;
      this.quantity = quantity;
      this.FAT = FAT;
      this.shipping = shipping
      this.customs = customs
      this.additional = additional 
      this.totalPrice = Math.floor(this.price * (1+(Number(customs)/100)) + Number(FAT) + Number(shipping) + Number(additional));
      this.notes = notes;
      this.PDF = PDF;
      this.isSelected = isSelected; 
      this.linkedEquipmentIds = linkedEquipmentIds; 
    }

    

    /**
     * 
     * @returns {array} Offer details as array 
     */
    toArray(){
      return Array(this.vendor, this.unit, this.quantity, this.price, this.FAT, this.shipping, this.customs, this.additional, this.totalPrice, this.notes, this.PDF, this.isSelected, this.linkedEquipmentIds);
    }
  }

  class Cable {
    constructor(
      name = "Cable",
      startPoint = "stPoint",
      endPoint = "enPoint",
      connectionNum = "0",
      phase = "0",
      cores = "0",
      length = "0",
      quantity = "0",
      price = "0",
      FAT = "0",
      shipping = "0",
      customs = "0",
      optional = "0",
      notes = "notes here",
      PDF = "PDF URL",
      isSelected = false,
      linkedEquipmentIds = []

    ) {
      this.name = name;
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.connectionNum = connectionNum;
      this.phase = phase;
      this.cores = cores;
      this.length = length;
      this.totalLength = Number(connectionNum)*Number(phase)*Number(cores)*Number(length)

      this.quantity = quantity;
      this.price = price;
      this.FAT = FAT;
      this.shipping = shipping;
      this.customs = customs;
      this.optional = optional;
      this.totalPrice = Math.floor(
        ((Number(this.totalLength)) * Number(price)  * (1 + Number(customs) / 100) ) + Number(optional)  + Number(FAT) + Number(shipping)
      );
      this.notes = notes;
      this.PDF = PDF;
      this.isSelected = isSelected;
      this.linkedEquipmentIds = linkedEquipmentIds; 
    }

    /**
     * 
     * @returns {array} Cable details as array 
     */
    toArray(){
      return Array(this.name, this.startPoint, this.endPoint,this.connectionNum, this.phase, this.cores, this.length, this.totalLength, this.quantity,this.price, this.FAT, this.shipping, this.customs, this.optional, this.totalPrice, this.notes, this.PDF, this.isSelected, this.linkedEquipmentIds);
    }
    
  }

  class Project{
    constructor(
      name = "projectName", 
      owner = "ownerName", 
      database = []
    ){
      this.name = name; 
      this.owner = owner; 
      this.database = database;
    }

  }

  // End of class declerations
  
  var currentDocumentPath = String(document.getRootNode()["location"]["pathname"])
  
  var documentName = currentDocumentPath.split("/");

  // Last element
  documentName = documentName[documentName.length-1]; 

  // Remove .html 
  documentName = documentName.slice(0,-5); 


  //
  var equipmentList = [];
  
  // From local storage, should be changed later
  var masterEquipmentsList = [];

  const pages = ["auth", "projectSelection", "mainPage", "reviewerView"]  
  

  // Main function, called whenever you start the page
  function main() {    
    // Need an if statment to handle all the possbible pages.  
    
    if (documentName == "auth"){/*For auth page*/}
    else if(documentName == "projectSelection"){
      createMainComponentFunctionality(documentName);
    }
    
    // Main page
    else if (documentName == "mainPage"){
      
      createMainComponentFunctionality("main");
      
      initializePage("main", "local", "project");
    }
    // review page
    else if (documentName == "reviewerView") {      
      
      createMainComponentFunctionality("review");

      initializePage("review", "session", "project");
    }
    else if (documentName == "index"){
      console.log("redirect");
    }
    else {
      // Error page should be here
      //alert("Page doesn't exist");
    }
    
  }
  
  /**
   * createMainComponentFunctionality: Creates button functionalty 
   * @param {String} page 
   */
  function createMainComponentFunctionality(page){
    if (page == "main"){
      const controlPanel = document.getElementById("controlPanel");
      controlPanel.classList.add("expanded");
      // Testing VV 
      document.getElementById("tempTestBtn")?.addEventListener("click", () => {
      alert("Test button clicked!");
      });
      // Testing ^^

      createGlobalSelectorFunctionality();
      createCollapseButtonFunctionality();
      createEquipmentButtonFunctionality();
      createSaveButtonFunctionalty();
      
      //createConfirmButtonFunctionality();
      //createCableTableFunctionality(); // cable table function
    } 
    else if(page == "review"){
      createReturnToMainPageButtonFunctionality();
    }
    else if(page == "projectSelection"){
      createNewProjectButtonFunctionality();
      createSelectOldProjectButtonFunctionality();
    }
  }

  /**
   * intializePage: first function to be called whenever you load a new page. Calls loadDatabaseFromStorage and mapDatabaseToPage and defines all the page-specific functions 
   * @param {html Page} page 
   * @param {String} storage: Session or Local 
   * @param {String} databaseKey: key for the database   
   */

  function initializePage(page, storage, projectKey){
    

    // temporary code
    const project = JSON.parse(sessionStorage.getItem(projectKey));
    database = project.database; 
    // end of temp code
    /* Temp comment, why did I comment this? 
    const database = loadDatabaseFromStorage(databaseKey, storage);
    */
    mapDatabaseToPage(database, page);
  }

  /**
   * createGlobalSelectorFunctionality: functionality for global selectors
   */
  function createGlobalSelectorFunctionality(){
    // Global selectors
    const allEHV = document.getElementById("allEHV");
    const allHV = document.getElementById("allHV");
    // Add event listeners
    allEHV.addEventListener("change", () => {
      resetGlobalSelections("EHV");
      selectAll(allEHV, ["EHV", "HV", "MV"]);
    });
    allHV.addEventListener("change", () => {
      resetGlobalSelections("HV");
      selectAll(allHV, ["HV", "MV"]);
    });
  }

  /**
   * loadDatabaseFromStorage: gets the database from the storage
   * @param {Array} databaseKey database key in the storage 
   * @param {String} storage session or local 
   * @returns {JSON Object} database object
   */
  function loadDatabaseFromStorage(databaseKey, storage){
    var database = []; 
    if (storage = "local"){
      database = JSON.parse(localStorage.getItem(databaseKey)) || [];
      
    }else if (storage == "session"){
      database = JSON.parse(sessionStorage.getItem(databaseKey)) || [];
    }
    else{
      alert("load failed")
    }
    database.forEach((equipment)=>{
      masterEquipmentsList.push(new Equipment(equipment["name"], equipment["voltage"], equipment["selection"], equipment["type"]));
    }); 
    return database; 
    
  }

  /**
   * mapDatabaseToPage: maps the database to the specified page
   * @param {JSON object} database database array
   * @param {HTML page} page main or review 
   */
  function mapDatabaseToPage(database, page){
    // For each of the equipment, create a control panel row, a table, a summary row, and make it visable and color it. 
    database.forEach((equipment)=>{
      // add an empty equipment table using the equipment object
      updatePage(equipment, page);
       
      // Fill the Equipment table 
      const equipmentId = equipment.id;

      fillEquipmentTable(equipment, page)

      var equipmentTable;
      if (page == "main"){
        // Get the table div
        equipmentTable = document.getElementById(equipmentId + "-OffersTable").parentElement
      }
      else if (page == "review"){
        equipmentTable = document.getElementById(equipmentId + "-ReviewTable").parentElement
      }
        
      if (equipment.selection == "Include") {
        equipmentTable.removeAttribute("hidden")
      } else {
        equipmentTable.setAttribute("hidden", "hidden")
      }

    });
    
  }

  // This function fills equipment table with a list of offers
  function fillEquipmentTable(equipment, page) {
    for (var i = 0; i < equipment.listOfOffers.length; i++){
      // Should be returned instead
      createOfferRow(equipment, page);
      
      const offerRowId = equipment.id+"-Offer"+i;
      const offerRow = document.getElementById(offerRowId)

      var offer = equipment.listOfOffers[i];

      if (equipment.type != "cable") {
        offer = new Offer(offer["vendor"], offer["unit"], offer["quantity"], offer["FAT"], offer["shipping"], offer["customs"], offer["additional"], offer["notes"], offer["PDF"], offer["isSelected"])
      } else {
        offer = new Cable(offer["name"], offer["stPoint"], offer["endPoint"], offer["connectionNum"], offer["phase"], offer["cores"], offer["length"], offer["totalLength"], offer["price"], offer["FAT"], offer["shipping"], offer["customs"], offer["optional"], offer["notes"], offer["PDF"], offer["isSelected"])
      }
        
      // map the info from the database into the new row.  
      fillOfferRow(offerRow, offer, page);
      
      findWarnings(equipment, page);
    }    
  }

  /**
   * updatePage: Called whenever a new equipment is added. 
   * @param {Equipment} equipment 
   * @param {String} page 
   */
  function updatePage(equipment, page) {
    if (page == "main") {
      createControlPanelRow(equipment.id)
    }
    addEquipmentToPage(equipment, page); 
  }
 
  /**
   * Function will add the equipment to the specified page
   */
  function addEquipmentToPage(equipment, page = "main"){
        
    if (page == "main"){
      var equipmentDiv;
      if (equipment.type == "regular") {
        equipmentDiv = document.getElementById("regular-equipment-div")
      } else if (equipment.type == "auxuliary") {
        equipmentDiv = document.getElementById("aux-equipment-div")
      } else {
        equipmentDiv = document.getElementById("cable-equipment-div")
      }

      // Create the offer Table
      const offerTable = createEquipmentTable(equipment, "main");

      equipmentDiv.appendChild(offerTable);

      // Create a summary row
      const summaryTable = document.getElementById("summaryTable")
      const summaryTableBody = summaryTable.childNodes[1];
      
      const summaryRow = createSummaryRow(equipment);

      summaryTableBody.appendChild(summaryRow);
      

      // Find the warnings
      findWarnings(equipment);

      // Toggle visibilty and color
      toggleTableVisibility(equipment.id+"-DDL");
      changeColor(equipment.id+"-DDL");
      
       

    }else if (page=="review"){
      const mainContent = document.getElementById("reviewMainContent")

      const offerTable = createEquipmentTable(equipment, page);
      
      const offerTableId = offerTable.childNodes[0].id.replace("-OffersTable", "-ReviewTable");
      
      mainContent.appendChild(offerTable);

      // Toggle visibilty and color
      //toggleTableVisibility(equipmentId+"-DDL");
      //changeColor(equipmentId+"-DDL")

    }
  }
  
  /**
   * selectAll: changes the value for all drop-down lists based on radio button selection
   * @param {input} globalSelector: radio button for model selection
   * @param {array} selectedTypes: the types associated with the selected radio button.
   */

  function selectAll(globalSelector, selectedTypes) {
    // Get all the dropDownLists
    const lists = document.querySelectorAll(`select[data-type = "control"]`);
    lists.forEach((list) => {
      const equipmentId = list.id.slice(0, -4);
      if (selectedTypes.includes(list.dataset.voltage)) {
        //If global selector is checked but the list says otherwise
        if (globalSelector.checked && list.value != "Include") {
          list.value = "Include";
          //If global selector is unchecked but the list says otherwise
        } else if (!globalSelector.checked && list.value != "Exclude") {
          list.value = "Exclude";
        }
        toggleTableVisibility(equipmentId + "-DDL");
        toggleSummaryRow(equipmentId);
        changeColor(equipmentId + "-DDL");
      }
    });
  }

  /**
   * resetGlobalSelectors: fixes selection for all drop down lists in the control panel when the model changes.
   * @param {string} currentType: the type of voltage chosen by the radio buttons
   */
  function resetGlobalSelections(currentType) {
    const globalSelectors = { EHV: allEHV, HV: allHV };
    Object.keys(globalSelectors).forEach((type) => {
      if (type !== currentType) {
        globalSelectors[type].checked = false;
        selectAll(globalSelectors[type], [type]);
      }
    });
  }

  /**
   * createControlPanelRow: Creates a control panel row using an equipment object
   * Should return a row instead
   * @param {Equipment} equipment
   */
  function createControlPanelRow(equipmentId) {
    equipmentVoltage = equipmentId.split("-")[0];
    equipmentName = equipmentId.split("-")[1];

    const body = document.getElementById("controlPanelBody");

    const controlPanelRow = document.createElement("tr");
    controlPanelRow.name = equipmentName + "Row";

    const controlPanelNameCell = document.createElement("td");
    
    var tempString = "";
    // 
    if (equipmentVoltage != "General"){
      tempString += equipmentVoltage+" ";
    }
    tempString += equipmentName; 

    controlPanelNameCell.textContent = tempString

    const controlPanelListCell = document.createElement("td");
    controlPanelListCell.setAttribute("id", equipmentId + "-DDLListCell");

    const dropdownList = createDropDownList(equipmentId);

    controlPanelListCell.appendChild(dropdownList);

    controlPanelRow.appendChild(controlPanelNameCell);
    controlPanelRow.appendChild(controlPanelListCell);

    body.appendChild(controlPanelRow);
  }

  /**
   * createDropDownList: creates a drop-down list and appends it to the cell
   * @param {string} equipmentId: equipment ID
   * @returns {HTML Input} dropdownList
   */
  function createDropDownList(equipmentId) {
    // create the drop-down List:

    // Voltage and name
    equipmentVoltage = equipmentId.split("-")[0];
    equipmentName = equipmentId.split("-")[1];

    // All possible obtions
    const options = ["Include", "Exclude", "Other Contractor"];

    // create the HTML element
    const dropdownList = document.createElement("select");

    // Add data attribute for both voltage and cell type.
    dropdownList.dataset.voltage = equipmentVoltage;
    dropdownList.dataset.type = "control";
    
    // Name = eqName + DDL (drop down list)
    dropdownList.name = equipmentName + "DDL";
    
    // ID = eqID + -DDL
    dropdownList.id = equipmentId + "-DDL";

    // Forgot what we used this one for tbh
    dropdownList.className = equipmentId;

    // create the options and add them to the list
    options.forEach((option) => {
      const temp = document.createElement("option");
      temp.setAttribute("value", option);
      temp.text = option;
      dropdownList.appendChild(temp);

      // Add event listener to toggle table visibility
      dropdownList.addEventListener("change", () => {
        changeColor(dropdownList.id);
        toggleSummaryRow(equipmentId);
        toggleTableVisibility(equipmentId + "-DDL");
        calculateGrandTotal("main")
      });
    });
    return dropdownList;
  }

  // This one is in desperate need for reafactoring, it's hardly even readable at this point
  /**
   * Create equipment table refactor: 
   * 
   * 6 Lists of columns (regular - main, regular review, ...) -> Done
   * HEADER: 
   *  Create table header col span -> Done
   *  create header row -> Done
   *  loop through them to create header cells
   *  assign text contnet 
   *  add cells to second header
   *  set table header col span to lenght of column list 
   * BODY: 
   *  Empty, will be filled by the system
   * FOOTER: 
   *  only in main page
   */

  /**
   * createEquipMentTable: create a single equipment table
   * @param {Equipment} equipment Object
   * @param {String} page  main or review
   * @returns HTML table
   * Should be split to smaller functions, maybe split by page. 
   */
  function createEquipmentTable(equipment, page) {  
    
    // Columns
    const regularMainColumns = [
      "Delete",
      "Edit",
      "Vendor",
      "Unit",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    const regularReviewColumns = [
      "Vendor",
      "Unit",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    const auxMainColumns = [
      "Delete",
      "Edit",
      "Item",
      "Unit",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    const auxReviewColumns = [
      "Item",
      "Unit",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    const cableMainColumns = [
      "Delete",
      "Edit",
      "Name",
      "StPoint",
      "EndPoint",
      "ConnectionNum",
      "Phase",
      "Cores",
      "Length",
      "TotalLength",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    const cableReviewColumns = [
      "Name",
      "StPoint",
      "EndPoint",
      "ConnectionNum",
      "Phase",
      "Cores",
      "Length",
      "TotalLength",
      "Quantity",
      "Price",
      "FAT",
      "Shipping",
      "Customs",
      "Additional",
      "TotalPrice",
      "Notes",
      "PDF",
      "Select",
      "Linked Equipment"
    ];

    var columns = [];
    
    // Common behaviour
    const equipmentId = equipment.id
    const equipmentVoltage = equipment.voltage
    const equipmentName = equipment.name
    const equipmentType = equipment.type

    // Create new table
    const equipmentTable = document.createElement("table");
    
    // Set the class to equipment-table, used in {}
    equipmentTable.classList.add("equipment-table");
    equipmentTable.classList.add(String(equipmentType))

    // CSS, move later
    equipmentTable.setAttribute("border", 1);

    
    // Create table structure
    const tableHeader = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    const tableFooter = document.createElement("tfoot");

    // Create table header
    const header = document.createElement("th");
    
    // Set text content header
    header.textContent = equipmentVoltage + " " + equipmentName;
    
    
    // Header cells, fill using the arrays

    // Main page, should this be a switch-case? 
    if (equipmentType == "regular" && page == "main"){
      columns = regularMainColumns; 
    }
    else if (equipmentType == "auxuliary" && page == "main"){
      columns = auxMainColumns; 
    }
    else if (equipmentType == "cable" && page == "main"){
      columns = cableMainColumns
    }
    // Review page
    else if (equipmentType == "regular" && page == "review"){
      columns = regularReviewColumns; 
    }
    else if (equipmentType == "auxuliary" && page == "review"){
      columns = auxReviewColumns; 
    }
    else if (equipmentType == "cable" && page == "review"){
      columns = cableReviewColumns; 
    }
    else{
      alert("Table creation error")
    }

    const tableWidth = columns.length

    header.colSpan = tableWidth

    // Append the table header to the thead
    tableHeader.appendChild(header);

   
    // Fill the header row
    const headerRow = document.createElement("tr")
    columns.forEach((column) => {
      const tempCell = document.createElement("th")
      if (column == "Delete" || column == "Edit"){
        tempCell.textContent = ""
      }
      else {
        tempCell.textContent = column
      }
      headerRow.appendChild(tempCell)
    });
  
    tableHeader.appendChild(headerRow);
    equipmentTable.appendChild(tableHeader);
    
  
    const selectionCell = equipmentTable.childNodes[0].childNodes[1].childNodes[tableWidth-2];
    // Modify the rest of the table
    if (page == "main"){
      
      // Table Id
      equipmentTable.setAttribute("name", equipmentName + "OfferTable");
      equipmentTable.setAttribute("id", equipmentId + "-OffersTable");
      
      // Add the "select minimum" button
      if (equipmentType == "regular"){
        const selectMinimumButton = createSelectionButton(equipmentTable, "minimum");
        selectionCell.appendChild(selectMinimumButton);
      }
      // Add a "select all" button
      else if (equipmentType == "auxuliary" || equipmentType == "cable"){
        
        const selectAllButton = createSelectionButton(equipmentTable,"all")
        selectionCell.appendChild(selectAllButton);
      }

      else{

        alert("Table creation error 204" + equipmentType)
      }
      
    }
    // Review page
    else if (page == "review"){

      // Table Id
      equipmentTable.setAttribute("name", equipmentName + "ReviewTable");
      equipmentTable.setAttribute("id", equipmentId + "-ReviewTable");

      // Add the change selection button
      if (equipmentType == "regular" || equipmentType == "auxuliary"){
        equipmentTable.dataset.mode = "view"
  
        const changeSelectionOrSaveChangesButton = createSelectionButton(equipmentTable, "change");
        
        selectionCell.appendChild(changeSelectionOrSaveChangesButton);
        
      }

      else if (equipmentType == "cable"){
       // Pain so far 
      }
      else{
        alert("Table creation error 208")
      }
    }
    else{
      alert("Table creation error 103")
    }
    // Up until here, I have a complete table header 

    // Add the body to the table, it will be filled later
    equipmentTable.appendChild(tableBody);

    // Create and add the table footer, main page only. 

    if (page == "main"){
      const footerRow = document.createElement("tr")
    
      const addButtonCell = document.createElement("td");

      // set the width to cover the whole row
      addButtonCell.setAttribute("colspan", tableWidth);

      const addButton = createAddButton(equipment, equipmentTable); 

      // Add the button to its cell 
      addButtonCell.appendChild(addButton);

      // Add the cell to the row
      footerRow.appendChild(addButtonCell);

      // add The row to the footer
      tableFooter.appendChild(footerRow);
    }
    
    // Add the footer to the table
    equipmentTable.appendChild(tableFooter);
    

    // Return the table 
    const div = document.createElement("div");
    
    div.setAttribute("id", equipmentId + "-Div");

    div.appendChild(equipmentTable);
    // Horizantal seperator between tables
    div.appendChild(document.createElement("hr"));
    return div;
  


    // Almost done with this code V V
    /*
    // Break this down V V
    // First cell
    const vendorHeaderCell = document.createElement("th");

    // if eq. type is cable
    if (equipment.type == "cable"){
      equipmentTable.setAttribute("name", equipmentName + "OfferTable");
      equipmentTable.setAttribute("id", equipmentId + "-OffersTable");
 

      // Create table header
      const header = document.createElement("th");
      header.textContent = "Cable Works";
      header.setAttribute("colspan", 21);

      // 2nd row, also header
      const headerRow = document.createElement("tr");

      // Columns

      const buttonHeaderCell = document.createElement("th");
      buttonHeaderCell.colSpan = 2;  

      const nameCell = document.createElement("th");
      nameCell.textContent = "Name";

      const startPointCell = document.createElement("th");
      startPointCell.textContent = "Start Point";

      const endPointCell = document.createElement("th");
      endPointCell.textContent = "End Point";

      const connectionNumCell = document.createElement("th");
      connectionNumCell.textContent = "Connection Ends No.";

      const phasesCell = document.createElement("th");
      phasesCell.textContent = "Phases";

      const coresCell = document.createElement("th");
      coresCell.textContent = "Cores";

      const lengthCell = document.createElement("th");
      lengthCell.textContent = "Length";

      const totalLengthCell = document.createElement("th");
      totalLengthCell.textContent = "Total Length";

      const QTYCell = document.createElement("th");
      QTYCell.textContent = "Quantity";

      const priceCell = document.createElement("th");
      priceCell.textContent = "Price";

      const FATCell = document.createElement("th");
      FATCell.textContent = "FAT";

      const shippingCell = document.createElement("th");
      shippingCell.textContent = "Shipping";

      const customsCell = document.createElement("th");
      customsCell.textContent = "Customs";

      const optionalCell = document.createElement("th");
      optionalCell.textContent = "Optional";

      const totalPriceCell = document.createElement("th");
      totalPriceCell.textContent = "Total Price";

      const notesCell = document.createElement("th");
      notesCell.textContent = "Notes";

      const pdfCell = document.createElement("th");
      pdfCell.textContent = "PDF";

      const selectCell = document.createElement("th");
      selectCell.textContent = "Select";

      const linkedCell = document.createElement("th");
      linkedCell.textContent = "Linked Equipment";
      
      // Append HeaderCells to row
      headerRow.appendChild(buttonHeaderCell);
      headerRow.appendChild(nameCell);
      headerRow.appendChild(startPointCell);
      headerRow.appendChild(endPointCell);
      headerRow.appendChild(connectionNumCell);
      headerRow.appendChild(phasesCell);
      headerRow.appendChild(coresCell);
      headerRow.appendChild(lengthCell);
      headerRow.appendChild(totalLengthCell);
      headerRow.appendChild(QTYCell);
      headerRow.appendChild(priceCell);
      headerRow.appendChild(FATCell);
      headerRow.appendChild(shippingCell);
      headerRow.appendChild(customsCell);
      headerRow.appendChild(optionalCell);
      headerRow.appendChild(totalPriceCell);
      headerRow.appendChild(notesCell);
      headerRow.appendChild(pdfCell);
      headerRow.appendChild(selectCell);
      headerRow.appendChild(linkedCell);

      tableHeader.appendChild(header);
      tableHeader.appendChild(headerRow);

      // Body

      // Footer
      const footerRow = document.createElement("tr");
      const addCableButtonCell = document.createElement("td");
      addCableButtonCell.setAttribute("colspan", 21);

      const addCableButton = document.createElement("button");

      const addSymbol = document.createElement("img");
      addSymbol.setAttribute("src", "./images/Add symbol.png");
      addSymbol.setAttribute("alt", "Add Cable");

      addCableButton.appendChild(addSymbol);

      addCableButtonCell.appendChild(addCableButton);

      footerRow.appendChild(addCableButtonCell);

      tableFooter.appendChild(footerRow);

      equipmentTable.appendChild(tableHeader);
      equipmentTable.appendChild(tableBody);
      equipmentTable.appendChild(tableFooter);


      // add new cable eventlistener
      addCableButton.addEventListener("click", () => {
        addCableButton.setAttribute("hidden", "hidden")
        const lastRow = addCableButton.parentElement;
        
        // new cable options
        const optionsDiv = document.createElement("div")
        optionsDiv.innerHTML = `
                            <label>Options:</label>
                            <select id="cable-options">
                              <option value="cable">Cable</option>
                              <option value="termination">Termination</option>
                              <option value="tray">Tray</option>
                            </select>

                            <label>Voltage:</label>
                            <select id="cable-voltage">
                              <option value="EHV">EHV</option>
                              <option value="HV">HV</option>
                              <option value="MV">MV</option>
                              <option value="LV">LV</option>
                            </select>
                            <div>
                              <button id="cable-discard"> <img src="images/Discard Symbol.png" alt="discard button"> </button>
                              <button id="cable-save"><img src="images/Save Symbol.png" alt="Save button"></button>
                            </div>
        `

        lastRow.appendChild(optionsDiv)

        // save cable button
        const cableSaveBtn = document.getElementById("cable-save")
        cableSaveBtn.addEventListener("click", () => {

          const cableOption = document.getElementById("cable-options").value
          const cableVoltage = document.getElementById("cable-voltage").value
          
          // to count option-cable rows
          const optionCableList = document.getElementsByClassName("option-cable")
          if (cableOption == "cable") {

            // if Option = cable for the first time, make 3 rows
            if (optionCableList.length == 0) {
              var cableRow = createCableRow(equipment, "main")
              const terminationRow = createCableRow(equipment, "main")
              const trayRow = createCableRow(equipment, "main")
              terminationRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
              trayRow.childNodes[2].textContent = cableVoltage + "-Cables Tray" 

              // else make one row
            } else {
              var cableRow = createCableRow(equipment, "main")
            }
           cableRow.classList.add("option-cable")
            
            // cableRow.childNodes[10].style.backgroundColor = "gray"

          }
          else if (cableOption == "termination") {
            const terminationRow = createCableRow(equipment, "main")
            terminationRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
          }
          
          else {
          const trayRow = createCableRow(equipment, "main")
          trayRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
        }

        optionsDiv.remove()
        addCableButton.removeAttribute("hidden")
        })

        // discard cable button
        const cableDiscard = document.getElementById("cable-discard")
        cableDiscard.addEventListener("click", () => {
          optionsDiv.remove()
          addCableButton.removeAttribute("hidden")
        })
      })


      const div = document.createElement("div");
      div.setAttribute("id", equipmentId + "-Div");
  
      div.appendChild(equipmentTable);
      // Horizantal seperator between tables
      div.appendChild(document.createElement("hr"));
      return div; 
    }

      // tables other than cable
    else{
        
        // regular
        if (equipment.type == "regular") {
          vendorHeaderCell.textContent = "Vendor";
        }
        // auxuliary
        else {
          vendorHeaderCell.textContent = "Item";
        }
      // Create and add the cells
      
      const unitHeaderCell = document.createElement("th");
      unitHeaderCell.textContent = "Unit";
  
      const quantityHeaderCell = document.createElement("th");
      quantityHeaderCell.textContent = "Quantity";
  
      const priceHeaderCell = document.createElement("th");
      priceHeaderCell.textContent = "Price";
  
      const FATHeaderCell = document.createElement("th");
      FATHeaderCell.textContent = "FAT";
  
      const shippingHeaderCell = document.createElement("th");
      shippingHeaderCell.textContent = "Shipping";
  
      const customsHeaderCell = document.createElement("th");
      customsHeaderCell.textContent = "Customs %";
  
      const optionalHeaderCell = document.createElement("th");
      optionalHeaderCell.textContent = "Optional";
  
      const totalPriceHeaderCell = document.createElement("th");
      totalPriceHeaderCell.textContent = "Total Price";
  
      const notesHeaderCell = document.createElement("th");
      notesHeaderCell.textContent = "Notes";
  
      const PDFHeaderCell = document.createElement("th");
      PDFHeaderCell.textContent = "PDF";
  
      const selectHeaderCell = document.createElement("th");
     

      const linkedEquipmentCell = document.createElement("th")
      linkedEquipmentCell.textContent = "Linked Equipment"
      
      // Different funcitonlity for each page
      if (page == "main"){  
  
        selectHeaderCell.textContent = "Select";
        // Name and ID
        equipmentTable.setAttribute("name", equipmentName + "OfferTable");
        equipmentTable.setAttribute("id", equipmentId + "-OffersTable");
        
        // Set col span
        header.setAttribute("colspan", 15);  
  
        // Create Header HeaderCells
        const buttonHeaderCell = document.createElement("th");
        buttonHeaderCell.colSpan = 2;  
  
        const selectMinimumBtn = document.createElement("button");
        selectMinimumBtn.setAttribute("id", "select-minimum-btn");
        selectMinimumBtn.textContent = "Select Minimum";
        selectHeaderCell.style.display = "flex";
        selectHeaderCell.style.flexDirection = "column";
        
        selectMinimumBtn.addEventListener("click", () => {
          const equipmentTable = document.getElementById(
            equipmentId + "-OffersTable"
          );
          const equipmentTableBody = equipmentTable.childNodes[1];
          const offers = equipmentTableBody.childNodes;
          const prices = [];
  
          // finding the minimum price, currently selects the last one for some reason. 
          offers.forEach((offerRow) => {
            const offer = createOfferObject(offerRow);
            prices.push(offer["totalPrice"]);
          });
  
          const minimumPrice = findMinimum(prices);
  
          // selecting the minimum price
          offers.forEach((offerRow) => {
            const offer = createOfferObject(offerRow);
            if (offer["totalPrice"] == minimumPrice) {
              const radio = offerRow.childNodes[13].lastChild;
  
              // selecting the offer
              radio.checked = true;
              highlightSelectedOffer(equipmentId, "main");
              findWarnings(equipment);
              return;
            }
          });
          calculateGrandTotal("main")
  
        });
  
        selectHeaderCell.append(selectMinimumBtn);
  
        // Append HeaderCells to row
        headerRow.appendChild(buttonHeaderCell);
        headerRow.appendChild(vendorHeaderCell);
        headerRow.appendChild(unitHeaderCell);
        headerRow.appendChild(quantityHeaderCell);
        headerRow.appendChild(priceHeaderCell);
        headerRow.appendChild(FATHeaderCell);
        headerRow.appendChild(shippingHeaderCell);
        headerRow.appendChild(customsHeaderCell);
        headerRow.appendChild(optionalHeaderCell);
        headerRow.appendChild(totalPriceHeaderCell);
        headerRow.appendChild(notesHeaderCell);
        headerRow.appendChild(PDFHeaderCell);
        headerRow.appendChild(selectHeaderCell);
        headerRow.appendChild(linkedEquipmentCell);
  
        // Body
  
        // footer
        const footerRow = document.createElement("tr");
  
        const addOfferButtonCell = document.createElement("td");
        addOfferButtonCell.setAttribute("colspan", 15);
  
        const addOfferButton = document.createElement("button");
        addOfferButton.setAttribute("id", equipmentId + "-Btn");
  
        const addSymbol = document.createElement("img");
        addSymbol.setAttribute("src", "./images/Add symbol.png");
  
        addSymbol.setAttribute("alt", "Add Offer");
  
        addOfferButton.appendChild(addSymbol);
  
        addOfferButton.addEventListener("click", () => {
          const offerRows = tableBody.childNodes
          if (offerRows.length != 0) {
            const lastOfferRow = offerRows[offerRows.length - 1]
            const lastOffer = createOfferObject(lastOfferRow)
            // if the previous offer vendor name is empty
            if (lastOffer["vendor"] == "") {
              alert("You can't add a new offer if the previous offer is empty")
            }
  
            // else, create offer row
            else {
              createOfferRow(equipment, "main");
              findWarnings(equipment);
            }
          }
  
          // if there are no previous offers
          else {
            createOfferRow(equipment, "main");
            findWarnings(equipment);
          }
        });
  
        addOfferButtonCell.appendChild(addOfferButton);
  
        footerRow.appendChild(addOfferButtonCell);
  
        tableFooter.appendChild(footerRow);
        
  
      }
      else if (page == "review"){ 
        // Name and ID
        equipmentTable.setAttribute("name", equipmentName + "ReviewTable");
        equipmentTable.setAttribute("id", equipmentId + "-ReviewTable");
        
        // Set col span
        header.setAttribute("colspan", 12);
  
        equipmentTable.dataset.mode = "view"
  
        // Change selection button
        const changeSelectionOrSaveChangesButton = document.createElement("button");
        changeSelectionOrSaveChangesButton.textContent = "change selection";
        
        // Change selection functionality
        changeSelectionOrSaveChangesButton.addEventListener("click", ()=>{
          var mode = equipmentTable.dataset.mode;  
          const offers = tableBody.childNodes
          
          // if view mode, turn on edit mode
          if (mode == "view"){
  
            changeSelectionOrSaveChangesButton.textContent = "save"; 
            equipmentTable.dataset.mode = "change";
            
            offers.forEach((offer)=>{
              // Show all offers
              offer.removeAttribute("hidden");
              offer.childNodes[11].removeAttribute("hidden");
              
              // If the offer is selected, highlight it
              if (offer.childNodes[11].lastChild.checked){
                offer.classList.add("selected");
              }
            });
          }
  
          // If change mode, save changes and turn on view mode
          else if (mode == "change"){
            equipmentTable.dataset.mode = "view"
            changeSelectionOrSaveChangesButton.textContent = "Change selection"
            
            offers.forEach((offer)=>{
              // remove the selection highligh
              offer.classList.remove("selected")
              // hide the last cell for all offers
              
              offer.childNodes[11].setAttribute("hidden","hidden")
              offer.setAttribute("hidden","hidden")

              // If the offer is not selected, hide it
              if (offer.childNodes[11].lastChild.checked){
                offer.removeAttribute("hidden");             
              }
            });
          }
        });
        
  
        selectHeaderCell.appendChild(changeSelectionOrSaveChangesButton);
  
        // Append cells to row
        headerRow.appendChild(vendorHeaderCell);
        headerRow.appendChild(unitHeaderCell);
        headerRow.appendChild(quantityHeaderCell);
        headerRow.appendChild(priceHeaderCell);
        headerRow.appendChild(FATHeaderCell);
        headerRow.appendChild(shippingHeaderCell);
        headerRow.appendChild(customsHeaderCell);
        headerRow.appendChild(optionalHeaderCell);
        headerRow.appendChild(totalPriceHeaderCell);
        headerRow.appendChild(notesHeaderCell);
        headerRow.appendChild(PDFHeaderCell);
        headerRow.appendChild(selectHeaderCell);
      }
  
      tableHeader.appendChild(header);
      tableHeader.appendChild(headerRow);
  
  
      // Append table body to equipment table
      equipmentTable.append(tableHeader);
      equipmentTable.append(tableBody);
      equipmentTable.append(tableFooter);
  
      
  
      const div = document.createElement("div");
      div.setAttribute("id", equipmentId + "-Div");
  
      div.appendChild(equipmentTable);
      // Horizantal seperator between tables
      div.appendChild(document.createElement("hr"));
      return div; 
    }
  */
    // Break this down ^^^
  }



  /**
   * createSummaryRow: Takes equipment id and create a summary row using that equipment's Dropdown List value
   * @param {String} equipmentId
   * @returns {HTML tr} Summary Row
   */

  function createSummaryRow(equipment) {
    
    const equipmentId = equipment.id

    const dropDownListId = equipmentId + "-DDL";
    const selectedList = document.getElementById(dropDownListId);

    const equipmentVoltage = equipment.voltage;
    const equipmentName = equipment.name;

    selectedList.value = equipment.selection
    const summaryRow = document.createElement("tr");

    const includedCell = document.createElement("td");
    const warningCell = document.createElement("td");

    includedCell.textContent = equipmentVoltage + " " + equipmentName;

    // should be filled with another function
    warningCell.textContent = "";
    warningCell.style.backgroundColor = "rgb(44, 232, 74, 0.3)";

    warningCell.setAttribute("id", equipmentId + "-Warning");

    summaryRow.appendChild(includedCell);
    summaryRow.appendChild(warningCell);

    summaryRow.setAttribute("id", equipmentId + "-SummaryRow");

    if (equipment.selection == "Include"){
      summaryRow.removeAttribute("hidden")
    }
    else {
      summaryRow.setAttribute("hidden", "hidden")
    }
    // Return the created row
    return summaryRow    
  }

  /**
   * findWarnings: finds warnings and updates the summary table
   * @param {Equipment} equipment 
   * @param {String} page main or review
   */
  function findWarnings(equipment, page ="main") {
    
    // Temporary, should be fixed later
    if (page == "review"){return}
    const equipmentId = equipment.id 
    
    var warningCellId = equipmentId + "-Warning";
    const warningCell = document.getElementById(warningCellId);
    const equipmentType = equipment.type

    // Default to gold color
    warningCell.style.backgroundColor = "gold";

    // Get the table
    const equipmentTable = document.getElementById(
      warningCellId.replace("-Warning", "-OffersTable")
    );
    const equipmentTableHeader = equipmentTable.childNodes[0];
    const equipmentTableBody = equipmentTable.childNodes[1];
    const offerList = equipmentTableBody.childNodes;

    // Current warnings
    var isEmpty = false;
    var hasSelectedOffer = false;
    var selectedOfferIsMinimum = false;

    // warning 1: Empty offer table
    if (!offerList[0]) {
      isEmpty = true;
    } else { 
      // Array to store prices, finding minimum
      var offerPrices = [];
      var selectedPrice;
      // Check if no offer is selected
      offerList.forEach((offerRow)=> {
        if (equipmentType != "cable") {  
          var offer = createOfferObject(offerRow, page)
        } else {var offer = createCableObject(offerRow, page)
        }
        
       offerPrices.push(offer["totalPrice"]);
        // Check for a selected offer 
        if (offer["isSelected"]) {
          hasSelectedOffer = true;
          selectedPrice = offer["totalPrice"];
        }
      });
    }
    // Empty table: 
    if (isEmpty){
      warningCell.textContent = "Empty offer table";  
      equipmentTableHeader.style.backgroundColor = "gold";
    } else if (!hasSelectedOffer) {
      // No selected offer
      warningCell.textContent = "No offer is selected";
      equipmentTableHeader.style.backgroundColor = "gold";
    }
    else{ // Offer is selected, but is it minimum?
      const minimumPrice = findMinimum(offerPrices);
      if (selectedPrice == minimumPrice) {
        selectedOfferIsMinimum = true;
      }
      if (!selectedOfferIsMinimum) {
        warningCell.textContent = "Offer selected is not minimum";
        equipmentTableHeader.style.backgroundColor = "gold";
      } else {
        warningCell.textContent = "N/A";
        warningCell.style.backgroundColor = "rgb(44, 232, 74, 0.3)";
        equipmentTableHeader.style.backgroundColor = "rgb(196, 196, 196, 0.5)";
      }
    }
  }

  /**
   * findMinimum: Finds the minimum price for a certain array of offer prices. 
   * @param {Number []} array of offer prices
   * @returns {Number} minimumPrice
   */
  function findMinimum(prices) {
    var minPrice = prices[0];
    prices.forEach((price) => {
      if ([price] < minPrice) {
        minPrice = price;
      }
    });
    return minPrice;
  }

  /**
   * toggleSummaryRow: Shows or hides the summary row of the given equipment
   * @param {String} equipmentId
   */
  function toggleSummaryRow(equipmentId) {
    const selectedList = document.getElementById(equipmentId + "-DDL");

    const summaryRowId = equipmentId + "-SummaryRow";
    const selectedSummaryRow = document.getElementById(summaryRowId);

    if (selectedList.value == "Include") {
      // Add the equipment to the included array
      // incldedEquipmentArray.push(equipmentName); tempcomment
      // Show the Row
      selectedSummaryRow.removeAttribute("hidden");
      // Set the warnings cell to green
      selectedSummaryRow.childNodes[1].style.backgroundColor =
        "rgb(44, 232, 74, 0.3)";
    } else if (selectedList.value == "Exclude") {
      // Remove the equipment from the included array
      // incldedEquipmentArray.splice(
      //   incldedEquipmentArray.indexOf(equipmentName),
      //   1
      // ); tempcomment
      // Hide the row
      selectedSummaryRow.setAttribute("hidden", "hidden");
    } else if (selectedList.value == "Other Contractor") {
      // Add the equipment to the included array
      // incldedEquipmentArray.push(equipmentName); tempcomment
      // Show the row
      selectedSummaryRow.removeAttribute("hidden");
      // Warning cell to gold
      selectedSummaryRow.childNodes[1].style.backgroundColor = "gold";
    }
  }

  /**
   * createOfferRow: function to create a single empty offer row.
   * @param {string} equipmentId: caller ID
   * @returns {HTML tr} Offer row
   */
  function createOfferRow(equipment, page, linked = false) {
    const equipmentId = equipment.id
    if (page == "main"){
      // Use button Id to find table using table Id.
      const tableId = equipmentId+"-OffersTable";
      const table = document.getElementById(tableId);

        var columns = [
          "delete",
          "edit",
          "vendor",
          "unit",
          "quantity",
          "price",
          "FAT",
          "shipping",
          "customs",
          "optional",
          "totalPrice",
          "notes",
          "PDF",
          "select",
          "linked"
        ];
      
        
      const offerRow = document.createElement("tr");
      offerRow.dataset.mode = "view";
      offerRow.dataset.oldOffer = ""
      if (linked){
        offerRow.id = linked+"-"+equipmentId
      }
      else{
        offerRow.id = equipmentId+"-Offer"+table.childNodes[1].childNodes.length
      } 
      
        
      // create cells and append them to the row
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.setAttribute("name", column + "Cell");
        offerRow.appendChild(cell);
      });

      // Delete/Discard offer button
      const deleteOrDiscardOfferButton = document.createElement("button");

      // For delete
      const deleteSymbol = document.createElement("img");

      deleteSymbol.setAttribute("src", "./images/Delete Symbol.png");
      deleteSymbol.setAttribute("alt", "Delete Offer");

      deleteOrDiscardOfferButton.appendChild(deleteSymbol);

      // For discard
      const discardSymbol = document.createElement("img");

      discardSymbol.setAttribute("src", "./images/Discard Symbol.png");
      discardSymbol.setAttribute("alt", "Discard Changes");

      // delete cell is the first in the row
      offerRow.childNodes[0].appendChild(deleteOrDiscardOfferButton);

      // Edit/Save offer button
      const editOrSaveOfferButton = document.createElement("button");

      // For edit
      const editSymbol = document.createElement("img");

      editSymbol.setAttribute("src", "./images/Edit Symbol.png");
      editSymbol.setAttribute("alt", "Edit Offer");

      editOrSaveOfferButton.appendChild(editSymbol);

      // For save
      const saveSymbol = document.createElement("img");

      saveSymbol.setAttribute("src", "./images/Save Symbol.png");
      saveSymbol.setAttribute("alt", "Save Changes");

      // Append the button
      offerRow.childNodes[1].appendChild(editOrSaveOfferButton); // Edit button is the second in the row

      // Radio button for selecting the offer
      const radio = document.createElement("input");
      
      // if equipment is auxiliary or cable, then check box
      if (equipment.type == "auxuliary") {
        radio.setAttribute("type", "checkbox")
        radio.addEventListener("change", () => {
          // highlightSelectedOffer(equipmentId, page);
          // findWarnings(equipmentId);
          
          const cells = offerRow.childNodes
          const selected = cells[cells.length-1].lastChild.checked
          if (selected) {
            offerRow.classList.add("selected")
          } else {
            offerRow.classList.remove("selected")
          }
          // grand total calculation
          calculateGrandTotal("main")
        });
      }
      // else if equipment is regular, then radio
      else {
        radio.setAttribute("type", "radio");
        radio.addEventListener("change", () => {
          
          highlightSelectedOffer(equipmentId, page);

          findWarnings(equipment);
  
          // grand total calculation
          calculateGrandTotal("main")
        });
  
      }


      const groupName = tableId + "-Radio";
      
      // Id should be changed to something else, currenly causes conflicts
      radio.setAttribute("id", offerRow.id+"-Radio"); // added an id

      radio.setAttribute("name", groupName);

      
      // Append the row to the table body
      
      // Should be a return function here
      const tbody = table.childNodes[1];
      tbody.append(offerRow);
      
      offerRow.childNodes[13].appendChild(radio);
      

      // Event listener for the edit/Save button for regular and aux.
       
      editOrSaveOfferButton.addEventListener("click", () => {
        const mode = offerRow.dataset.mode;
       
        const oldOffer = createOfferObject(offerRow, "main").toArray();
        // Store old values
        offerRow.dataset.oldOffer = oldOffer

        if (mode == "view") {
          // If view, then Edit.
          // Change the symbol edit -> save
          editOrSaveOfferButton.childNodes[0].remove();
          editOrSaveOfferButton.appendChild(saveSymbol);
          
          // Change the symbol delete -> discard
          deleteOrDiscardOfferButton.childNodes[0].remove();
          deleteOrDiscardOfferButton.appendChild(discardSymbol);
          
          // Edit functionalty
          editMode(offerRow);


        } else if (mode == "edit") {
          
          // check if the vendor name is filled 
          // If edit, then save.
          const vendorName = offerRow.childNodes[2].lastChild.value
          if (vendorName == "") {
            alert("Vendor name is empty")
          }
          else {
            
            offerRow.dataset.mode = "view";
            
            // Change the symbol save -> edit
            editOrSaveOfferButton.childNodes[0].remove();
            editOrSaveOfferButton.appendChild(editSymbol);
            
            // Change the symbol discard -> delete
            deleteOrDiscardOfferButton.childNodes[0].remove();
            deleteOrDiscardOfferButton.appendChild(deleteSymbol);
            
            // Save functionalty
            saveChanges(offerRow);
            // linkedEquipmentFunctionality(offerRow.childNodes[14], offerRow);
            
            findWarnings(equipment);
            calculateGrandTotal(page)
          }
        }
      

      //Event listner for the delete/Discard button
      deleteOrDiscardOfferButton.addEventListener("click", () => {
        const mode = offerRow.dataset.mode;
        if (mode == "view") {
          // If view, delete
          // Delete functionalty
          if (confirm("Are you sure you want to delete this offer?")) {
            const tempRow =
              deleteOrDiscardOfferButton.parentElement.parentElement;
            tempRow.remove();
          }
        } else if (mode == "edit") {
          // If edit, then discard
          // Change the symbol discard -> delete
          deleteOrDiscardOfferButton.childNodes[0].remove();
          deleteOrDiscardOfferButton.appendChild(deleteSymbol);

          // Change the symbol save -> edit
          editOrSaveOfferButton.childNodes[0].remove();
          editOrSaveOfferButton.appendChild(editSymbol);

          
          const tempRow = deleteOrDiscardOfferButton.parentElement.parentElement;
          discardChanges(tempRow);
          offerRow.dataset.mode = "view";

        }
        findWarnings(equipment);
      });

      
      return offerRow;

    })
   
    }
    else if(page == "review"){

      // Get the table
      const tableId = equipmentId+"-ReviewTable";
      const table = document.getElementById(tableId);
      
      const columns = [
        "vendor",
        "unit",
        "quantity",
        "price",
        "FAT",
        "shipping",
        "customs",
        "optional",
        "totalPrice",
        "notes",
        "PDF",
        "select",
      ];

      // Create Emptey row
      const offerRow = document.createElement("tr");
      offerRow.dataset.mode = "view";
      offerRow.id = equipmentId+"-Offer"+table.childNodes[1].childNodes.length

      // create cells and append them to the row
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.setAttribute("name", column + "Cell");
        offerRow.appendChild(cell);
      });

      // Should be radio?
      // checkbox button for selecting the offer
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");

      const groupName = tableId + "-Checkbox";
      // Id should be changed to something else
      checkbox.setAttribute("id", groupName); // added an id
      checkbox.setAttribute("name", groupName);

      checkbox.addEventListener("change", () => {
        highlightSelectedOffer(equipmentId, page);
        //findWarnings(equipmentId);

        checkbox.checked = false
        // grand total calculation
      calculateGrandTotal(page);
      });

      offerRow.childNodes[11].appendChild(checkbox);
      
      offerRow.childNodes[11].setAttribute("hidden", "hidden")

      // Append the row to the table body
      // Should be a return function here
      const tbody = table.childNodes[1];
      tbody.append(offerRow);
      return offerRow;
    }
  }

  function createCableRow(equipment, page, linked = false) {
    const equipmentId = equipment.id
    if (page == "main"){
      // Use button Id to find table using table Id.
      const tableId = equipmentId+"-OffersTable";
      const table = document.getElementById(tableId);

        var columns = [
          "delete",
          "edit",
          "name",
          "stPoint",
          "endPoint",
          "connectionNum",
          "phase",
          "cores",
          "length",
          "totalLength",
          "quantity",
          "price",
          "FAT",
          "shipping",
          "customs",
          "optional",
          "totalPrice",
          "notes",
          "pdf",
          "select",
          "linked"
        ];
      
        
        const offerRow = document.createElement("tr");
        offerRow.dataset.mode = "view";
        offerRow.dataset.oldOffer = ""
        if (linked){
          offerRow.id = linked+"-"+equipmentId
        }
        else{
          offerRow.id = equipmentId+"-Offer"+table.childNodes[1].childNodes.length
        } 
        
      // create cells and append them to the row
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.setAttribute("name", column + "Cell");
        offerRow.appendChild(cell);
      });

      // Delete/Discard offer button
      const deleteOrDiscardOfferButton = document.createElement("button");

      // For delete
      const deleteSymbol = document.createElement("img");

      deleteSymbol.setAttribute("src", "./images/Delete Symbol.png");
      deleteSymbol.setAttribute("alt", "Delete Offer");

      deleteOrDiscardOfferButton.appendChild(deleteSymbol);

      // For discard
      const discardSymbol = document.createElement("img");

      discardSymbol.setAttribute("src", "./images/Discard Symbol.png");
      discardSymbol.setAttribute("alt", "Discard Changes");

      // delete cell is the first in the row
      offerRow.childNodes[0].appendChild(deleteOrDiscardOfferButton);

      // Edit/Save offer button
      const editOrSaveOfferButton = document.createElement("button");

      // For edit
      const editSymbol = document.createElement("img");

      editSymbol.setAttribute("src", "./images/Edit Symbol.png");
      editSymbol.setAttribute("alt", "Edit Offer");

      editOrSaveOfferButton.appendChild(editSymbol);

      // For save
      const saveSymbol = document.createElement("img");

      saveSymbol.setAttribute("src", "./images/Save Symbol.png");
      saveSymbol.setAttribute("alt", "Save Changes");

      // Append the button
      offerRow.childNodes[1].appendChild(editOrSaveOfferButton); // Edit button is the second in the row

      // Radio button for selecting the offer
      const radio = document.createElement("input");
      
      // if equipment is cable, then check box
      radio.setAttribute("type", "checkbox")
      radio.addEventListener("change", () => {
        // findWarnings(equipmentId);
        
        const cells = offerRow.childNodes
        const selected = cells[cells.length-2].lastChild.checked
        if (selected) {
          offerRow.classList.add("selected")
        } else {
          offerRow.classList.remove("selected")
        }
        // grand total calculation
        calculateGrandTotal("main")
      });
      


      const groupName = tableId + "-Radio";
      
      // Id should be changed to something else, currenly causes conflicts
      radio.setAttribute("id", offerRow.id+"-Radio"); // added an id

      radio.setAttribute("name", groupName);

      
      // Append the row to the table body
      
      // Should be a return function here
      const tbody = table.childNodes[1];
      tbody.append(offerRow);
      
      offerRow.childNodes[19].appendChild(radio);
      

      // Event listener for the edit/Save button for regular and aux.
       
      editOrSaveOfferButton.addEventListener("click", () => {
        const mode = offerRow.dataset.mode;
       
        const oldOffer = createCableObject(offerRow, "main").toArray();
        // Store old values
        offerRow.dataset.oldOffer = oldOffer

        if (mode == "view") {
          // If view, then Edit.
          // Change the symbol edit -> save
          editOrSaveOfferButton.childNodes[0].remove();
          editOrSaveOfferButton.appendChild(saveSymbol);
          
          // Change the symbol delete -> discard
          deleteOrDiscardOfferButton.childNodes[0].remove();
          deleteOrDiscardOfferButton.appendChild(discardSymbol);
          
          // Edit functionalty
          editMode(offerRow);


        } else if (mode == "edit") {
          
          // check if the vendor name is filled 
          // If edit, then save.
          const vendorName = offerRow.childNodes[2].lastChild.value
          if (vendorName == "") {
            alert("Vendor name is empty")
          }
          else {
            
            offerRow.dataset.mode = "view";
            
            // Change the symbol save -> edit
            editOrSaveOfferButton.childNodes[0].remove();
            editOrSaveOfferButton.appendChild(editSymbol);
            
            // Change the symbol discard -> delete
            deleteOrDiscardOfferButton.childNodes[0].remove();
            deleteOrDiscardOfferButton.appendChild(deleteSymbol);
            
            // Save functionalty
            saveChanges(offerRow);
            // linkedEquipmentFunctionality(offerRow.childNodes[20], offerRow);
            
            // findWarnings(equipment);
            calculateGrandTotal(page)
          }
        }
      

      //Event listner for the delete/Discard button
      deleteOrDiscardOfferButton.addEventListener("click", () => {
        const mode = offerRow.dataset.mode;
        if (mode == "view") {
          // If view, delete
          // Delete functionalty
          if (confirm("Are you sure you want to delete this offer?")) {
            const tempRow =
              deleteOrDiscardOfferButton.parentElement.parentElement;
            tempRow.remove();
          }
        } else if (mode == "edit") {
          // If edit, then discard
          // Change the symbol discard -> delete
          deleteOrDiscardOfferButton.childNodes[0].remove();
          deleteOrDiscardOfferButton.appendChild(deleteSymbol);

          // Change the symbol save -> edit
          editOrSaveOfferButton.childNodes[0].remove();
          editOrSaveOfferButton.appendChild(editSymbol);

          
          const tempRow = deleteOrDiscardOfferButton.parentElement.parentElement;
          discardChanges(tempRow);
          offerRow.dataset.mode = "view";

        }
        findWarnings(equipment);
      });

      
    })
    return offerRow;
   
    }
    else if(page == "review"){
      const tableId = equipmentId+"-ReviewTable";
      const table = document.getElementById(tableId);
      
      const columns = [
        "vendor",
        "unit",
        "quantity",
        "price",
        "FAT",
        "shipping",
        "customs",
        "optional",
        "totalPrice",
        "notes",
        "PDF",
        "select",
      ];

      // Get the table
      // Create Emptey row
      const offerRow = document.createElement("tr");
      offerRow.dataset.mode = "view";
      offerRow.id = equipmentId+"-Offer"+table.childNodes[1].childNodes.length

      // create cells and append them to the row
      columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.setAttribute("name", column + "Cell");
        offerRow.appendChild(cell);
      });

      // checkbox button for selecting the offer
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      // checkbox.checked = true

      const groupName = tableId + "-Checkbox";
      // Id should be changed to something else
      checkbox.setAttribute("id", groupName); // added an id
      checkbox.setAttribute("name", groupName);

      checkbox.addEventListener("change", () => {
        highlightSelectedOffer(equipmentId, page);
        //findWarnings(equipmentId);

        // grand total calculation
      calculateGrandTotal(page);
      });

      offerRow.childNodes[11].appendChild(checkbox);
      
      offerRow.childNodes[11].setAttribute("hidden", "hidden")

      // Append the row to the table body
      // Should be a return function here
      const tbody = table.childNodes[1];
      tbody.append(offerRow);
      return offerRow;
    }
  }

  /**
   * calculateGrandTotal: Calculates the price for the entire project and outputs it in grand-total-container
   * @param {String} page 
   */
  function calculateGrandTotal(page) {
    if (page == "main"){
      const selectedOffers = Array.from(document.getElementsByClassName("selected"))
      var grandTotal = 0;

      selectedOffers.forEach((offerRow) => {
        const selectId = offerRow.parentElement.parentElement.id.replace("-OffersTable", "-DDL")
        const select = document.getElementById(selectId)

        if (select.value == "Include") {
          var offer;
          var tableType = offerRow.parentElement.parentElement.classList[1];
          if (tableType != "cable"){
             offer = createOfferObject(offerRow, page)
          } else {
             offer = createCableObject(offerRow, page)
          }
          
          grandTotal += offer["totalPrice"];
        }
      });
      const grandTotalDiv = document.getElementById("grand-total")
      grandTotalDiv.textContent = grandTotal.toLocaleString();
    } else if (page == "review"){
    }
    
  }
  
  /**
   * 
   * @param {HTML tr} offerRow the row to be filled
   * @param {Offer} offer Offer object
   * @param {String} page main or review
   */
  function fillOfferRow(offerRow, offer, page){
    //
    const cells = offerRow.childNodes
    
    const values = offer.toArray();

    if (page == "main"){
      for (var i = 0; i < values.length-2; i++){
        cells[i+2].textContent = values[i].toLocaleString()
      }
      if (values[values.length-2]) {

        // select already selected offers
        cells[cells.length-2].childNodes[0].checked = true
        offerRow.classList.add("selected")
      }
      // Linked equipment IDs
        cells[cells.length-1].textContent = values[values.length - 1]
        calculateGrandTotal(page)        
    }
    
    else if (page == "review"){
      for (var i = 0; i < values.length-2; i++){
        cells[i].textContent = values[i].toLocaleString()

      }
      
      // select already selected offers in review page
      cells[cells.length-1].childNodes[0].checked = values[values.length-2]
      
      calculateGrandTotal(page)
      
      if (values[values.length-2]){
        offerRow.removeAttribute("hidden")
      }
      else {
        offerRow.setAttribute("hidden", "hidden");
      }
    }
  }

  /**
   * toggleTableVisibility: Shows/hides tables
   * @param {string} listId: Id for the DDL
   */
  function toggleTableVisibility(listId) {
    const selectedList = document.getElementById(listId);

    const tableId = listId.replace("-DDL", "-Div");
    const equipmentTable = document.getElementById(tableId);

    if (selectedList.value == "Include") {
      equipmentTable.removeAttribute("hidden")
    } else {
      equipmentTable.setAttribute("hidden", "hidden")
    }
  }

  /**
   * changeColor: changes the cell color based on selection
   * @param {string} dropdownListId: Id for the dropdown List to be changed
   */
  function changeColor(dropdownListId) {
    const currentList = document.getElementById(dropdownListId);
    if (currentList.value == "Include") {
      currentList.style.backgroundColor = "rgb(44, 232, 74, 0.3)";
    } else if (currentList.value == "Exclude") {
      currentList.style.backgroundColor = "rgb(255, 103, 103, 0.7";
    } else if (currentList.value == "Other Contractor") {
      currentList.style.backgroundColor = "gold";
    }
  }

  /**
   * editMode: changes row mode from view to edit and stores current values. Also adds a cell for the linked equipment checklist
   * @param {HTML tr} offerRow: used to store the old values in the old Offertribute
   */

  function editMode(offerRow) {

    // Switch to edit mode
    offerRow.dataset.mode = "edit";
    
    var nodes = offerRow.childNodes

    var tableType = offerRow.parentElement.parentElement.classList[1];
    if (tableType != "cable") {

      for (var i = 2; i < nodes.length-2; i++){
        var node = nodes[i]; 
        // Take the old value
        const tempTxt = node.textContent;
        node.textContent = "";
        
        if (i != 5 && i != 10 && i !=13) {
          // create a text box for each column
          
          const inputBox = document.createElement("input");
          inputBox.setAttribute("type", "text");
          
          // Empty the node and use its value for the box
          inputBox.setAttribute("value", tempTxt);
          
          inputBox.dataset.type = "inputBox";
          // Append the box to the cells
          node.appendChild(inputBox);
        } 
        
      }
      
      // Add a new cell for the "Linked equipment"
      
      const linkedEquipmentBtn = document.createElement("button");
    linkedEquipmentBtn.textContent = "Add Linked equipment"
    
    
    offerRow.childNodes[14].appendChild(linkedEquipmentBtn);
    
    // Add button event listner
    linkedEquipmentBtn.addEventListener("click", ()=>{
      linkedEquipmentFunctionality(offerRow.childNodes[14], offerRow);
      linkedEquipmentBtn.setAttribute("hidden", "hidden")
    });
  }
    else {

      for (var i = 2; i < nodes.length-2; i++){
        var node = nodes[i]; 
        // Take the old value
        const tempTxt = node.textContent;
        node.textContent = "";
        
        if (i != 9  && i != 16 ) {
          // create a text box for each column
          
          const inputBox = document.createElement("input");
          inputBox.setAttribute("type", "text");
          
          // Empty the node and use its value for the box
          inputBox.setAttribute("value", tempTxt);
          
          inputBox.dataset.type = "inputBox";
          // Append the box to the cells
          node.appendChild(inputBox);
        } 
        
      }
      
      // Add a new cell for the "Linked equipment"
      
      const linkedEquipmentBtn = document.createElement("button");
    linkedEquipmentBtn.textContent = "Add Linked equipment"
    
    
    offerRow.childNodes[20].appendChild(linkedEquipmentBtn);
    
    // Add button event listner
    linkedEquipmentBtn.addEventListener("click", ()=>{
      linkedEquipmentFunctionality(offerRow.childNodes[20], offerRow);
      linkedEquipmentBtn.setAttribute("hidden", "hidden")
    });
  }
    
  }

  /**
   * linkedEquipmentFunctionlity 
   * @param {HTML td} tempCell 
   * @param {HTML tr} offerRow 
   * @returns 
   */
  function linkedEquipmentFunctionality(tempCell, offerRow){
    
    // Get the table header
    const currentTable = offerRow.parentElement.parentElement;
    tableHeader = currentTable.childNodes[0];
    
    const secondHeader = tableHeader.childNodes[1];
  
    var linkedEquipmentIds = [];

    if (offerRow.dataset.mode == "edit"){

      // Add a checkbox with all the included equipment
      var includedEquipment = getEquipmentsByType("Include");    
        
      // Remove the current equipment from that list
      const currentEquipmentId = offerRow.parentElement.parentElement.id.replace("-OffersTable","");
      includedEquipment = includedEquipment.filter(equipment => equipment.id != currentEquipmentId);

      // Create the check list
      const checklist = createCheckList(includedEquipment);

      // Append the table to the cell
      tempCell.append(checklist);
      
    }

    else if (offerRow.dataset.mode == "view"){
      
      // When mode is view, save changes and remove check list
      var checkBoxes = tempCell.lastChild;
      if (checkBoxes.textContent != "Add Linked equipment"){
        
        for (var i = 1; i < tempCell.lastChild.childNodes.length; i++){
          var box = checkBoxes.childNodes[i].childNodes[0];
          if (box.checked){
            var boxId = box.id.replace("-LinkedCheckBox", "");   
            linkedEquipmentIds.push(boxId)
            
          } 
        } 
        tempCell.lastChild.remove();
        return linkedEquipmentIds;
      } 

      // remove the tempCell
     return linkedEquipmentIds 
      
    }
    
  }

  /**
   * createCheckList: create an HTML table 1 table row for each other equipment
   * @param {Equipment []} equipmentList List of Equipment objects 
   * @returns HTML table 
   */
  function createCheckList(equipmentList){
    
    const table = document.createElement("table")
    
    const tableHead = document.createElement("th")
    tableHead.textContent = "Select included equipment"

    table.append(tableHead);

    equipmentList.forEach((equipment)=>{

      const tempRow = document.createElement("tr");

      // Create the checkbox
      const tempCheckbox = document.createElement("input")
      tempCheckbox.setAttribute("type", "checkbox")
      tempCheckbox.setAttribute("id", equipment.id + "-LinkedCheckBox")

      // Create a label
      const tempLabel = document.createElement("label")
      tempLabel.setAttribute("for", tempCheckbox.id);
      tempLabel.textContent = equipment.id;
      
      // Append the items to the cells
      tempRow.append(tempCheckbox)
      tempRow.append(tempLabel)

      // Append the cell to the table
      table.append(tempRow);

    });
    
    return table
  }

  /**
   * saveChanges: change the text content of the nodes to the values of the input boxes
   * @param {HTML tr} offerRow: the parent row for the nodes, used to change the old values attribute to ""
   */
  function saveChanges(offerRow) {
    
    var nodes = offerRow.childNodes;
    
    var newValues = [];


    var tableType = offerRow.parentElement.parentElement.classList[1];
    // regular and aux.
    // Problem 
    if (tableType != "cable") {
      // This will skip price and total price
      nodes.forEach((node)=>{
        if (node.childNodes.length != 0) {
          newValues.push(node.childNodes[0].value);
        }
      });
      // radio button 
      newValues[11] = nodes[13].childNodes[0].checked
      // Linked list
      newValues[12] = linkedEquipmentFunctionality(offerRow.childNodes[14], offerRow)
      var tempOffer = new Offer(newValues[2], newValues[3], newValues[4], newValues[5], newValues[6],newValues[7],newValues[8], newValues[9],newValues[10],newValues[11],newValues[12]) 
      // get the equipment objects

      var chosen = [];
      newValues[12].forEach((value)=>{
        chosen.push(masterEquipmentsList.filter((equipment) => equipment.id == value)[0])
      });
    
      chosen.forEach((equipment)=>{
        // Create an offer row
      
        if (!document.getElementById(offerRow.id+"-"+equipment.id)){
          createOfferRow(equipment, "main", offerRow.id)
            
          // New Offer
          var tempOffer = new Offer(newValues[2]);
          
          tempOffer.isSelected = true; 

          // Get the row
          var offerRowId = offerRow.id + "-" +equipment.id
          var newOfferRow = document.getElementById(offerRowId);
          //fillOfferRow
          
          fillOfferRow(newOfferRow, tempOffer, "main")
          // Make new offers grey'd out
        }
      });
    }
    
    //cables
    else{
       // This will skip total length, and total price
      nodes.forEach((node)=>{
        if (node.childNodes.length != 0) {
          newValues.push(node.childNodes[0].value);
        }
      });
      // radio button 
      newValues[17] = nodes[18].childNodes[0].checked
      // Linked list
      newValues[18] = linkedEquipmentFunctionality(offerRow.childNodes[20], offerRow)

      var tempOffer = new Cable(newValues[2],newValues[3],newValues[4],newValues[5],newValues[6],newValues[7],newValues[8],newValues[9],newValues[10],newValues[11],newValues[12],newValues[13],newValues[14],newValues[15],newValues[16],newValues[17],newValues[18],newValues[19],newValues[20]) 

      // get the equipment objects
      var chosen = [];
      newValues[18].forEach((value)=>{
        chosen.push(masterEquipmentsList.filter((equipment) => equipment.id == value)[0])
      });
    
      chosen.forEach((equipment)=>{
        // Create an offer row
        
        if (!document.getElementById(offerRow.id+"-"+equipment.id)){
          createCableRow(equipment, "main", offerRow.id)
            
          // New Offer
          if (equipment.type != "cable") {
            var tempOffer = new Offer(newValues[2]);
          } else {
            var tempOffer = new Cable(newValues[2]);
          }
        
          tempOffer.isSelected = true; 

          // Get the row
          var offerRowId = offerRow.id + "-" +equipment.id
          var newOfferRow = document.getElementById(offerRowId);
          //fillOfferRow
          
          fillOfferRow(newOfferRow, tempOffer, "main")
          // Make new offers grey'd out
        }

       });
    }

    clearCells(offerRow)

    fillOfferRow(offerRow, tempOffer, "main")
  }
  
  /**
   * discardChanges: reverts all changes done to the offer
   * @param {HTML tr} offerRow: the row where the nodes are placed, used to get the "old values" data attribute
   */
  function discardChanges(offerRow) {
    var tableType = offerRow.parentElement.parentElement.classList[1];

    if (tableType != "cable") {
      var oldOffer = arrayToOffer(offerRow.dataset.oldOffer);
    } else {
      var oldOffer = arrayToCable(offerRow.dataset.oldOffer);
    }

    clearCells(offerRow);

    fillOfferRow(offerRow, oldOffer, "main")

  }

  /**
   * 
   * @param {HTML tr} offerRow 
   */
  function clearCells(offerRow) {
    const nodes = offerRow.childNodes

    var tableType = offerRow.parentElement.parentElement.classList[1];
    if (tableType !="cable") {

      for (var i = 0; i < nodes.length-1; i++){
        if (i > 1 && i != 5 && i != 10 && i != 13){
          nodes[i].childNodes[0].remove();
        } 
      }
    } else {
      for (var i = 0; i < nodes.length-1; i++){
        if (i > 1 && i != 9 && i != 10 && i != 16 && i != 19){
          nodes[i].childNodes[0].remove();
        } 
      }

    }

  }

  /**
   * createCollapseButtonFunctionality: creates the functionality for the control panel's collabse functionality
   */
  function createCollapseButtonFunctionality(){
    // Collapse button functionalty
    const collapseButton = document.getElementById("collapseBtn");
    collapseButton.addEventListener("click", () => {
      const controlPanelBody = document.getElementById("controlPanelBody");
      const controlPanelFooter = document.getElementById("controlPanelFooter");
      const modelContainer = document.getElementById("model-container");
      const addNewEquipmentBt = document.getElementById("addEquipmentBtn");

      const hiddenBody = controlPanelBody.getAttribute("hidden");

      const controlPanelCard =
        document.getElementsByClassName("control-panel")[0];
      const equipmentCard = document.getElementsByClassName("main-content")[0];
      const summaryCard = document.getElementsByClassName("summaryPanel")[0];

      if (hiddenBody) {
        controlPanelBody.removeAttribute("hidden");
        controlPanelFooter.removeAttribute("hidden");
        modelContainer.removeAttribute("hidden");
        addNewEquipmentBt.removeAttribute("hidden");
        collapseButton.setAttribute("src", "images/Collapse button.png");
      } else {
        controlPanelBody.setAttribute("hidden", "hidden");
        controlPanelFooter.setAttribute("hidden", "hidden");
        modelContainer.setAttribute("hidden", "hidden");
        addNewEquipmentBt.setAttribute("hidden", "hidden");
        collapseButton.setAttribute("src", "images/Expand button.svg");
        collapseButton.setAttribute("src", "images/Expand button.svg");

        //// changing grid layout

        // control panel
        controlPanelCard.style.position = "absolute";
        controlPanelCard.style.right = "0";

        // main-content
        equipmentCard.style.gridRow = "1";
        equipmentCard.style.gridColumn = "1/3";

        // summary panel
        summaryCard.style.gridRow = "2";
        summaryCard.style.gridColumn = "1/3";

        const toSummaryBtn = document.getElementById("to-summary-btn");
        toSummaryBtn.style.display = "inline";
      }
    });
  }

  /**
   * createSaveButtonFunctionalty: creates the functionality for the main page's save button
   */
  function createSaveButtonFunctionalty(){
    
    console.log("clicked save button for project", sessionStorage.getItem("project"));
    
    const savePageBtn = document.getElementById("saveBtn");
    
    savePageBtn.addEventListener("click", ()=>{
      storePageInStorage("main", "local");
    });
  }

  /**
   * getEquipmentbyType: get array of equipment with specified type
   * @param {String} type include, exclude, or other contractor
   * @returns array of Equipment objects
   */
  function getEquipmentsByType(type) {
    const array = [];

    masterEquipmentsList.forEach((equipment) => {
      const select = document.getElementById(equipment.id + "-DDL");
      if (type == "all") {
        array.push(equipment);
      } else {
        if (select.value == type) {
          array.push(equipment);
        }
      }
    });
    return array;
  }

  /**
   * createEquipmentButtonFunctionality: creates the functionality for the main page's create equipment button
   */
  function createEquipmentButtonFunctionality(){
    const addEquipButton = document.getElementById("addEquipmentBtn");

    addEquipButton.addEventListener("click", () => {
      const body = document.getElementById("controlPanelBody");
  
      // new equipment row
      addNewEquipmentRow(body);
  
      // row for save/discard options
      addOptionsRow(body);

      addEquipButton.setAttribute("hidden", "hidden")
    });
  }
  
  /**
   * normalNumber: reverse string.toLocaleString(en-us)
   * @param {String} formattedNumber
   * @returns Number
   */
  function normalNumber(formattedNumber) {
    var normal = "";
    const tempList = formattedNumber.split(",");
    tempList.forEach((num) => {
      normal = normal + num;
    });
    return normal;
  }

  /**
   * addNewEquipmentRow: adds new equipment to the control panel
   * @param {HTML tbody} body
   */
  function addNewEquipmentRow(body) {
    const controlPanelRow = document.createElement("tr");
    controlPanelRow.setAttribute("id", "new-equipment-row");

    const controlPanelNameCell = document.createElement("td");
    controlPanelNameCell.setAttribute("id", "options-cell");
    controlPanelNameCell.innerHTML = `
        <b>Name:</b> <input type="text" id="eq-name"><br>

        <b>Voltage:</b> <select id="eq-voltage">
          <option name="EHV">EHV</option>
          <option name="HV">HV</option>
          <option name="MV">MV</option>
          <option name="MV">General</option>
        </select><br>

        <b>Type:</b> <select id="eq-type">
          <option value="regular" name="regular">Regular</option>
          <option value="auxuliary" name="aux">Auxuliary</option>
        </select>
      `;

    controlPanelRow.appendChild(controlPanelNameCell);

    body.appendChild(controlPanelRow);
  }

  /**
   * addOptionsRow: adds row of options for the new equipment
   * @param {HTML tbody} body control panel body
   */
  // css needs to be changed
  function addOptionsRow(body) {
    const equipmentOptionsRow = document.createElement("tr");

    const optionsCell = document.createElement("td");
    equipmentOptionsRow.appendChild(optionsCell);

    const saveEquipmentBtn = document.createElement("button");
    saveEquipmentBtn.innerHTML = `<img src="images/Save Symbol.png" alt="Save button">`;

    const discardBt = document.createElement("button");
    discardBt.innerHTML = `<img src="images/Discard Symbol.png" alt="discard button">`;

    const addEquipmentBtn = document.getElementById("addEquipmentBtn")

    // saving new equipment name and voltage
    saveEquipmentBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("eq-name");
      const voltageInput = document.getElementById("eq-voltage");
      const typeInput = document.getElementById("eq-type");

      // if equipment name is empty
      if (nameInput.value == "") {
        alert("Equipment name is empty");
      }

      // check if equipment already exists
      else {
        const equipmentList = getEquipmentsByType("all")

        var found = false
        var newId = voltageInput.value + "-" + nameInput.value

        equipmentList.forEach((equipment) => {
          if (equipment.id == newId) {
            found = true;
            return 
          }
        })
      
        if (found) {
          alert("Equipment already exists");
        }

        else {
          const newEquipment = new Equipment(
            nameInput.value,
            voltageInput.value,
            "Include",
            typeInput.value
          );
  
          // removing rows:
          const newEquipmentRow = document.getElementById("new-equipment-row");
          newEquipmentRow.remove(); // new equipment row
          equipmentOptionsRow.remove(); // options row
  
          // pushing new equipment to list of equipments, and updating the page
          masterEquipmentsList.push(newEquipment);
          updatePage(newEquipment, "main");
          addEquipmentBtn.removeAttribute("hidden")
        }
      } 
      // else add the eq.
    });

    // discard Equipment button
    discardBt.addEventListener("click", () => {
      // removing rows:
      const newEquipmentRow = document.getElementById("new-equipment-row");
      newEquipmentRow.remove(); // new equipment row
      equipmentOptionsRow.remove(); // options row

      addEquipmentBtn.removeAttribute("hidden")
    });

    optionsCell.appendChild(saveEquipmentBtn);
    optionsCell.appendChild(discardBt);
    body.appendChild(equipmentOptionsRow);

  }

  /**
   * createConfirmButtonFunctionality: creates the functionality for the main page's confrim button
   */
  function createConfirmButtonFunctionality(){
    // Confirm button
    const confitmBtn = document.getElementById("confirmBtn");

    // Confirm button event listner.
    confitmBtn.addEventListener("click", () => {
      storePageInStorage("main", "local");
      window.open("reviewerView.html", "_self");
    });
  }

  /**
   * createReturnToMainPageButtonFunctionality: creates the functionality for the review page's "return to main page" button
   */
  function createReturnToMainPageButtonFunctionality(){
    // Return button
    const returnButton = document.getElementById("returnToMainPageButton");
    returnButton.addEventListener("click",()=>{
      storePageInStorage("review", "local"); 
      window.open("mainPage.html", "_self");
    });
  }

  /**
   * createOfferObject: creates an offer object for the given row.
   * @param {HTML tr} offerRow
   * @returns Offer object
   */
  function createOfferObject(offerRow, page) {
    
    var tempValues = Array();
    if (page == "main"){
      for (var i = 2; i <= 12; i++) {
        // Price is 5 and total is 10
        tempValues[i - 2] = normalNumber(offerRow.childNodes[i].textContent);
      }
      // Radio button value as true or false
      tempValues.push(offerRow.childNodes[13].childNodes[0].checked);
      tempValues.push(offerRow.childNodes[14].textContent);
    }
    else if (page == "review"){
      for (var i = 0; i <= 10; i++) {
        // Price is 5 and total is 10
        tempValues[i] = normalNumber(offerRow.childNodes[i].textContent);
      }
      // Check box value as true or false
      
      tempValues.push(offerRow.childNodes[13].childNodes[0].checked);
      tempValues.push(offerRow.childNodes[14].textContent);
    }
    
    
    var offer = new Offer(tempValues[0], tempValues[1], tempValues[2],tempValues[4], tempValues[5],tempValues[6], tempValues[7], tempValues[9], tempValues[10], tempValues[11], tempValues[12]) 
    

    return offer;
  }

  function createCableObject(offerRow, page) {
    var tempValues = Array();
    if (page == "main"){
      for (var i = 2; i <= 18; i++) {
        tempValues[i - 2] = normalNumber(offerRow.childNodes[i].textContent);
      }
      // Radio button value as true or false
      tempValues.push(offerRow.childNodes[19].childNodes[0].checked);
    }
    else if (page == "review"){
      for (var i = 0; i <= 16; i++) {
        tempValues[i] = normalNumber(offerRow.childNodes[i].textContent);
      }
      // Check box value as true or false
      
      tempValues.push(offerRow.childNodes[17].childNodes[0].checked);
    }
    

    var cable = new Cable(tempValues[0], tempValues[1], tempValues[2],tempValues[3], tempValues[4], tempValues[5],tempValues[6],tempValues[8], tempValues[9], tempValues[10], tempValues[11], tempValues[12], tempValues[13],tempValues[15], tempValues[16], tempValues[17]) 
    return cable;
  }

  /**
   * 
   * @param {string} array 
   * @returns Offer object
   */
  function arrayToOffer(array){
    
    array = array.split(",");
    return new Offer(array[0], array[1], array[2], array[4], array[5], array[6], array[7], array[9], array[10], array[11], array[12]) 
       
  }

  /**
   * 
   * @param {string} array 
   * @returns Cable object
   */
  function arrayToCable(array){
    
    array = array.split(",");
    return new Cable(array[0], array[1], array[2], array[4], array[5], array[6], array[7], array[9], array[10], array[11], array[12], array[13], array[14], array[15], array[16], array[17], array[18]) 
       
  }

  /**
   * storeTableOffers: stores the table's offer content into an array of objects
   * @param {HTML table} offerTable
   * @returns Array of Offer objects
   */
  function storeTableOffers(offerTable, page) {
    
    var offerList = Array();    
    
    const offerTableBody = offerTable.childNodes[1]; 
    

    const offerRows = offerTableBody.childNodes;

    if (offerTable.classList[1] != "cable"){
      offerRows.forEach((row) => {
        const offer = createOfferObject(row, page);
        
        offerList.push(offer);
      });
    }
    else{
      offerRows.forEach((row) => {
        const offer = createCableObject(row, page);
        
        offerList.push(offer);
      });
    }
    

  
    return offerList;
  }

  /**
   * StoreInStorage: Stores all the table arrays into an array, then stores it in the specified storage
   * @param {String} page main or review 
   * @param {String} storage local or session
   */
  function storePageInStorage(page, storage) {
    
    // Get the current project from session memory
    tempProject = JSON.parse(sessionStorage.getItem("project"));  

    var database = Array();

    // Get all equipment
    equipmentList = getEquipmentsByType("all");

    // Store the equipment in the database
    equipmentList.forEach((equipment) => {
      
      // Get the equipment tableId, changes based on table
      var equipmentTableId;
      if (page == "main"){
        equipmentTableId = equipment.id + "-OffersTable";
      }
      else if (page == "review"){
        equipmentTableId = equipment.id + "-ReviewTable";
      }

      const equipmentTable = document.getElementById(equipmentTableId);
      
      // Store if it's included or excluded. Can't track other contractor rn 
      if (equipmentTable.parentElement.hidden){
        equipment["selection"] = "Exclude"
      }
      else{
        equipment["selection"] = "Include"
      }
      // Extract the offers into a list
      equipment["listOfOffers"] = storeTableOffers(equipmentTable, page);
      // Push to database
      database.push(equipment);
      
    });

    // Temporarly commented
    
    
    tempProject.database = database; 
    
    
    projectList = JSON.parse(localStorage.getItem("projectList")) || [];

    // if old Project
    var saved = false
    projectList.forEach((project) => {
      if (tempProject.name == project.name){
        project.database = tempProject.database; 
        saved = true
      }
    });

    if (!saved){
      projectList.push(tempProject);
    }

    projectList = JSON.stringify(projectList);
    
    

    localStorage.setItem("projectList", projectList); 

    /* temp comment
    Store in the specified storage
    if (storage == "session"){
      sessionStorage.setItem("Database", database);
    } else if (storage == "local") {
      localStorage.setItem("Database", database);
    } else {
      alert("Storing failed");
    }
      */
    
  }
  
  /**
   * REQUIRES NODE JS
   */
  function printToTxt(){
    const fs = require('node:fs');
    var database = localStorage.getItem("Database")
    fs.writeFile("../newFile.txt", database, err => {
      if (err){
        alert("Printing error")
      }
      else{
        alert("Console written")
      }
    });
  }

  /**
   * highlightSelectedOffer: highlight the selected offer
   * @param {String} equipmentId 
   * @param {String} page main or review
   */
  function highlightSelectedOffer(equipmentId, page) {
    var equipmentTable; 
    if (page == "main"){
      equipmentTable = document.getElementById(equipmentId + "-OffersTable");
    }
    else if (page == "review"){
      equipmentTable = document.getElementById(equipmentId+"-ReviewTable");
    }
   
    const tableBody = equipmentTable.childNodes[1];
    const offerList = tableBody.childNodes;
    
    offerList.forEach((offerRow) => {
      
      const cells = offerRow.childNodes
      const selected = cells[cells.length-2].lastChild.checked

      // if offer is selected, highlight it
      if (selected) {
        offerRow.classList.add("selected");

      // else, remove highlight
      } else {
        offerRow.classList.remove("selected")
      }
      highlightLinkedOffers(offerRow)

    });
  }

  /**
   * 
   * @param {HTML tr} offerRowId current Offer row
   * @param {String} linkedEquipmentIds all linked equipment Id's
   */
  function highlightLinkedOffers(offerRow){
    
    linkedEquipmentIds = offerRow.childNodes[14].textContent.split(",")
    // If you have linked offers, highlight them
    if (linkedEquipmentIds[0] != ""){
      linkedEquipmentIds.forEach((id)=>{
        const offerId = offerRow.id+"-"+id
        const linkedOffer = document.getElementById(offerId)
        if (offerRow.childNodes[13].lastChild.checked){
          linkedOffer.childNodes[13].lastChild.checked = true;
          linkedOffer.removeAttribute("hidden")
        }
        else {
          linkedOffer.childNodes[13].lastChild.checked = false;
          linkedOffer.setAttribute("hidden", "hidden")
        }
        
        highlightSelectedOffer(id, "main")
  
      });
    }
  } 

  // function that creates cable table
  function createCableTableFunctionality() {

    const addCableBtn = document.getElementById("add-cable-works-btn")

    addCableBtn.addEventListener("click", () => {
      
      const table = document.getElementById("General-CableWorks-Div")
      
      if (table == null){
        const cable = new Equipment("CableWorks", "General", "Include", "cable")
        
        masterEquipmentsList.push(cable);
        
        updatePage(cable, "main");

      }
      
      addCableBtn.setAttribute("hidden", "hidden");
    }) 
  }

  /**
   * 
   * @param {html Table} equipmentTable 
   * @param {String} button 
   * @returns HTML button
   */
  function createSelectionButton(equipmentTable, buttonType){
    
    
    // Get the table
    const tableWidth = equipmentTable.childNodes[0].childNodes[0].colSpan;
    const selectCell = equipmentTable.childNodes[0].childNodes[1].childNodes[tableWidth-2];
    
    // Create the button
    const tempButton = document.createElement("button");
    
    // Change the header cell
    selectCell.style.display = "flex";
    selectCell.style.flexDirection = "column";
    
    
    if (buttonType == "minimum"){
      
      // Change the Id and text content
      tempButton.setAttribute("id", equipmentTable.id + "-select-minimum-btn");
      tempButton.textContent = "Select Minimum";
      
      // Event listener
      tempButton.addEventListener("click", () => {
      
        // Table body
        const equipmentTableBody = equipmentTable.childNodes[1];
        
        // Get list of all prices
        const offers = equipmentTableBody.childNodes;
        const prices = [];
    
        
        offers.forEach((offerRow) => {
          
          const offer = createOfferObject(offerRow, "main");
          prices.push(offer.totalPrice);
        });
        

        // finding the minimum price.
        const minimumPrice = findMinimum(prices);

        // selecting the minimum price
        offers.forEach((offerRow) => {
          
          const offer = createOfferObject(offerRow, "main");
          
          
          if (offer.totalPrice == minimumPrice) {
            const radio = offerRow.childNodes[tableWidth-2].lastChild;

            // selecting the offer
            radio.checked = true;
            highlightSelectedOffer(equipmentTable.id.replace("-OffersTable", ""), "main");

            // Other things to worry about
            //findWarnings(equipment);
            return;
          }
        });

      calculateGrandTotal("main");
      });
    }
    else if (buttonType == "all"){
      
      // Change the Id and text content
      tempButton.setAttribute("id", equipmentTable.id + "-select-all-btn");
      tempButton.textContent = "Select All"; 

      // Event listener
      tempButton.addEventListener("click", () => {
        // Table body
        const equipmentTableBody = equipmentTable.childNodes[1];
        // Get list of all prices
        const offers = equipmentTableBody.childNodes;
        
        // selecting all
        offers.forEach((offerRow) => {

          const radio = offerRow.childNodes[tableWidth-2].lastChild;
          // selecting the offer
          radio.checked = true;
          
          // Other things to worry about
          //findWarnings(equipment);
          return;
        });
        calculateGrandTotal("main");
        
      });
    }
    else if (buttonType == "change"){
      
      // Change the Id and text content
      tempButton.setAttribute("id", equipmentTable.id + "-change-selection-btn");
      tempButton.textContent = "change selection";
      
      // Event listener
      tempButton.addEventListener("click", ()=>{
        var mode = equipmentTable.dataset.mode;
        
        const tableBody = equipmentTable.childNodes[1];
        const offers = tableBody.childNodes
        
        // if view mode, turn on edit mode
        if (mode == "view"){

          tempButton.textContent = "save"; 
          equipmentTable.dataset.mode = "change";
          
          offers.forEach((offer)=>{
            // Show all offers
            offer.removeAttribute("hidden");
            offer.childNodes[11].removeAttribute("hidden");
            
            // If the offer is selected, highlight it
            if (offer.childNodes[11].lastChild.checked){
              offer.classList.add("selected");
            }
          });
        }

        // If change mode, save changes and turn on view mode
        else if (mode == "change"){
          equipmentTable.dataset.mode = "view"
          tempButton.textContent = "Change selection"
          
          offers.forEach((offer)=>{
            // remove the selection highligh
            offer.classList.remove("selected")
            // hide the last cell for all offers
            
            offer.childNodes[11].setAttribute("hidden","hidden")
            offer.setAttribute("hidden","hidden")

            // If the offer is not selected, hide it
            if (offer.childNodes[11].lastChild.checked){
              offer.removeAttribute("hidden");             
            }
          });
        }
      });
    }
    else{
      alert ("Unknown Button type")
    }
    
    return tempButton
    
  }

  /**
   * 
   * @param {HTML table} equipmentTable 
   */
  function createAddButton(equipment, equipmentTable){

    const tempButton = document.createElement("button");
    tempButton.setAttribute("id", equipmentTable.id + "-Add-Btn");
    
    
    // Add the symbol
    const addSymbol = document.createElement("img");

    addSymbol.setAttribute("src", "./images/Add symbol.png");
    //addSymbol.setAttribute("alt", "Add Cable");
    
    tempButton.appendChild(addSymbol);

    const type = equipment.type; 
    // Event listner
    if (type == "regular" || type == "auxuliary"){
      tempButton.addEventListener("click", () => {
        
        const tableBody =equipmentTable.childNodes[1];
        const offerRows = tableBody.childNodes

        if (offerRows.length != 0) {
          const lastOfferRow = offerRows[offerRows.length - 1]
          const lastOffer = createOfferObject(lastOfferRow)
          // if the previous offer vendor name is empty
          if (lastOffer["vendor"] == "") {
            alert("You can't add a new offer if the previous offer is empty")
          }

          // else, create offer row
          else {
            createOfferRow(equipment, "main");
            findWarnings(equipment);
          }
        }

        // if there are no previous offers
        else {
          createOfferRow(equipment, "main");
          findWarnings(equipment);
        }
      });
    }
    
    // Could be wrong? 
    else if (type == "cable"){
      tempButton.addEventListener("click", () => {
        tempButton.setAttribute("hidden", "hidden")
        const lastRow = tempButton.parentElement;
        
        // new cable options
        const optionsDiv = document.createElement("div")
        optionsDiv.innerHTML = `
                            <label>Options:</label>
                            <select id="cable-options">
                              <option value="cable">Cable</option>
                              <option value="termination">Termination</option>
                              <option value="tray">Tray</option>
                            </select>

                            <label>Voltage:</label>
                            <select id="cable-voltage">
                              <option value="EHV">EHV</option>
                              <option value="HV">HV</option>
                              <option value="MV">MV</option>
                              <option value="LV">LV</option>
                            </select>
                            <div>
                              <button id="cable-discard"> <img src="images/Discard Symbol.png" alt="discard button"> </button>
                              <button id="cable-save"><img src="images/Save Symbol.png" alt="Save button"></button>
                            </div>
        `
        lastRow.appendChild(optionsDiv)

        // save cable button
        const cableSaveBtn = document.getElementById("cable-save")
        cableSaveBtn.addEventListener("click", () => {

          // Get the values from the document
          const cableOption = document.getElementById("cable-options").value
          const cableVoltage = document.getElementById("cable-voltage").value
          
          // to count option-cable rows
          const optionCableList = document.getElementsByClassName("option-cable")
          if (cableOption == "cable") {

            // if Option = cable for the first time, make 3 rows
            if (optionCableList.length == 0) {
              var cableRow = createCableRow(equipment, "main")
              const terminationRow = createCableRow(equipment, "main")
              const trayRow = createCableRow(equipment, "main")
              terminationRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
              trayRow.childNodes[2].textContent = cableVoltage + "-Cables Tray" 

              // else make one row
            } else {
              var cableRow = createCableRow(equipment, "main")
            }
           cableRow.classList.add("option-cable")
            
            // cableRow.childNodes[10].style.backgroundColor = "gray"

          }
          else if (cableOption == "termination") {
            const terminationRow = createCableRow(equipment, "main")
            terminationRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
          }
          
          else {
          const trayRow = createCableRow(equipment, "main")
          trayRow.childNodes[2].textContent = cableVoltage + "-Cables Termination" 
        }

        optionsDiv.remove()
        tempButton.removeAttribute("hidden")
        })

        // discard cable button
        const cableDiscard = document.getElementById("cable-discard")
        cableDiscard.addEventListener("click", () => {
          optionsDiv.remove()
          tempButton.removeAttribute("hidden")
        })
      })
    }
    else{
      alert("Error in add button")
    }

    return tempButton;
  }

  // These 3 are for project selection page
  function createNewProjectButtonFunctionality(){
    
    nameField = document.getElementById("userNameField");
    projectNameField = document.getElementById("newProjectName");
    
    // Empty project
    temp = document.getElementById("addEmptyProjectButton");
    
    // Event listener
    temp.addEventListener("click", ()=>{
      
      if (!isValidNameField(nameField.id)){
        alert("user name field must be filled");
      }
      else if (!isValidNameField(projectNameField.id)){
        alert("project name field must be filled");
      }
      else {
        
        tempProject = new Project(projectNameField.value, nameField.value, [])
        tempProject = JSON.stringify(tempProject);
        sessionStorage.setItem("project", tempProject);
        window.open("WebSiteFiles/mainPage.html", "_self");
        // move to main page
      }
      
    });

    // Repeated code, should be re-done later
    temp2 = document.getElementById("addTemplatedProjectButton");

    temp2.addEventListener("click", ()=>{
      if (!isValidNameField(nameField.id)){
        alert("user name field must be filled");
      }
      else if (!isValidNameField(projectNameField.id)){
        alert("project name field must be filled");
      }
      // Template is 240 lines 
      else {
        tempProject = new Project(projectNameField.value, nameField.value, [
          {
            "name": "GIS",
            "voltage": "EHV",
            "id": "EHV-GIS",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "GIS",
            "voltage": "HV",
            "id": "HV-GIS",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "HGIS",
            "voltage": "EHV",
            "id": "EHV-HGIS",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "AIS",
            "voltage": "HV",
            "id": "HV-AIS",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Power Transformer",
            "voltage": "EHV",
            "id": "EHV-Power Transformer",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Power Transformer",
            "voltage": "HV",
            "id": "HV-Power Transformer",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Grouding Transformer",
            "voltage": "EHV",
            "id": "EHV-Grouding Transformer",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Power Transformer",
            "voltage": "MV",
            "id": "MV-Power Transformer",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Shunt Reactor",
            "voltage": "EHV",
            "id": "EHV-Shunt Reactor",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Shunt Reactor",
            "voltage": "HV",
            "id": "HV-Shunt Reactor",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Shunt Reactor",
            "voltage": "MV",
            "id": "MV-Shunt Reactor",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Switchgear",
            "voltage": "MV",
            "id": "MV-Switchgear",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Protection, Control, & SAS",
            "voltage": "General",
            "id": "General-Protection, Control, & SAS",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "SCADA",
            "voltage": "General",
            "id": "General-SCADA",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "Telecom",
            "voltage": "General",
            "id": "General-Telecom",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          },
          {
            "name": "SOE, DFR & DSM",
            "voltage": "General",
            "id": "General-SOE, DFR & DSM",
            "selection": "Include",
            "type": "regular",
            "listOfOffers": []
          }, 
      {
          "name": "SIS System",
          "voltage": "General",
          "id": "General-SIS System",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Surge Arrestor",
          "voltage": "EHV",
          "id": "EHV-Surge Arrestor",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Surge Arrestor",
          "voltage": "HV",
          "id": "HV-Surge Arrestor",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Surge Arrestor",
          "voltage": "MV",
          "id": "MV-Surge Arrestor",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Capacitor Banks",
          "voltage": "MV",
          "id": "MV-Capacitor Banks",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "CVT",
          "voltage": "General",
          "id": "General-CVT",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Outdoor CTs",
          "voltage": "General",
          "id": "General-Outdoor CTs",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "NGR",
          "voltage": "General",
          "id": "General-NGR",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Grounding",
          "voltage": "General",
          "id": "General-Grounding",
          "selection": "Include",
          "type": "auxuliary",
          "listOfOffers": []
        },
        {
          "name": "LV Power & Control Cables",
          "voltage": "General",
          "id": "General-LV Power & Control Cables",
          "selection": "Include",
          "type": "auxuliary",
          "listOfOffers": []
        },
        {
          "name": "Aux. Equipment",
          "voltage": "General",
          "id": "General-Aux. Equipment",
          "selection": "Include",
          "type": "auxuliary",
          "listOfOffers": []
        },
        {
          "name": "Battery Charger & Battery Banks",
          "voltage": "General",
          "id": "General-Battery Charger & Battery Banks",
          "selection": "Include",
          "type": "regular",
          "listOfOffers": []
        },
        {
          "name": "Civil, Electromechanical works",
          "voltage": "General",
          "id": "General-Civil, Electromechanical works",
          "selection": "Include",
          "type": "auxuliary",
          "listOfOffers": []
        },
        {
          "name": "Client Special Requirments",
          "voltage": "General",
          "id": "General-Client Special Requirments",
          "selection": "Include",
          "type": "auxuliary",
          "listOfOffers": []
        }
        ]);
        tempProject = JSON.stringify(tempProject);
        sessionStorage.setItem("project", tempProject);
        window.open("WebSiteFiles/mainPage.html", "_self");
      } 
    });
  } 

  function createSelectOldProjectButtonFunctionality(){

    fillDDL();

    // need to use "projectList" from local storage"
    var button = document.getElementById("useOldProjectButton"); 
    var ddl = document.getElementById("projectsDDL");
    button.addEventListener("click", () => {
      if(!isValidNameField("userNameField")) {
        alert("User name field must be filled");
      }
      else if(ddl.selectedIndex == 0) {
        alert("You must select a valid project");
      }
      else {
          // find the project from local storage and load it into session storage
          var project = JSON.parse(localStorage.getItem("projectList"))[ddl.selectedIndex-1];
          console.log(project);
          sessionStorage.setItem("project", JSON.stringify(project));
          window.open("WebSiteFiles/mainPage.html", "_self");
        }
      
    });
  
  }

  function fillDDL(){
    var ddl = document.getElementById("projectsDDL"); 
    const projects = JSON.parse(localStorage.getItem("projectList"));

    // Right here I got the names of both projects
    console.log(projects); 

    projects.forEach((project) => {
      console.log("project ", project.name); 
      var option = document.createElement("option");
      option.text = project.name; 
      ddl.add(option);
    });
  }

  function isValidNameField(fieldId){
    temp = document.getElementById(fieldId);
    // Should also check if the name is in the employee list
    // Should also check if the project name is vlaid
    if (temp.value){
      return true; 
    } 
    return false;
  }
  
  // Call the main function to start the website
  main();
});
