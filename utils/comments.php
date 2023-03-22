<?php
  require_once($_SERVER["DOCUMENT_ROOT"] . "/utils/settings.php");
  
  if (empty($_POST) || !$_POST["action"]) exit(0);

  switch ($_POST["action"])
  {
    case "addComment":
      try
      {
        $query = $dbh->prepare("SELECT users.id FROM users WHERE users.name = :name");
        if (!$query->execute(["name" => $_POST['user']]))
          throw new Exception($query->errorInfo()[2]);

        $user_id = $query->fetch()["id"];
        $comment_text = htmlspecialchars($_POST['text']);
        $parameters = ["user_id" => $user_id, "comment_text" => $comment_text];

        $query = $dbh->prepare("INSERT INTO comments SET user_id=:user_id, comment_text=:comment_text");
        if (!$query->execute($parameters)) throw new Exception($query->errorInfo()[2]);

        $state = ["status" => "Success", "description" => "comment added"];
      }
      catch (PDOException $ex)
      {
        $state = ["status" => "Error", "description" => "\nReason: {$ex->getMessage()}\nFile: {$ex->getFile()}\nLine: {$ex->getLine()}"];
      }
      catch (Exception $ex)
      {
        $state = ["status" => "Error", "description" => "\nReason: {$ex->getMessage()}\nFile: {$ex->getFile()}\nLine: {$ex->getLine()}"];
      }
      catch (Error | Exception $err)
      {
        $state = ["status" => "Error", "description" => "\nReason: {$err->getMessage()}\nFile: {$err->getFile()}\nLine: {$err->getLine()}"];
      }

      echo(json_encode((object)$state));
    break;
    case "toggleCommentStatus":
      try
      {
        $comment_id = $_POST["commentId"];
        if ($comment_id !== htmlspecialchars($comment_id)) throw new Error("security warning");

        $parameters = ["comment_id" => $comment_id];
        $query = $dbh->prepare("SELECT is_removed FROM comments WHERE id = :comment_id");
        if (!$query->execute($parameters)) throw new Exception($query->errorInfo()[2]);

        $value = $query->fetch()[0];
        $value = $value == 0 ? 1 : 0;

        $parameters["is_removed"] = $value;
        $query = $dbh->prepare("UPDATE comments SET is_removed = :is_removed WHERE id = :comment_id");
        if (!$query->execute($parameters)) throw new Exception($query->errorInfo()[2]);

        $value = $value == 0 ? "да" : "нет";
        $state = ["status" => "Success", "newValue" => $value, "description" => "comment removed state updated"];
      }
      catch (PDOException $ex)
      {
        $state = ["status" => "Error", "description" => "\nReason: {$ex->getMessage()}\nFile: {$ex->getFile()}\nLine: {$ex->getLine()}"];
      }
      
      echo(json_encode((object)$state));  
    break;
    default:
      $state = ["status" => "Unknown", "description" => "unknown app state"];
      echo(json_encode((object)$state));
    break;
  }
?>
