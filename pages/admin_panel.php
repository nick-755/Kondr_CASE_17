<?php 

  $user_name = get_stored_user($dbh);
  if (!$user_name || !is_admin($dbh, $user_name))
  {
    header("Location: /");
    exit(0);
  }

  $all_comments = $dbh->query("SELECT comments.*, users.name as user_name FROM comments, users where users.id = comments.user_id ORDER BY comments.adding_datetime DESC");

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" src="/scripts/adminIndex.js"></script>
  <link rel="stylesheet" href="/styles/adminpanel.css">
	<title><?php echo(APP_TITLE); ?></title>
</head>
<body>
  <h1>Admin panel</h1>
  <button class="input_element">Log out</button>
  <table>
    <tr><th>id</th><th>username</th><th>comment</th><th>adding date & time</th><th>show</th></tr>
    <?php foreach ($all_comments as $row): ?>
      <tr>
        <td><?php echo($row["id"]);?></td>
        <td><?php echo($row["user_name"]);?></td>
        <td><?php echo($row["comment_text"]);?></td>
        <td><?php echo($row["adding_datetime"]);?></td>
        <td id="is_removed" <?php echo $row["is_removed"] == 0 ? 'class="visible"' : ""?>><?php echo $row["is_removed"] == 0 ? "yes" : "no"?></td>
      </tr>
    <?php endforeach; ?>
  </table>
</body>
</html>
