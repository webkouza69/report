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

}