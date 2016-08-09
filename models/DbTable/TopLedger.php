<?php

class Application_Model_DbTable_TopLedger extends Zend_Db_Table_Abstract
{
	protected $_name = 'topledger';


	public function topLedger()
	{

		$sql = 'SELECT * FROM topledger';

		$adapter = $this->getAdapter();
		$resultTop = $adapter->fetchAll($sql);

		return $resultTop;
	}


	public function updateTopLedger($id,$fileName,$fileSize,$bikou)
	{


		$data = array(
		              'id'=> $id,
		              'fileName'=> $fileName,
		              'fileSize'=> $fileSize,
		              'bikou'=> $bikou
		);

		$this->update($data, 'id = '.(int)$id);




	}

}