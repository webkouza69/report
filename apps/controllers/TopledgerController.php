<?php
/**
 * 統一帳票一覧更新用コントローラ
 */

class TopledgerController extends Zend_Controller_Action
{

    /*
     * 初期ページの表示
     */
    public function ledgertopAction()
    {
        // カテゴリーを取得する

        // ファイル情報表示設定
        $topLedgers = new Application_Model_DbTable_Topledgers();
        $this->view->topledgers = $topLedgers->fetchAll();

    }


    function topeditAction()
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

            // 現在のデータを1件取得
            $fileDetail = $this->ledgertopAction($id);


            // 現在のデータと、送信されたデータのファイル名が違う場合は、現在のデータ側のファイルを削除
            if($_POST['fileName'] !== $fileDetail){
                unlink('./file/'.$fileDetail);
            }

            // DB処理
                $fileTop = new Application_Model_DbTable_Topledgers();
                $fileTop->updateTopLedger(
                $_POST['id'],
                $_POST['fileName'],
                $_POST['fileSize'],
                $_POST['bikou']
                );

            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);

        } else {


            $id = $this->getParam('id', 0);

            if($id > 0){
                $fileTop = new Application_Model_DbTable_Topledgers();
                $topledgers = $fileTop->updateTopLedger($id);
                $this->view->topledgers = $topledgers;


            }
        }

    }


// validation 設定
    public static function check($checkResult)
    {
        $error = false;

        $respons = array(
            'id'      => '',
            'fileName'    => '',
            'fileSize'   => '',
            'bikou'   => '',
        );

        if (!$checkResult['fileName']) {
            $respons['fileName'] = 'ファイル選択してください';
            $error = true;
        }
        if (!$checkResult['fileSize']) {
            $respons['fileSize'] = 'カテゴリ入力してください';
            $error = true;
        }

        if ($error) {
            return $respons;
        }

        return true;
    }

}