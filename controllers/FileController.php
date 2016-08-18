<?php

class FileController extends Zend_Controller_Action
{
	public function init()
	{
	// コントローラー初期化
	parent::init();
	}

	/**
	*ファイルのアップロード
	*@return [type][description]
	*/

	public function receiveAction()
	{
		$upload = new Zend_File_Transfer();

		//  ファイル名未設定の場合は無視
		$upload->setOptions(array('ignoreNoFile' => true));

		//  ファイル名チェックのバリデータを作成
		$validator = new Zend_Validate_Regex(array('pattern' => '/^success/'));

		// アップロードされたファイル情報を取得する
		$files = $upload->getFileInfo();

		$names = '';
		$size = $upload->getFileSize();

		// デフォルトの保存先を設定する
		$upload->setDestination('./file/');

		foreach ($files as $file => $info) {
			// アップロードファイルが指定されていない場合はスキップ
			if(!$upload->isUploaded($file)) {
				continue;
			}

			// ファイル名
			$names = $info['name'];

			// カテゴリーid
			$cateId = $_POST['idCategory'];

			// ディレクトリを決定
			if (!$cateId) {
				$directory = './file/';
			} else {
				// カテゴリテーブルから取得
	            $categoryModel = new Application_Model_DbTable_Categorys();
	            $category = $categoryModel->getCategory($cateId);

				$directory = './file/report/' . $category['dir'] . '/';
			}

			$upload->setDestination($directory, $file);
		}

		//  ファイルを受信する （テンポラリフォルダからファイルをコピーする）
		if(!$upload->receive()) {
			$messages = $upload->getMessages();
			echo implode("\n", $messages);
		}

		// ファイルサイズを取得
		$fsize = filesize(APPLICATION_PATH . '/.' . $directory . $names);



        $fsize = $this->getFileSizeUnit($fsize);



		$res = array(
			'messages' => null,
			'filename' => $names,
			'filesize' => $fsize,
 		);
        return $this->_helper->json->sendJson($res);
	}

    /**
     *ファイル単位
     *@return [type][description]
     */

    public function getFileSizeUnit($size) {
       $units = array('', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y');
		$u = 0;
		$unit;
		$n;
		$p;

		while (1000 <= $size) {
		    $size = $size / 1024;
		    $u++;
		}
		$unit = $units[$u];
		if (100 <= $size) {
			return round($size) . $unit . 'B';
		}
		$n = (10 <= $size ? (round($size * 10) / 10) : (round($size * 100) / 100)) . '';
		$p = (10 <= $size) ? ($size % 1) : ($size * 10 % 1);
		if (!$p && 4 > strlen($n)) {
			$n = substr(preg_replace('/^(\d+)$/', '$1.', $n) . '000', 0, 4);
		}
		return $n . $unit . 'B';
    }

}