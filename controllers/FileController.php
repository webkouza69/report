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

			// ファイル名によって振り分け先を設定する
			if ($validator->isValid($info['name'])) {
				$upload->setDestination('./file/', $file);
			} else {
				$upload->setDestination('./file/', $file);
			}
		}

		//  ファイルを受信する （テンポラリフォルダからファイルをコピーする）
		if(!$upload->receive()) {
			$messages = $upload->getMessages();
			echo implode("\n", $messages);
		}

        $fsize = filesize(APPLICATION_PATH . '/../file/' . $names);
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