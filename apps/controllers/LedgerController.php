<?php
/**
 * 統一帳票一覧更新用コントローラ
 */

class LedgerController extends Zend_Controller_Action
{

    /*
     * 初期ページの表示
     */
    public function ledgerAction()
    {
        // カテゴリーを取得する

        // 帳票一覧表示設定
        $resultSet = new Application_Model_DbTable_Ledgers();
        $this->view->resultSet = $resultSet->getAllLedger();

        $rows = new Application_Model_DbTable_Ledgers();
        $this->view->rows = $rows->getCategories();

        $itemLedger = new Application_Model_DbTable_Ledgers();
        $this->view->itemLedger = $itemLedger->getLedger($id);

        $ledItem = new Application_Model_DbTable_Categorys();
        $this->view->allCategory = $ledItem->getAllCategory();

        //Zend_Layoutのインスタンスの取得
        $layout = $this->_helper->layout;
        //部品の作成
        $ledger = $this->view->render('./ledger/ledger.phtml');
        //部品の登録
        $layout->assign('ledger', $ledger);

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

            $checkResult = self::check($_POST);
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
                $_POST['remarks'],
                $_POST['comment'],
                $_POST['bgColor'],
                $_POST['dateUpdate'],
                $_POST['priority']
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
                $_POST['remarks'],
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

       function sortAction()
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

    public function deleteAction()
    {

        // layoutsのindex.phtmlを読み込まさない設定
        $this->_helper->layout()->disableLayout();



        $itemId = $this->getParam('itemId', 0);

        if($itemId > 0){
            // DB処理
                $ledgerItem = new Application_Model_DbTable_Ledgers();
                $ledgerItem->deleteLedger($itemId);
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
        return $this->_redirect('/ledger/ledger');

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
        return $this->_redirect('/ledger/ledger');
    }

// validation 設定
    public static function check($checkResult)
    {
        $error = false;

        $respons = array(
            'idLedger'      => '',
            'ledgerName'    => '',
            'dateUpdate'   => '',
            'ledgerFile'   => '',
        );

        /*if (!$checkResult['cateName']) {
            $respons['cateName'] = 'カテゴリ入力してください';
            $error = true;
        }

        if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~]+$#', $checkResult['imgName'])) {
            $respons['imgName'] = '半角で入力してください';
            $error = true;
        }

        if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~]+$#', $checkResult['anchorName'])) {
            $respons['anchorName'] = '半角で入力してください';
            $error = true;
        }

        if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~]+$#', $checkResult['priority'])) {
            $respons['priority'] = '半角数字で入力してください';
            $error = true;
        }*/

        if ($error) {
            return $respons;
        }

        return true;
    }
};

