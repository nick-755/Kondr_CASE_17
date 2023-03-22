import { getUserName } from "/scripts/logIn.js";

async function sentComment(formElement)
{
  const commentFormData = new FormData(formElement);
  commentFormData.append("action", "addComment");
  commentFormData.append("user", getUserName());

  return await fetch("/utils/comments.php", 
  {
    method: "POST",
    cache: "no-cache",
    body: commentFormData
  });
}  

export const sentCommentToServer = sentComment;
