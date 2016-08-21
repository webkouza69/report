<?php

class Application_Model_DbTable_Ledgers extends Zend_Db_Table_Abstract
{
	protected $_name = 'ledger';



	public function getLedger($itemId){
		$sql = "SELECT * FROM ledger RIGHT JOIN category ON ledger.idCategory = category.id where ledger.itemId = " . (int)$itemId;
		$itemId = (int)$itemId;
		$adapter = $this->getAdapter();
		return $adapter->fetchRow($sql);
	}

	public function getAllLedger()
	{

	// DBテーブル結合 すべて
		$sql = 'SELECT * FROM ledger RIGHT JOIN category ON ledger.idCategory = category.id;';

		$adapter = $this->getAdapter();
		$resultSet = $adapter->fetchAll($sql);

		return $resultSet;
	}

	// カテゴリー毎に表示する設定
	public function getCategories() {

		$sqlCate = 'SELECT * FROM ledger RIGHT JOIN category ON ledger.idCategory = category.id
		order by ledger.idCategory, ledger.priority desc;';

		$adapter = $this->getAdapter();
		$rows = $adapter->fetchAll($sqlCate);
		$rows = $this->groupArray($rows, 'id');
		return $rows;

	}

	// カテゴリー毎にグループ設定
	public function groupArray($rows, $key) {
    		$retval = array();

    		foreach($rows as $value) {
        		$group = $value[$key];

        		if (!isset($retval[$group])) {
            	$retval[$group] = array();
        	}

        $retval[$group][] = $value;
		}
			return $retval;
	}

	public function addLedger($itemId,$idCategory,$idLedger,$ledgerName,$color,$annotation,$ledgerFile,$fileSize,$display,$remarks,$comment,$bgColor,$dateUpdate,$priority)
	{
		$data = array(
		              'itemId'=> $itemId,
		              'idCategory'=> $idCategory,
		              'idLedger'=> $idLedger,
		              'ledgerName'=> $ledgerName,
		              'color'=> $color,
		              'annotation'=> $annotation,
		              'ledgerFile'=> $ledgerFile,
		              'fileSize'=> $fileSize,
		              'display'=> $display,
		              'remarks'=> $remarks,
		              'comment'=> $comment,
		              'bgColor'=> $bgColor,
		              'dateUpdate'=> $dateUpdate,
		              'priority'=> $priority
		);
		$this->insert($data);
	}

	public function updateLedger($itemId,$id,$idLedger,$idCategory,$ledgerName,$color,$annotation,$ledgerFile,$fileSize,$display,$remarks,$comment,$bgColor,$dateUpdate)
	{


		$data = array(
		              'itemId'=> $itemId,
		              'idLedger'=> $idLedger,
		              'idCategory'=> $idCategory,
		              'ledgerName'=> $ledgerName,
		              'color'=> $color,
		              'annotation'=> $annotation,
		              'ledgerFile'=> $ledgerFile,
		              'fileSize'=> $fileSize,
		              'display'=> $display,
		              'remarks'=> $remarks,
		              'comment'=> $comment,
		              'bgColor'=> $bgColor,
		              'dateUpdate'=> $dateUpdate
		);

		$this->update($data, 'itemId = '.(int)$itemId);




	}

	public function sortLedger($itemId,$priority)
	{


		$data = array(
		              'priority'=> $priority
		);

		$this->update($data, 'itemId = '.(int)$itemId);




	}

	public function deleteLedger($itemId)
	{
		$data = array(
		              'deleted'=> 1
		);

		$this->update($data, 'itemId = '.(int)$itemId);

	}
}