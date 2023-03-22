<?php
	require_once($_SERVER["DOCUMENT_ROOT"] . "/utils/settings.php");

	$file = "main.php";
	$user_name = get_stored_user($dbh);
	if ($user_name && is_admin($dbh, $user_name))
		$file = "admin_panel.php";

	include_once($_SERVER["DOCUMENT_ROOT"] . "/pages/" . $file);
?>
