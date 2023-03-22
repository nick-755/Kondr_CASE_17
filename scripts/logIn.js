function getCookieObject()
{
  const cookie = document.cookie;

  if (cookie.length === 0) return {};

  return cookie
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
}

function tryGetStoredUserName()
{
  const USER_PROPERTY = "userName";
  const cookie = getCookieObject();
  return cookie.hasOwnProperty(USER_PROPERTY) ? getCookieObject()[USER_PROPERTY] : false;
}

async function checkIsUserEntered()
{
  const formData = new FormData();
  const userName = tryGetStoredUserName();
  if (!userName) return false;
  
  formData.append("action", "checkUserEnterd");
  formData.append("userName", userName);
  
  return await fetch("/utils/login.php",
  {
    method: "POST",
    body: formData
  })
  .then(async response => 
  {
    const state = await response.json();
    switch (state["status"])
    {
      case "Success": return true;
      case "Failed": return false;
    }
  })
  .catch(reason => 
  {
    console.error("user entered checking...%c ERROR ", "color: yellow; background-color: red" ,`\n${reason}`);
    return false;
  });
}

function removeWrapper(wrapperElement)
{
  wrapperElement.remove();
  document.body.classList.remove("noscroll");
}

function addWrapperRemover(wrapperElement)
{
  wrapperElement.addEventListener
  (
    "click",
    e => e.target === wrapperElement ? removeWrapper(wrapperElement) : null
  );
}

function logOutPanel()
{
  const wrapperElement = document.createElement("div");
  wrapperElement.classList.add("form__wrapper");
  addWrapperRemover(wrapperElement);

  const signOutPanelElement = document.createElement("form");
  signOutPanelElement.setAttribute("action", "/utils/login.php");
  signOutPanelElement.setAttribute("method", "POST");
  signOutPanelElement.classList.add("form", "form__panel");
  signOutPanelElement.addEventListener("submit", async e =>
  {
    if (e.submitter.dataset.behavior !== "send")
    {
      e.preventDefault();
      removeWrapper(wrapperElement);
    }
  });
  
  const panelTitleElement = document.createElement("h2");
  panelTitleElement.classList.add("form__element", "element__title");
  panelTitleElement.textContent = "Log out";

  const hiddenActionElement = document.createElement("input");
  hiddenActionElement.setAttribute("type", "hidden");
  hiddenActionElement.setAttribute("name", "action");
  hiddenActionElement.setAttribute("value", "logOut");

  const submitButtonElement = document.createElement("input");
  submitButtonElement.setAttribute("type", "submit");
  submitButtonElement.setAttribute("value", "Exit");
  submitButtonElement.dataset.behavior = "send";
  submitButtonElement.classList.add("form__element", "element__control", "input_element");

  const cancelButtonElement = document.createElement("input");
  cancelButtonElement.setAttribute("type", "submit");
  cancelButtonElement.setAttribute("value", "Cancel");
  cancelButtonElement.classList.add("form__element", "element__control", "input_element");

  const buttonsContainerElement = document.createElement("div");
  buttonsContainerElement.append(submitButtonElement, cancelButtonElement);
  buttonsContainerElement.classList.add("controls__container");

  signOutPanelElement
  .append(panelTitleElement, buttonsContainerElement, hiddenActionElement);
  
  wrapperElement.append(signOutPanelElement);
  document.body.prepend(wrapperElement);
}

function logInPanel()
{
  document.body.classList.add("noscroll");

  const wrapperElement = document.createElement("div");
  wrapperElement.classList.add("form__wrapper");
  addWrapperRemover(wrapperElement);

  const signInPanelElement = document.createElement("form");
  signInPanelElement.classList.add("form", "form__panel");
  signInPanelElement.setAttribute("action", "/utils/login.php");
  signInPanelElement.setAttribute("method", "POST");
  signInPanelElement.addEventListener("click", async e =>
  {
    if (e.target.dataset.behavior === "cancel")
      removeWrapper(wrapperElement);
  });

  const panelTitleElement = document.createElement("h2");
  panelTitleElement.classList.add("form__element", "element__title");
  panelTitleElement.textContent = "Log in";

  const hiddenActionElement = document.createElement("input");
  hiddenActionElement.setAttribute("type", "hidden");
  hiddenActionElement.setAttribute("name", "action");
  hiddenActionElement.setAttribute("value", "logIn");

  const nameFieldElement = document.createElement("input");
  nameFieldElement.setAttribute("type", "text");
  nameFieldElement.setAttribute("name", "userName");
  nameFieldElement.setAttribute("placeholder", "name...");
  nameFieldElement.setAttribute("required", "true");
  nameFieldElement.classList.add("form__element", "element__text");

  const passwordFieldElement = document.createElement("input");
  passwordFieldElement.setAttribute("type", "password");
  passwordFieldElement.setAttribute("name", "password");
  passwordFieldElement.setAttribute("placeholder", "password...");
  passwordFieldElement.setAttribute("required", "true");
  passwordFieldElement.classList.add("form__element", "element__text");
  
  const submitButtonElement = document.createElement("input");
  submitButtonElement.setAttribute("type", "submit");
  submitButtonElement.classList.add("form__element", "element__control", "input_element");
  submitButtonElement.value = "Log in";
  
  const cancelButtonElement = document.createElement("input");
  cancelButtonElement.setAttribute("type", "button");
  cancelButtonElement.setAttribute("value", "Cancel");
  cancelButtonElement.classList.add("form__element", "element__control", "input_element");
  cancelButtonElement.dataset.behavior = "cancel";

  const buttonsContainerElement = document.createElement("div");
  buttonsContainerElement.append(submitButtonElement, cancelButtonElement);
  buttonsContainerElement.classList.add("controls__container")

  signInPanelElement.append(
    panelTitleElement,
    nameFieldElement,
    passwordFieldElement,
    buttonsContainerElement,
    hiddenActionElement);
  
  wrapperElement.append(signInPanelElement);
  document.body.prepend(wrapperElement);
}

export const showExitPanel      = logOutPanel;
export const showEnterancePanel = logInPanel;
export const isUserEntered      = checkIsUserEntered;
export const getUserName        = tryGetStoredUserName;
