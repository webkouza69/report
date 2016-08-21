<?php
$db = new PDO("mysql:dbname=bbnavi; host=BBNAVIDB","bbsc","bbsc",
array(
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARACTER SET 'utf8'"
    ));
$sql = $db->prepare('SELECT * FROM unified_report.ledger_publish RIGHT JOIN unified_report.category_publish ON unified_report.ledger_publish.idCategory = unified_report.category_publish.id
                    WHERE unified_report.ledger_publish.deleted = 0
    order by unified_report.ledger_publish.idCategory, unified_report.ledger_publish.priority desc;');

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