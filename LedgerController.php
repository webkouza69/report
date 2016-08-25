<?php
/**
 * 統一帳票一覧更新用コントローラ
 */

class LedgerController extends Zend_Controller_Action
{


    /*
     * 帳票一覧更新ページの表示
     */
    public function ledgerAction()
    {
        // 全帳票
        $rows = new Application_Model_DbTable_Ledgers();
        $this->view->allLedgers = $rows->getCategories();


        $ledItem = new Application_Model_DbTable_Categorys();
        $this->view->allCategory = $ledItem->getAllCategory();

    }

    function addledgerAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        if ($this->getRequest()->isPost()) {

            // jsonで返すデータ
            $res = array(
                'error' => true,
                'messages' => null,
            );

            $checkResult = $this->check($_POST);
            if ($checkResult !== true) {
                // ajaxでメッセージとかを返す
                $res['messages'] = $checkResult;
                return $this->_helper->json->sendJson($res);
            }

            // DB処理
            $ledgerItem = new Application_Model_DbTable_Ledgers();
            $ledgerItem->addLedger(
                $_POST['itemId'],
                $_POST['idCategory'],
                $_POST['idLedger'],
                $_POST['ledgerName'],
                $_POST['color'],
                $_POST['annotation'],
                $_POST['ledgerFile'],
                $_POST['fileSize'],
                $_POST['display'],
                $_POST['comment'],
                $_POST['bgColor'],
                $_POST['dateUpdate']
            );

            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);

        } else {
            // isPost() ではない -> modalで画面表示の呼び出し時

            // カテゴリー一覧を取得してviewに渡す
            $categorys = new Application_Model_DbTable_Categorys();
            $this->view->allCategory = $categorys->getAllCategory();

            $this->view->ledgers = $ledgers;
        }
    }

   function editledgerAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        if($this->getRequest()->isPost()) {

            // jsonで返すデータ
            $res = array(
                         'error' => true,
                         'message' => null,
            );

            $checkResult = self::check($_POST);
            if ($checkResult !== true) {
                // ajaxでメッセージとかを返す
                $res['messages'] = $checkResult;
                return $this->_helper->json->sendJson($res);
            }


            // DB処理
            $ledgerItem = new Application_Model_DbTable_Ledgers();
            $ledgerItem->updateLedger(
                $_POST['itemId'],
                $_POST['id'],
                $_POST['idLedger'],
                $_POST['idCategory'],
                $_POST['ledgerName'],
                $_POST['color'],
                $_POST['annotation'],
                $_POST['ledgerFile'],
                $_POST['fileSize'],
                $_POST['display'],
                $_POST['comment'],
                $_POST['bgColor'],
                $_POST['dateUpdate']
            );

            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);

        } else {


            $itemId = $this->getParam('itemId', 0);

            if($itemId > 0){
                $ledgerItems = new Application_Model_DbTable_Ledgers();
                $ledgers = $ledgerItems->getLedger($itemId);

                $this->view->ledgers = $ledgers;

                // カテゴリー一覧を取得してviewに渡す
            $categorys = new Application_Model_DbTable_Categorys();
            $this->view->allCategory = $categorys->getAllCategory();

            $this->view->ledger = $ledger;

            }
        }

    }

    /**
     * カテゴリの帳票を一括で更新する
     * @return [type] [description]
     */
    function changeledgerAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        // jsonで返すデータ
        $res = array(
            'error' => true,
            'message' => null,
        );

        if (!$this->getRequest()->isPost()) {
            $res['message'] = 'データが送信されていません';
            return $this->_helper->json->sendJson($res);
        }

        // 帳票の個数を取得
        $ledgerCount = @count($_POST['itemId']);

        // バリデーション
        $messages = array();
        for ($i = 0; $i < $ledgerCount; $i++) {
            // 配列のデータを1つのデータとして生成(バリデーションのため)
            $data = array();
            $data['itemId'] = $_POST['itemId'][$i];
            $data['idLedger'] = $_POST['idLedger'][$i];
            $data['idCategory'] = $_POST['idCategory'][$i];
            $data['ledgerName'] = $_POST['ledgerName'][$i];
            $data['color'] = $_POST['color'][$i];
            $data['annotation'] = $_POST['annotation'][$i];
            $data['ledgerFile'] = $_POST['ledgerFile'][$i];
            $data['fileSize'] = $_POST['fileSize'][$i];
            $data['display'] = $_POST['display'][$i];
            $data['comment'] = $_POST['comment'][$i];
            $data['bgColor'] = $_POST['bgColor'][$i];
            $data['dateUpdate'] = $_POST['dateUpdate'][$i];

            $checkResult = $this->check($data);
            if ($checkResult !== true) {
                $messages[$i] = $checkResult;
            }
        }

        // エラーがあれば返す
        if (@count($messages) > 0) {
            $res['message'] = $messages;
            return $this->_helper->json->sendJson($res);
        }

        // DB更新処理
        for ($i = 0; $i < $ledgerCount; $i++) {
            $ledgerItem = new Application_Model_DbTable_Ledgers();
            $ledgerItem->updateLedger(
                $_POST['itemId'][$i],
                $_POST['idLedger'][$i],
                $_POST['idCategory'][$i],
                $_POST['ledgerName'][$i],
                $_POST['color'][$i],
                $_POST['annotation'][$i],
                $_POST['ledgerFile'][$i],
                $_POST['fileSize'][$i],
                $_POST['display'][$i],
                $_POST['comment'][$i],
                $_POST['bgColor'][$i],
                $_POST['dateUpdate'][$i]
            );
        }

        // 今回送信されたカテゴリのファイル名を配列に設定
        $fileNames = array();
        for ($i = 0; $i < $ledgerCount; $i++) {
            $fileNames[] = $_POST['ledgerFile'][$i];
        }

        // カテゴリに所属しない不要なファイルを削除
        $this->deleteFiles($fileNames, $_POST['idCategory'][0]);

        // ajaxでOKとかを返す
        $res['error'] = false;
        return $this->_helper->json->sendJson($res);
    }

    /**
     * カテゴリフォルダ内にある不要なファイルを削除
     * @param  array $fileNames  送信されたファイル名の配列
     * @param  int   $idCategory カテゴリID
     * @return void
     */
    private function deleteFiles($fileNames, $idCategory)
    {
        // カテゴリをテーブルから取得
        $categoryModel = new Application_Model_DbTable_Categorys();
        $category = $categoryModel->getCategory($idCategory);
        $directory = STAGING_ROOT_PATH . '/file/report/' . $category['dir'];

        if ($dh = opendir($directory)) {
            while (($file = readdir($dh)) !== false) {
                if ($file == "." || $file == "..") {
                    continue;
                }
                // 送信されたファイル名以外のファイルは削除
                if (!in_array($file, $fileNames)) {
                    // var_dump($file);
                    @unlink($directory . '/' . $file);
                }
            }
            closedir($dh);
        }
    }

    public function sortAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        if($this->getRequest()->isPost()) {

            // jsonで返すデータ
            $res = array(
                         'error' => true,
                         'message' => null,
            );

            // DB処理
                $ledgerItem = new Application_Model_DbTable_Ledgers();
                foreach ($_POST['list'] as $value) {
                    $ledgerItem->sortLedger($value['itemId'],$value['priority']);
                }


            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);

        }

    }

    /**
     * 帳票の(論理)削除
     */
    public function deleteAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        $itemId = $this->getParam('itemId', 0);
        if ($itemId > 0){
            // DB処理
            $ledgerItem = new Application_Model_DbTable_Ledgers();
            $ledgerItem->deleteLedger($itemId);
        }

        // 終了したら帳票一覧画面にリダイレクト
        return $this->_redirect('/ledger/ledger');
    }

    /**
     * 帳票の(論理)削除の取り消し
     */
    public function undeleteAction()
    {
        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();

        $itemId = $this->getParam('itemId', 0);
        if ($itemId > 0){
            // DB処理
            $ledgerItem = new Application_Model_DbTable_Ledgers();
            $ledgerItem->undeleteLedger($itemId);
        }

        // 終了したら帳票一覧画面にリダイレクト
        return $this->_redirect('/ledger/ledger');
    }

    //------------------------------------------------------------------------------
    // ディレクトリ階層以下のコピー
    // 引数: コピー元ディレクトリ、コピー先ディレクトリ
    // 戻り値: 結果
    public function dir_copy($dir_name, $new_dir)
    {
        // コピー先のディレクトリがなければ作成する
        if (!is_dir($new_dir)) {
            mkdir($new_dir);
        }

        if (is_dir($dir_name)) {
            if ($dh = opendir($dir_name)) {
                while (($file = readdir($dh)) !== false) {
                    if ($file == "." || $file == "..") {
                        continue;
                    }
                    if (is_dir($dir_name . "/" . $file)) {
                        $this->dir_copy($dir_name . "/" . $file, $new_dir . "/" . $file);
                    } else {
                        copy($dir_name . "/" . $file, $new_dir . "/" . $file);
                    }
                }
                closedir($dh);
            }
        }
        return true;
    }

    /**
     * 本番公開(現在の管理側の状態を本番に反映)
     */
    public function publishAction()
    {
        // データベースのテーブル群を管理側から本番側にコピー
        $publishSet = new Application_Model_DbTable_Publish();
        $publishSet->publish();

        // ファイル群を管理側から本番側にコピー
        // $this->dir_copy('./m1', './c1');
        $this->dir_copy(STAGING_ROOT_PATH . '/file/', PUBLISH_ROOT_PATH . '/file/');

        // 終了したら帳票一覧画面にリダイレクト
        return $this->_redirect('/index');

    }

    /**
     * リセット(現在の本番の状態を管理側に反映)
     */
    public function resetAction()
    {
        // データベースのテーブル群を本番側から管理側にコピー
        $publishSet = new Application_Model_DbTable_Publish();
        $publishSet->resetStage();

        // ファイル群を本番側から管理側にコピー
        $this->dir_copy(PUBLISH_ROOT_PATH . '/file/', STAGING_ROOT_PATH . '/file/');

        // 終了したら帳票一覧画面にリダイレクト
        return $this->_redirect('/index');
    }

// validation 設定
    public function check($post)
    {
        $error = false;
        $respons = array();

        // カテゴリ

        // 連番
        if ($post['idLedger'] == null || $post['idLedger'] === '') {
            $messages['idLedger'] = '連番を入力してください';
            $error = true;
        } else if (!preg_match('/[ー]$/', $post['idLedger'])) {
            $respons['idLedger'] = 'ハイフン（-）が全角です。';
            $error = true;
        }
        // セル背景色
        // 優先度
        // 帳票名
        if ($post['ledgerName'] == null || $post['ledgerName'] === '') {
            $messages['ledgerName'] = '帳票名を入力してください';
            $error = true;
        }
        // 注釈
        // 注釈色
        // 更新日
        // 優先度(未入力チェック、数字(0以上)チェック)
        if (!preg_match('/^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/', $post['dateUpdate'])) {
            $respons['dateUpdate'] = '更新日の形式が不正です';
            $error = true;
        }


        if ($error) {
            return $respons;
        }

        return true;
    }
};

