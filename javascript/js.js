
// number of existing elements that can be tabbed to on the page
// was to be used for better accessability, is not implemented
NUM_EXISTING_TAB_ELEMENTS = 2;

/**
 * Used to initialise anything needed for the application
 */
function init() {
    document.getElementById('postalButton').addEventListener('click', getData);
}

/**
 * Used to call our api to retrieve a list of representatives by postal code.
 * uses an AJAX call to get the data, and then build up the results
 * @param {Event} e The event that called this function
 */
function getData(e){

    e.preventDefault();

    let postal = document.getElementById('postalInput').value;
    let parentElement = document.getElementById('mainContainer');

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "php/GetRepData.php?postal=" + encodeURIComponent(postal), true);
    let data = '';
    xhr.onload = function() {
        if (this.status == 200) {
            data = JSON.parse(this.responseText);
            
            parentElement.innerHTML = '';
            for (let i = 0; i < data.length; i++)
            {
                createCard(data[i], parentElement, (i + NUM_EXISTING_TAB_ELEMENTS));
            }
            
        }
        else {
            data = JSON.parse(this.responseText);
            parentElement.innerHTML = '';
            showError(data.errorMessage, parentElement);
        }
    xhr.onerror = function() {
        parentElement.innerHTML = '';
        showError("An unknown error occurred", parentElement);
    }
    }
    xhr.send();

    // clear old data 
    // can put a loading message here
    // wanted to create a template and put a nice loading message here.
    // Cut for time
    parentElement.innerHTML = 'loading';
}

/**
 * Creates an error div from template and attaches to the parent element
 * @param {string} errorMessage The error message to display
 * @param {Element} parentElement The parent element to attach the error to
 */
function showError(errorMessage, parentElement) {
    // Select our template and clone it
    let temp = document.getElementById('error');
    let topContainer = temp.content.querySelector('div'); 
    let nodesClone = document.importNode(topContainer, true);

    nodesClone.children[1].innerHTML = errorMessage;

    parentElement.append(nodesClone);
}

/**
 * Creates a construct of html containing the data for a representative
 * @param {object} data contains one record of a representative
 * @param {Element} parentElement The parent element to attach to
 * @param {number} tabIndex Tab index to allow for better accessability (not implemented)
 */
function createCard(data, parentElement, tabIndex){

    // create the card div we attach this all to
    let card = document.createElement('div');
    card.setAttribute('class', 'card');

    createNamePlate(data, card, tabIndex);

    createInfoPanel(data, card);

    createAddressCards(data, card);

    parentElement.append(card);
}

/**
 * Creates the first part of the card containing an image, name and title
 * @param {object} data contains one record of a representative
 * @param {Element} parentElement The parent element to attach to
 * @param {number} tabIndex Tab index to allow for better accessability (not implemented)
 */
function createNamePlate(data, parentElement, tabIndex) {

    // Select our template and clone it
    let temp = document.getElementById('nameCard');
    let topContainer = temp.content.querySelector('div'); 
    let nodesClone = document.importNode(topContainer, true);

    // Profile Photo
    let profilePhoto = nodesClone.querySelectorAll('img')[0];
    let photo = data.photo_url == '' ? 'resources/defaultPhoto.png' : data.photo_url;
    profilePhoto.setAttribute('src', photo);
    // attempted to set tab index to the image to allow for better accessability. Doesn't appear to work in firefox 
    // (does work in Chrome, but requires a click on a representative card first, then tabbing between cards works.)
    // might work if we also increment the index on the links, too much work for now.
    //profilePhoto.setAttribute('tabindex', tabIndex);
    profilePhoto.setAttribute('alt', 'An image of ' + data.elected_office + " " + data.name);

    // Name and Elected Office
    let nameContainer = nodesClone.querySelectorAll('div');
    nameContainer[0].innerHTML = data.name;
    nameContainer[1].innerHTML = data.elected_office;

    parentElement.append(nodesClone);
}

/**
 * Creates the information panel for the representative
 * adds information such as party, district name, email
 * also adds any websites that are in the data
 * @param {object} data contains one record of a representative
 * @param {element} parentElement The parent element to attach to
 */
function createInfoPanel(data, parentElement) {
    let temp = document.getElementById('infoPanel');
    let topContainer = temp.content.querySelector('div'); 
    let nodesClone = document.importNode(topContainer, true);

    // Party Name
    nodesClone.children[1].innerHTML = data.party_name;

    // district name
    nodesClone.children[2].children[1].innerHTML = data.district_name;

    // Representative set
    nodesClone.children[3].children[1].innerHTML = data.representative_set_name;

    // Email
    nodesClone.children[4].children[1].innerHTML = data.email;

    // create the web links here to keep them in the same info panel
    createWebLinks(data, nodesClone);

    parentElement.append(nodesClone);
}

/**
 * Creates the web links for a representative
 * does not display anything if a link does not exist to prevent confusion
 * @param {object} data contains one record of a representative
 * @param {element} parentElement The parent element to attach to
 */
function createWebLinks(data, parentElement) {

    // in this case, parent Element is also the template we need
    let infoPanel = parentElement;

    webLink(data.personal_url, infoPanel.children[5].children[0], "Personal Website")
    webLink(data.url, infoPanel.children[5].children[1], "Company Website")
    webLink(data.source_url, infoPanel.children[5].children[2], "Source")
}

/**
 * checks if a link exists, if it does, creates a link 'a' and adds it to element
 * @param {string} dataUrl The url to be added
 * @param {element} element the element to add the url to
 * @param {string} text The text for the link
 */
function webLink(dataUrl, element, text) {
    
    if (dataUrl === "") {
        element.innerHTML = "";
    } else {
        //clear default text
        element.innerHTML = "";
        let link = document.createElement('a');
        //create link, set the href, give it some text, link it to parent
        link.setAttribute('href', dataUrl);
        link.innerHTML = text;
        element.append(link);
    }
}

/**
 * Creates the address card for the representative
 * displays type, postal, tel and fax.
 * Address infomation may be missing fields, displays anyways for structure
 * @param {object} data contains one record of a representative
 * @param {element} parentElement The parent element to attach to
 */
function createAddressCards(data, parentElement) {
    if (data.offices.length > 0) {
        let container = document.createElement("h4");
        container.innerHTML = "Offices:";
        container.setAttribute('class', 'nameCardInfo');
        parentElement.append(container);
        parentElement.append(document.createElement('hr'));
    }
    
    for (index in data.offices)
    {
        addressCard(data.offices[index], parentElement);
    }
}

/**
 * 
 * @param {object} officeInfo an object that may contain address type, tel, fax and postal
 * @param {element} parentElement The parent element to attach to
 */
function addressCard(officeInfo, parentElement){
    // set up template
    temp = document.getElementById('locationInfo');
    let addressTop = temp.content.querySelector('div');
    let addressClone = document.importNode(addressTop, true);

    addressClone.children[0].children[1].innerHTML = officeInfo.type == null ? "Not Listed" : officeInfo.type;

    addressClone.children[1].children[1].innerHTML = officeInfo.tel == null ? "Not Listed" : officeInfo.tel;

    addressClone.children[1].children[4].innerHTML = officeInfo.fax  == null ? "Not Listed" : officeInfo.fax;

    addressClone.children[2].children[1].innerHTML = officeInfo.postal  == null ? "Not Listed" : officeInfo.postal;

    parentElement.append(addressClone);
    parentElement.append(document.createElement('hr'));
}