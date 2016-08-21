<?php

/**
 * ブートストラップ
 * ブートストラップではアプリケーションごとの初期化処理やルーティングを行い、アプリケーションを実行する
 */
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    public function __construct($application)
    {
        parent::__construct($application);

        $this->getResourceLoader()->addResourceTypes(array(
            'validator' => array(
                'namespace' => 'Validate',
                'path'      => 'validates',
            ),
            // 'element' => array(
            //     'namespace' => 'Element',
            //     'path'      => 'elements',
            // ),
        ));
    }

    protected function _initRoute()
    {
        // ルータオブジェクトを取得
        /*$this->bootstrap('frontController');

        $front = Zend_Controller_Front::getInstance();
        $router = $front->getRouter();*/

        // ルーティング設定
        /*$route = new Zend_Controller_Router_Route(
            'topic/:id',
            array(
                'module'     => 'default',
                'controller' => 'topic',
                'action'     => 'get'
            ),
            array('id' => '\d+')
        );*/

        // 設定追加
        // $router->addRoute('topic', $route);
    }

    // public function run()
    // {
    //     try {

    //         // データベースアダプタの初期化
    //         Self_DbAdapter::init();

    //         Zend_Db_Table::setDefaultAdapter(Zend_Registory::get('dbs.enquete'));
    //        // Zend_Loader_Autoloader::getInstance()->registerNamespace(array('bbnavi', 'red', 'expert'));

    //         // コントローラの初期化
    //         $front = Zend_Controller_Front::getInstance();
    //         $front->setControllerDirectory(APPLICATION_PATH . '/controllers');
    //         // アプリケーションのディスパッチを実行
    //         $front->dispatch();
    //     } catch (Exeption $e) {
    //         exit;
    //     }
    // }
}
