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

			// $dirData  = array(
			//                   'flets' => './file/report/flets/',
			//                   'hikari' => './file/report/hikari/',
			//                   'appli' => './file/report/appli/',
			//                   'legacy' => './file/report/legacy/',
			//                   'fee' => './file/report/fee/',
			//                   'kiki' => './file/report/kiki/',
			//                   'vpn' => './file/report/vpn/',
			//                    );

			// // カテゴリーによって振り分け先を設定する
			// if ($cateId == 1) {
			// 	$upload->setDestination($dirData['flets'], $file);

			// } elseif($cateId == 2) {
			// 	$upload->setDestination($dirData['hikari'], $file);

			// } elseif($cateId == 3) {
			// 	$upload->setDestination($dirData['appli'], $file);

			// } elseif($cateId == 4) {
			// 	$upload->setDestination($dirData['legacy'], $file);

			// } elseif($cateId == 5) {
			// 	$upload->setDestination($dirData['fee'], $file);

			// } elseif($cateId == 6) {
			// 	$upload->setDestination($dirData['kiki'], $file);

			// } elseif($cateId == 7) {
			// 	$upload->setDestination($dirData['vpn'], $file);

			// } else {
			// 	$upload->setDestination('./file/', $file);
			// }
		}

		//  ファイルを受信する （テンポラリフォルダからファイルをコピーする）
		if(!$upload->receive()) {
			$messages = $upload->getMessages();
			echo implode("\n", $messages);
		}

		// ファイルサイズを取得
		$fsize = filesize(APPLICATION_PATH . '/.' . $directory . $names);

		// if ($cateId == 1) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['flets'] . $names);

		// 	} elseif($cateId == 2) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['hikari'] . $names);

		// 	} elseif($cateId == 3) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['appli'] . $names);

		// 	} elseif($cateId == 4) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['legacy'] . $names);

		// 	} elseif($cateId == 5) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['fee'] . $names);

		// 	} elseif($cateId == 6) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['kiki'] . $names);

		// 	} elseif($cateId == 7) {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . $dirData['vpn'] . $names);

		// 	} else {
		// 		$fsize = filesize(APPLICATION_PATH . '/.' . './file/' . $names);
		// 	}

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
        $cnt = 0;
        $buf = 0;
        $unit = array('B', 'KB', 'MB', 'GB', 'TB');
        while(1) {
            if($cnt > count($unit) - 1) {
                $cnt = 9999;
                break;
            }
            if(!isset($s)) $s = $size;
            $sbuf = 1;
            $sbuf = floor($s / 1024);
            if($sbuf < 1){
                $fs = $s + round(($size - ($s * pow(1024, $cnt))) / pow(1024, $cnt), 1);
                $fs .= $unit[$cnt];
                break;
            }else{
                $s = $sbuf;
            }
            $cnt ++;
        }
        return $fs;
    }

}