<?php
/**
 * 統一帳票一覧更新トップページ用コントローラ
 */
class IndexController extends Zend_Controller_Action
{

    /*
     * コントローラの初期化処理
     */
    public function init()
    {
    }

    /*
     * ディスパッチループ初期化処理
     */
    public function preDispatch()
    {
        // ajaxでのリクエストやGET以外でのリクエストは拒否
        if ($this->getRequest()->isXmlHttpRequest()
            or !$this->getRequest()->isGet()) {
            throw new Zend_Controller_Action_Exception('', 404);
        }
    }

    /*
     * 初期ページの表示
     */
    public function indexAction()
    {
        // 問合せのリストを取得する
        $telNum = new Self_Models_Bbnavi_TelNumber();
        $this->view->assign('in_list', $telNum->getInternalArray());
        $this->view->assign('ex_list', $telNum->getExternalArray());
        $this->view->assign('url', ROOT_URI);
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
