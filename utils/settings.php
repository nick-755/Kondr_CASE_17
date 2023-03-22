<?php
  error_reporting(E_ALL);
  ini_set('display_errors', '1');
  define("APP_TITLE", "Seegson Synthetics");
  define("ADMIN_RIGHT_ID", "1");
  session_start();
  
  $dbh = new PDO("mysql:host=localhost;dbname=landingpage", "root", "M7SQL_r00t_p4ssw0rd");
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  $comments_list = $dbh->query("SELECT * FROM users_comments ORDER BY adding_datetime DESC");

  function is_admin($PDO_connection, $user_name)
  {
    $parameters = ["user_name" => htmlspecialchars($user_name)];
    $query_string = "SELECT right_id FROM users WHERE (name = :user_name) and (is_removed = 0)";
    $query = $PDO_connection->prepare($query_string);
    if (!$query->execute($parameters)) throw new Exception($query->errorInfo()[2]);
    return $query->fetch()["right_id"] === ADMIN_RIGHT_ID;
  }

  function register($PDO_connection, $user)
  {
    $parameters = ["user_name" => $user["name"], "password" => $user["password"]];
    $query_string = "INSERT INTO users SET name = :user_name, password = :password";
    $query = $PDO_connection->prepare($query_string);
    if (!$query->execute($parameters)) throw new Exception($query->errorInfo()[2]);
    return $user; 
  }
  
  function identificate($PDO_connection, $user_name)
  {
    $parameters = ["user_name" => $user_name];
    $query_string = "SELECT id, name, password, right_id FROM users WHERE (name = :user_name) and (is_removed = 0)";
    $query = $PDO_connection->prepare($query_string);
    return $query->execute($parameters) ? $query->fetch() : false;
  }
  
  function authenticate($source_user, $target_user)
  {
    return $source_user["password"] === $target_user["password"];
  }

  function is_user_in_DB($PDO_connection, $user_name)
  {
    $parameters = ["user_name" => $user_name];
    $query_string = "SELECT id FROM users WHERE (name = :user_name) and (is_removed = 0)";
    $query = $PDO_connection->prepare($query_string);
    return $query->execute($parameters) ? true : false;
  }

  function get_stored_user($PDO_connection)
  {
    if (isset($_SESSION["userName"])) return $_SESSION["userName"];
    else if 
    (
      isset($_COOKIE["userName"]) 
      && (is_user_in_DB($PDO_connection, htmlspecialchars($_COOKIE["userName"])))
    ) return $_COOKIE["userName"];
    else return false;
  }
?>
