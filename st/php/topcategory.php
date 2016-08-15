<?php

$db = new PDO("mysql:dbname=unified_report; host=localhost","root","root",
array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARACTER SET 'utf8'"
    ));

$sql = $db->prepare('SELECT * FROM unified_report.category
    order by unified_report.category.priority');

$sql->execute();
$all_category = $sql->fetchAll();


$sql2 = $db->prepare('SELECT * FROM unified_report.topledger');

$sql2->execute();
$top_ledger = $sql2->fetchAll();

?>
