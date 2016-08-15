<?php

$db = new PDO("mysql:dbname=unified_report; host=localhost","root","root",
array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARACTER SET 'utf8'"
    ));

$sql = $db->prepare('SELECT * FROM unified_report.ledger RIGHT JOIN unified_report.category ON unified_report.ledger.idCategory = unified_report.category.id where unified_report.ledger.deleted = 0
    order by unified_report.ledger.idCategory, unified_report.ledger.priority desc');

$sql->execute();
$all = $sql->fetchAll();
$all = groupArray($all, 'id');

// カテゴリー毎にグループ設定
function groupArray($all, $key) {
        $retval = array();

        foreach($all as $value) {
            $group = $value[$key];

            if (!isset($retval[$group])) {
              $retval[$group] = array();
          }

        $retval[$group][] = $value;
    }
      return $retval;
  }

?>