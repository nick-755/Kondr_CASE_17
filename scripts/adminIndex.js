import { isUserEntered, showExitPanel } from "/scripts/logIn.js";

document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelector("button").addEventListener("click", showExitPanel);
  async function toggleValueInDB(commentId)
  {
    const formData = new FormData();
    formData.append("action", "toggleCommentStatus");
    formData.append("commentId", commentId);

    return await fetch("/utils/comments.php", 
    {
      method: "POST",
      body: formData
    });
  }

  const tableElement = document.querySelector("table");
  tableElement.addEventListener("click", async e => 
  {
    const element = e.target;
    if (element.nodeName !== "TD") return;
    if (!element.hasAttribute("id")) return;

    await toggleValueInDB(element.parentElement.cells[0].textContent)
    .then(async response => 
    {
      const state = await response.json();
      switch (state["status"])
      {
        case "Success":
          element.textContent = state["newValue"];
          element.classList.toggle("visible");
          console.info("comment updating...%c SUCCESS ", "color: white; background-color: green");
        break;
        case "Error": throw new Error(state["description"]);
        case "Unknown": default: console.warn("data updating...%c WARNING ", "color: black; background-color: yellow" ,`\n${state["description"]}`);
        break;
      }
    })
    .catch(reason => console.error("data updating...%c ERROR ", "color: yellow; background-color: red" ,`\n${reason}`));
  });
});
