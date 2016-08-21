<?php

class Application_Model_DbTable_Categorys extends Zend_Db_Table_Abstract
{
	protected $_name = 'category';

	// 指定したIDに一致するカテゴリーを取得
	public function getCategory($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if(!$row){
			throw new Exception("Could not find row $id");
		}
		return $row->toArray();
	}

	// カテゴリー一覧を取得
	public function getAllCategory()
	{
		$sql = 'SELECT * FROM category ORDER BY priority DESC';

		$adapter = $this->getAdapter();
		$resultSet = $adapter->fetchAll($sql);

		return $resultSet;
	}

	public function addCategory($id,$cateName, $imgName, $anchorName, $priority, $remarks, $dir)
	{
		$data = array(
		              'cateName'=> $cateName,
		              'imgName'=> $imgName,
		              'anchorName'=> $anchorName,
		              'priority'=> $priority,
                      'remarks'=> $remarks,
                      'dir'=> $dir
		);
		$this->insert($data);
	}

	public function updateCategory($id, $cateName, $imgName, $anchorName, $priority, $remarks, $dir)
	{
		$data = array(
		              'cateName'=> $cateName,
		              'imgName'=> $imgName,
		              'anchorName'=> $anchorName,
		              'priority'=> $priority,
                      'remarks'=> $remarks,
                      'dir'=> $dir
		);
		$this->update($data, 'id = '.(int)$id);
	}

	public function deleteCategory($id)
	{
		$this->delete('id = ' . (int)$id);
	}
}