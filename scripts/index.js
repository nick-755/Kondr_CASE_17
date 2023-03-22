import "/scripts/jQuery.min.js"
import "/scripts/softScroll.js";
import "/scripts/map.js";

import { sentCommentToServer } from "/scripts/sentComment.js";
import { getUserName, isUserEntered, showEnterancePanel, showExitPanel } from "/scripts/logIn.js";

document.addEventListener("DOMContentLoaded", async e =>
{
  const userName = await getUserName();
  const accountItemElement = document.querySelector(".item__account");
  accountItemElement.textContent = userName || "Log in";
  accountItemElement.addEventListener("click", async e =>
  {
    if (await isUserEntered())
    {
      showExitPanel();
      return;
    }

    showEnterancePanel();
  });   

  const sentCommentElement = document.querySelector("#commentForm");
  sentCommentElement.addEventListener("submit", async submitEvent =>
  {
    function getCommentQuantity()
    {
      return parseInt(document.querySelector(".section__comments").dataset.commentsQuantity);
    }

    function updateCommentsQuantity()
    {
      const commentsSectionElement = document.querySelector(".section__comments");
      commentsSectionElement.dataset.commentsQuantity = getCommentQuantity() + 1;
      document.querySelector(".comments__indicator__enter")
      .textContent = `Total comments: ${getCommentQuantity()}`;
    }

    function makeHorizontalDelimeterElement()
    {
      const element = document.createElement("hr");
      element.classList.add("delimeter_horizontal");
      return element;
    }

    function makeCommentElement()
    {
      const authorLogoElement = document.createElement("img");
      authorLogoElement.classList.add("author__logo");
      authorLogoElement.setAttribute("alt", "author logo");
      
      const authorNameElement = document.createElement("span");
      authorNameElement.classList.add("author__name");
      authorNameElement.textContent = `[ ${getUserName()} ]`;

      const commentAuthorElement = document.createElement("div");
      commentAuthorElement.classList.add("comment", "comment__author")
      commentAuthorElement.append(authorLogoElement, authorNameElement);
      
      const commentTextElement = document.createElement('div');
      commentTextElement.classList.add("comment", "comment__text")
      commentTextElement.textContent = submitEvent.target.text.value;

      const commentElement = document.createElement("article");
      commentElement.classList.add("list__comment");
      commentElement.append(commentAuthorElement, commentTextElement);

      const commentWrapperElement = document.createElement("div");
      commentWrapperElement
      .append(makeHorizontalDelimeterElement(), commentElement)
      return commentWrapperElement;
    }

    function makeCommentsListElement()
    {
      const element = document.createElement("div");
      element.classList.add("comments__list");
      element.append(makeHorizontalDelimeterElement());
      return element;
    }

    function replaceInvitaionOnCommentsList()
    {
      document.querySelector(".comments__greeting")
      .replaceWith(makeCommentsListElement());
    }

    function getCommentsListElement()
    {
      return document.querySelector(".comments__list");
    }

    function appendComment()
    {
      if (getCommentQuantity() === 0) replaceInvitaionOnCommentsList();
      getCommentsListElement().prepend(makeCommentElement());
    }

    
    submitEvent.preventDefault();
    if (! await isUserEntered())
    {
      showEnterancePanel();
      return;
    }

    await sentCommentToServer(submitEvent.target)
    .then(async response => 
    {
      const state = await response.json();
      switch (state["status"])
      {
        case "Success":
          appendComment();
          updateCommentsQuantity();
          submitEvent.target.text.value = "";
          console.info("comment sending...%c SUCCESS ", "color: white; background-color: green;");
        break;
        case "Error": throw new Error(state["description"]);
        case "Unknown": default: console.warn("data sending...%c WARNING ", "color: black; background-color: yellow" ,`\n${state["description"]}`);
        break;
      }
    })
    .catch(reason => console.error("data sending...%c ERROR ", "color: yellow; background-color: red" ,`\n${reason}`));
  });
});
