<?php
/**
 * 統一帳票ページ編集用コントローラ
 */
class HtmlController extends Zend_Controller_Action
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
        // ajax以外でのリクエストは拒否
        if (!$this->getRequest()->isXmlHttpRequest()) {
            throw new Zend_Controller_Action_Exception('', 404);
        }
    }

    /*
     * ページデータの取得処理
     */
    public function getAction()
    {
        $telNum = new Self_Models_Bbnavi_TelNumber();
        $ret    = $telNum->getHtml($this->getParam('name'));
        $retArr = array();
        if (empty($ret)) {
            $retArr = array(
                'state'   => 404,
                'message' => '「' . $this->getParam('name') . '」は見つかりませんでした',
            );
        } else {
            $retArr = array(
                'state'   => 200,
                'message' => '',
                'Data'    => $ret,
            );
        }
        $this->_helper->json($retArr, true);
    }

    /*
     * ページデータの保存処理
     */
    public function saveAction()
    {
        $telNum  = new Self_Models_Bbnavi_TelNumber();
        $name    = $this->getParam('name');
        $html    = $this->getParam('html');
        $updated = $this->getParam('updated');
        $ret     = $telNum->saveHtml($name, $html, $updated);
        $retArr  = array();
        if (is_array($ret)) {
            $retArr = array(
                'state' => 200,
                'Data'  => $ret,
            );
        } else {
            $retArr = array(
                'state'   => 404,
                'message' => $ret,
            );
        }
        $this->_helper->json($retArr, true);
    }

    /*
     * ページデータの本番への反映処理
     */
    public function updateAction()
    {
        $telNum = new Self_Models_Bbnavi_TelNumber();

        // 一旦HTMLを保存する
        $name    = $this->_getParam('name', '');
        $html    = $this->_getParam('html', '');
        $publish = $this->_getParam('publish', '');
        $updated = $this->_getParam('updated', '');
        $ret     = $telNum->saveHtml($name, $html, $updated);
        $retArr  = array();
        if (!is_array($ret)) {
            // エラーの場合はそのまま返す
            $retArr = array(
                'state'   => 404,
                'message' => $ret,
            );
            $this->_helper->json($retArr, true);
            return;
        } else {
            $retArr = array(
                'state' => 200,
                'Data'  => $ret,
            );
        }
        // エラーでない場合はファイルを保存する
        // 下記本番公開前のStaging公開用
        $prefix   = '_layoutitem2_';
        $fileName = SAVE_PATH . $prefix . $name . '.phtml';

        $configs = array(
            'indent'         => true,
            'wrap'           => 0,
            'tab-size'       => 2,
            'show-body-only' => true,
        );
        $tidy = tidy_parse_string($publish, $configs, 'UTF8');
        $tidy->cleanRepair();

        $publish = '<div id="mainmenu" class="layoutitem_a" name="layoutitem_2">' . "\n"
        . '  <?= $this->render("_common/summary.phtml") ?>' . "\n"
        . '  <h2 class="part-title">問合せ一覧</h2>' . "\n"
        . '  <?php include("_menu.phtml"); ?>' . "\n"
        . $tidy->value . "\n"
        . '</div>';

        try {
            file_put_contents($fileName, $publish);
            // ファイルの公開日を保存する
            $ret = $telNum->publish($name);
            if (is_array($ret)) {
                $retArr = array(
                    'state' => 200,
                    'Data'  => $ret,
                );
            } else {
                $retArr = array(
                    'state'   => 404,
                    'message' => $ret,
                );
            }
        } catch (Exeption $e) {
            $retArr = array(
                'state'   => 404,
                'message' => $e->getMessage(),
            );
        }
        return $this->_helper->json($retArr, true);
    }

};
