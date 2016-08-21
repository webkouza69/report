<?php

class Application_Model_DbTable_Publish extends Zend_Db_Table_Abstract
{
	protected $_name = 'publish';



	public function publish(){
		/**
 		* プレビューテーブルから公開テーブルにコピー
 		*/
		$adapter = $this->getAdapter();

		// カテゴリーテーブルをコピー
		$category_sql = 'REPLACE INTO category_publish SELECT * FROM category';
		$adapter->query($category_sql);

		// 帳票テーブルをコピー
		$ledger_sql = 'REPLACE INTO ledger_publish SELECT * FROM ledger';
		$adapter->query($ledger_sql);

		// トップ帳票テーブルをコピー
		$top_sql = 'REPLACE INTO topledger_publish SELECT * FROM topledger';
		$adapter->query($top_sql);
	}

	public function resetStage(){
		/**
 		* 公開テーブルからプレビューテーブルにコピー
 		*/
		$adapter = $this->getAdapter();

		// カテゴリーテーブルをコピー
		$category_sql = 'REPLACE INTO category SELECT * FROM category_publish';
		$adapter->query($category_sql);

		// 帳票テーブルをコピー
		$ledger_sql = 'REPLACE INTO ledger SELECT * FROM ledger_publish';
		$adapter->query($ledger_sql);

		// トップ帳票テーブルをコピー
		$top_sql = 'REPLACE INTO topledger SELECT * FROM topledger_publish';
		$adapter->query($top_sql);
	}






}