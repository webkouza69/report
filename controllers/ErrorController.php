<?php

class ErrorController extends Zend_Controller_Action
{

    /**
     * エラーのコード
     * @var string
     */
    private $_code = 404;
    /**
     * エラーのタイトル
     * @var string
     */
    private $_title = '';

    /**
     * エラーのメッセージ
     * @var string
     */
    private $_msg = '';

    // イニシャライズ処理
    public function init()
    {
    }

    // エラー処理
    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');

        // 開発環境用にエラーログを出力
        if (APPLICATION_ENV === 'development') {
            $path = APPLICATION_PATH . "/logs/error.log";
            $logger = new Zend_Log();
            $writer = new Zend_Log_Writer_Stream($path);

            $logger->addWriter($writer);
            $logger->log($errors->exception->getMessage(), Zend_Log::ERR);
            chmod($path, 0666);
        }

        switch ($errors->type) {
            case EXCEPTION_NO_ROUTE:
            case EXCEPTION_NO_CONTROLLER:
            case EXCEPTION_NO_ACTION:
                // 無効なページが呼び出された時の処理
                $this->_code  = 404;
                $this->_title = '404 Not Found not not';
                $this->_msg   = 'ページが見つかりませんでした。通過';
                break;
            default:
                // その他エラー時
                $this->_code  = 500;
                $this->_title = '500 Internal Server Error';
                $this->_msg   = "サーバ内部にてエラーが発生しました。\n\n" . $errors->exception->getMessage();
                break;
        }

        // httpレスポンスコードの設定
        $this->getResponse()->setHttpResponseCode($this->_code);

        if ($this->getRequest()->isXmlHttpRequest()) {
            // ajaxのレスポンス
            $res = array(
                'code'    => $this->_code,
                'title'   => $this->_title,
                'message' => $this->_msg,
            );
            $this->_helper->json($res, true);
        } else {
            // 通常のレスポンス
            $this->view->assign('title', $this->_title);
            $this->view->assign('message', $this->_msg);
        }
        // 前回の内容を消去します
        $this->getResponse()->clearBody();
    }
}
