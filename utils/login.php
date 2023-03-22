<?php
  require_once($_SERVER["DOCUMENT_ROOT"] . "/utils/settings.php");

  if (empty($_POST) || !isset($_POST["action"]))
  {
    header("Location: /");
    exit(0);    
  }

  switch ($_POST["action"])
  {
    case "checkUserEnterd":

      if (!isset($_POST["userName"]))
        $state = ["status" => "Failed", "description" => "user name absent"];
      else if (is_user_in_DB($dbh, htmlspecialchars($_POST["userName"])))
        $state = ["status" => "Success", "description" => "user already logged in"];
      else $state = ["status" => "Failed", "description" => "user logged out"];

      echo(json_encode((object)$state));
      exit(0);
    break;

    case "logIn":

      if (!isset($_POST["userName"]) || !isset($_POST["password"])) 
      {
        header("Location: /");
        exit(0);
      }
      
      $seeking_user = 
      [
        "name" => $_POST["userName"], 
        "password" => $_POST["password"]
      ];

      $seeking_user_safe =
      [
        "name" => htmlspecialchars($_POST["userName"]), 
        "password" => htmlspecialchars($_POST["password"])
      ];

      try
      {
        $found_user = identificate($dbh, htmlspecialchars($seeking_user["name"]));
        if (!$found_user) $found_user = register($dbh, $seeking_user_safe);
        if (!authenticate($seeking_user, $found_user))
        {
          header("Location: /");
          exit(0);
        }
        
        $time_expiring = time() + 60 * 60 * 1;
        $_SESSION["userName"] = $found_user["name"];
        setcookie("userName", $found_user["name"], $time_expiring, $path = "/");
      }
      catch (Esception $ex)
      {
        setcookie("userName", "", time(), $path = "/");
        session_destroy();
      }

      header("Location: /");
    break;

    case "logOut":
      setcookie("userName", "", time(), $path = "/");
      session_destroy();
      header("Location: /");
    break;
      
    default:
      header("Location: /");
    break;
  }
?>
