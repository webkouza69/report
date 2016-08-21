<?php
/**
 * 統一帳票一覧更新トップページ用コントローラ
 */

class IndexController extends Zend_Controller_Action
{

    /*
     * 初期ページの表示
     */
    public function indexAction()
    {
        // トップ用カテゴリ一覧設定
        $ledItem = new Application_Model_DbTable_Categorys();
        $this->view->allCategorys = $ledItem->getAllCategory();

        $resultSet = new Application_Model_DbTable_Ledgers();
        $this->view->resultSet = $resultSet->getAllLedger();

        $rows = new Application_Model_DbTable_Ledgers();
        $this->view->rows = $rows->getCategories();

        $itemLedger = new Application_Model_DbTable_Ledgers();
        $this->view->itemLedger = $itemLedger->getLedger($id);

        $topLedgers = new Application_Model_DbTable_Topledgers();
        $this->view->topledgers = $topLedgers->fetchAll();


    }

    /**
     * カテゴリの追加
     */
    function addAction()
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

            $leadItem = new Application_Model_DbTable_Categorys();
                $leadItem->addCategory(
                $_POST['id'],
                $_POST['cateName'],
                $_POST['imgName'],
                $_POST['anchorName'],
                $_POST['priority'],
                $_POST['remarks'],
                $_POST['dir']
            );

            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);
        } else {
            $id = $this->getParam('id', 0);
            if($id > 0){
                $leadItem = new Application_Model_DbTable_Categorys();
            }
        }
    }

    /**
     * カテゴリの編集
     */
    function editAction()
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
                $leadItem = new Application_Model_DbTable_Categorys();
                $leadItem->updateCategory(
                $_POST['id'],
                $_POST['cateName'],
                $_POST['imgName'],
                $_POST['anchorName'],
                $_POST['priority'],
                $_POST['remarks'],
                $_POST['dir']
                );

            // ajaxでOKとかを返す
            $res['error'] = false;
            return $this->_helper->json->sendJson($res);

        } else {
            $id = $this->getParam('id', 0);
            if($id > 0){
                $leadItem = new Application_Model_DbTable_Categorys();
                $category = $leadItem->getCategory($id);
                $this->view->category = $category;
            }
        }

    }
    public function deleteAction()
    {
        if($this->getRequest()->isPost()) {
            $del = $this->getRequest()->getPost('del');
            if($del == 'Yes') {
                $id = $this->getRequest()->getPost('id');

            }
        }
    }

// validation 設定
    public static function check($post)
    {
        $error = false;

        $respons = array(
            'cateName'      => '',
            'imgName'    => '',
            'anchorName'   => '',
            'priority'   => '',
            'dir'   => '',
        );

        // カテゴリ名(未入力、文字数)
        if ($post['cateName'] == null || $post['cateName'] === '') {
            $respons['cateName'] = 'カテゴリ名を入力してください';
            $error = true;
        }

        // 画像名(未入力、文字数、拡張子)
        // if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~.]+$#', $post['imgName'])) {
        //     $respons['imgName'] = '半角で入力してください';
        //     $error = true;
        // }

        // // アンカー名(未入力、文字数、拡張子)
        // if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~]+$#', $post['anchorName'])) {
        //     $respons['anchorName'] = '半角で入力してください';
        //     $error = true;
        // }

        // // 優先度(未入力チェック、数字(0以上)チェック)
        // if (!preg_match('#^[a-zA-Z0-9!-/:-@¥[-`{-~]+$#', $post['priority'])) {
        //     $respons['priority'] = '半角数字で入力してください';
        //     $error = true;
        // }

        if ($post['dir'] == null || $post['dir'] === '') {
            $respons['dir'] = 'ディレクトリ名を入力してください';
            $error = true;
        } else if (!preg_match('/^[a-zA-Z0-9]{1,8}$/', $post['dir'])) {
            $respons['dir'] = '半角英数字で入力してください';
            $error = true;
        }

        if ($error) {
            return $respons;
        }

        return true;
    }




    /*
     * プレビューページの表示
     */
    public function previewAction()
    {
        $layout = Zend_Layout::getMvcInstance();
        $layout->setLayout('preview');
        $this->view->assign('url', ROOT_URI);}
};

