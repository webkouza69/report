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

		$res = array(
			'messages' => null,
			'filename' => $names,
			'filesize' => filesize(APPLICATION_PATH . '/../file/' . $names),
 		);
        return $this->_helper->json->sendJson($res);
	}

	/**
	 * ファイルのダウンロード
	 * @return [type][description]
	 */

	public function downloadAction()
	{
		//  $this->_helper->viewRenderer->setNoRender();

		// $dlFilePath = "path/to/download.tar.gz";  // ダウンロードするファイルパス
		// $dlFileName = "name.tar.gz"               // ダウンロードファイル名

		// ヘッダの設定
		$this->getResponse()->setHeader('Content-type', 'application/octet-stream');
		$this->getResponse()->setHeader('Content-Disposition', 'attachment; fileName=' . $dlFileName);
		$this->getResponse()->setHeader('Content-length', filesize($dlFilePath));

		// ヘッダの送信
		$this->getResponse()->sendHeaders();

		// 出力バッファを無効にする。
		ob_end_clean();
		// 再度バッファリングを有効にする場合は記述する。
		// ob_start(null, 81920);


		/**
		 * readfile() 関数などで一度にファイルを読み込むと
		 * メモリ不足エラーとなるので少しずつ出力する
		 */

		$fhandle = fopen($dlFilePath, 'rb');
		while (!feof($fhandle)) {

			//  bodyにセットし、出力する
			$this->getResponse()->setBody(fread($fhandle, 8192));
			$this->getResponse()->outputBody();

			// 上記２行は、以下の処理と等価である
			// echo implode('', fread($fhandle, 8192));
		}
		fclose($fhandle);
	}
}